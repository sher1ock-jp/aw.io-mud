import { buildUp, launch, launchReady } from '../reducers/abilities';
import store from '../store';
import socket from '../socket';
import * as THREE from 'three';
import * as CANNON from 'cannon';

interface PlayerControlsConfig {
    camera: THREE.PerspectiveCamera;
    player: THREE.Object3D;
    cannonMesh: CANNON.Body;
    id: string;
}

class PlayerControls extends THREE.EventDispatcher {
    private domElement: Document;
    private camera: THREE.PerspectiveCamera;
    private player: THREE.Object3D;
    private cannonMesh: CANNON.Body;
    private id: string;
    private cooldown: number;
    private scale = 1; // temporary scale

    private speedMult = 1;
    private launchMult = 1;
    private i = 1;

	private curCamZoom = 60;
	private curCamHeight = 70;

	private cameraReferenceOrientation = new THREE.Quaternion();
	private cameraReferenceOrientationObj = new THREE.Object3D();

    private playerRotation: THREE.Quaternion = new THREE.Quaternion();
    private left = false;
    private right = false;

    private keyState: { [keyCode: number]: boolean } = {};

    constructor({ camera, player, cannonMesh, id }: PlayerControlsConfig) {
        super();

        this.domElement = document;
        this.camera = camera;
        this.player = player;
        this.cannonMesh = cannonMesh;
        this.id = id;
        this.cooldown = Date.now();

        this.domElement.addEventListener('contextmenu', this.onContextMenu, false);
        this.domElement.addEventListener('keydown', this.onKeyDown, false);
        this.domElement.addEventListener('keyup', this.onKeyUp, false);
    }

    private onContextMenu(event: Event): void {
        event.preventDefault();
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        this.keyState[event.keyCode || event.which] = true;
    }

    private onKeyUp = (event: KeyboardEvent): void => {
        this.keyState[event.keyCode || event.which] = false;
    }

    public update(): void {
        // fov scales according to scale and speedMult
		this.scale = store.getState().players[this.id].scale;
		this.camera.fov = Math.max(55, Math.min(45 + this.speedMult*10, 65/(1 + (this.scale * 0.01) )));
		this.camera.updateProjectionMatrix();

		if(!store.getState().abilities.launch && Date.now() - this.cooldown > 8.5 * 1000){
			store.dispatch(launchReady());
		}

		this.checkKeyStates();

		// now we position and orient the camera with respect to player and planet using matrix transforms
		const playerPosition = new THREE.Vector3(this.player.position.x, this.player.position.y, this.player.position.z);

		const cameraPosition = this.player.position.clone();
		const poleDirection = new THREE.Vector3(1,0,0)

		const localUp = cameraPosition.clone().normalize();

		if(this.left){
			this.cameraReferenceOrientationObj.rotation.y = 0.05;
			this.left = false;
		}
		else if(this.right){
			this.cameraReferenceOrientationObj.rotation.y = -0.05;
			this.right = false;
		}

		const referenceForward = new THREE.Vector3(0, 0, 1);
		referenceForward.applyQuaternion(this.cameraReferenceOrientationObj.quaternion);

		const correctionAngle = Math.atan2(referenceForward.x, referenceForward.z)
		const cameraPoru = new THREE.Vector3(0,-1,0);

		this.cameraReferenceOrientationObj.quaternion.setFromAxisAngle(cameraPoru,correctionAngle);
		poleDirection.applyAxisAngle(localUp,correctionAngle).normalize();

		this.cameraReferenceOrientationObj.quaternion.copy(this.cameraReferenceOrientation);

		const cross = new THREE.Vector3();
		cross.crossVectors(poleDirection,localUp);

		const dot = localUp.dot(poleDirection);
		poleDirection.subVectors(poleDirection , localUp.clone().multiplyScalar(dot));

		const cameraTransform = new THREE.Matrix4();
		cameraTransform.set(	poleDirection.x,localUp.x,cross.x,cameraPosition.x,
			poleDirection.y,localUp.y,cross.y,cameraPosition.y,
			poleDirection.z,localUp.z,cross.z,cameraPosition.z,
					0,0,0,1);

		this.camera.matrixAutoUpdate = false;

		const cameraPlace = new THREE.Matrix4();
		cameraPlace.makeTranslation ( 0, this.curCamHeight * this.scale * .8, this.curCamZoom * this.scale * .8)

		const cameraRot = new THREE.Matrix4();
		cameraRot.makeRotationX(-0.32 - (playerPosition.length()/1200));

		const oneTwo = new THREE.Matrix4();
		oneTwo.multiplyMatrices(cameraTransform , cameraPlace);

		const oneTwoThree = new THREE.Matrix4();
		oneTwoThree.multiplyMatrices(oneTwo, cameraRot);

		this.camera.matrix = oneTwoThree;
	}
	

    private checkKeyStates(): void {
        const { isChatting } = store.getState().gameState;

		if(this.speedMult < 1){ this.speedMult = 1}

		// get quaternion and position to apply impulse
		const playerPositionCannon = new CANNON.Vec3(this.cannonMesh.position.x, this.cannonMesh.position.y, this.cannonMesh.position.z);

		// get unit (directional) vector for position
		const norm = playerPositionCannon.normalize();

		const localTopPoint = new CANNON.Vec3(0,0,500);
		const topVec = new CANNON.Vec3(0,0,1);
		const quaternionOnPlanet = new CANNON.Quaternion();
		quaternionOnPlanet.setFromVectors(topVec, playerPositionCannon);
		const topOfBall = quaternionOnPlanet.vmult(new CANNON.Vec3(0,0,norm).vadd(new CANNON.Vec3(0,0, this.scale * 10)));

		// find direction on planenormal by crossing the cross prods of localUp and camera dir
		const camVec = new THREE.Vector3();
		this.camera.getWorldDirection( camVec );
		camVec.normalize();

		// apply downward force to keep ball rolling
		const downforce = new THREE.Vector3(0,-1,0);
		const dfQuat = new THREE.Quaternion()
		this.camera.getWorldQuaternion( dfQuat );
		downforce.applyQuaternion(dfQuat);

		camVec.add(downforce.divideScalar(2));
		camVec.normalize()

		const playerPosition = new THREE.Vector3(this.player.position.x, this.player.position.y, this.player.position.z);
		playerPosition.normalize();

		// lateral directional vector
		const cross1 = new THREE.Vector3();
		cross1.crossVectors(playerPosition, camVec);

		// front/back vector
		const cross2 = new THREE.Vector3();
		cross2.crossVectors(playerPosition, cross1);

		if (this.keyState[32] && !isChatting) {
			if(store.getState().abilities.launch){
				// build up launchMult if spacebar down
				if(this.launchMult < 6) this.launchMult += 1/(this.i++ * 1.1);
				const buildLaunch = ~~(this.launchMult * 3 - 3);
				store.dispatch(buildUp(buildLaunch));
			}
		}

		if (this.keyState[38] || this.keyState[87] && !isChatting) {
			if(this.speedMult < 3.5) this.speedMult += 0.005;
			// up arrow or 'w' - move forward
			this.cannonMesh.applyImpulse(new CANNON.Vec3(-cross2.x * 150 * (0.833 + this.scale/6) *this.speedMult, -cross2.z * 150 * (0.833 + this.scale/6) *this.speedMult, -cross2.y * 150 * (0.833 + this.scale/6) *this.speedMult) ,topOfBall);
		}

		if (this.keyState[40] || this.keyState[83] && !isChatting) {
			if(this.speedMult < 3.5) this.speedMult += 0.005;
			// down arrow or 's' - move backward
			this.cannonMesh.applyImpulse(new CANNON.Vec3(cross2.x * 150 * (0.833 + this.scale/6) *this.speedMult, cross2.z * 150 * (0.833 + this.scale/6) *this.speedMult, cross2.y * 150 * (0.833 + this.scale/6) *this.speedMult) ,topOfBall);
		}

		if (this.keyState[37] || this.keyState[65] && !isChatting) {
			if(this.speedMult < 3.5) this.speedMult += 0.005;
			// left arrow or 'a' - rotate left
			this.cannonMesh.applyImpulse(new CANNON.Vec3(cross1.x * 100 * (0.833 + this.scale/6) * this.speedMult, cross1.z * 100 * (0.833 + this.scale/6) * this.speedMult, cross1.y * 100 * (0.833 + this.scale/6) * this.speedMult) ,topOfBall);
			this.left = true;
		}

		if (this.keyState[39] || this.keyState[68] && !isChatting) {
			if(this.speedMult < 3.5) this.speedMult += 0.005;
			// right arrow or 'd' - rotate right
			this.cannonMesh.applyImpulse(new CANNON.Vec3(-cross1.x * 100 * (0.833 + this.scale/6) * this.speedMult,-cross1.z * 100 * (0.833 + this.scale/6) * this.speedMult,-cross1.y * 100 * (0.833 + this.scale/6) * this.speedMult), topOfBall);
			this.right = true;
		}
		if(!(this.keyState[38] || this.keyState[87] && !isChatting || this.keyState[40] || this.keyState[83] && !isChatting || this.keyState[37] || this.keyState[65] && !isChatting || this.keyState[39] || this.keyState[68] && !isChatting)){
			// decrement speedMult when no keys down
			this.speedMult -= .06;
		}

		// launch if spacebar up and launchMult greater than 1
		if (!this.keyState[32] && this.launchMult > 1  && !isChatting) {

			const camVec2 = new THREE.Vector3();
			this.camera.getWorldDirection( camVec2 );
			camVec2.normalize();

			// apply upward force to launch
			const upforce = new THREE.Vector3(0,1,0);
			const ufQuat = new THREE.Quaternion()
			this.camera.getWorldQuaternion( ufQuat );
			upforce.applyQuaternion(ufQuat);

			camVec2.add(upforce.divideScalar(1));
			camVec2.normalize();

			const cross1o = new THREE.Vector3();
			cross1o.crossVectors(playerPosition, camVec2);
			const cross2o = new THREE.Vector3();
			cross2o.crossVectors(playerPosition, cross1o);

			const launchIntoOrbit = new THREE.Vector3();
				if(this.keyState[38] || this.keyState[87]){
				launchIntoOrbit.copy(cross2o).negate();
			}else
			if (this.keyState[40] || this.keyState[83]) {
				launchIntoOrbit.copy(cross2o);
			}else
			if (this.keyState[37] || this.keyState[65]) {
				launchIntoOrbit.copy(cross1o);
			}else
			if (this.keyState[39] || this.keyState[68]) {
				launchIntoOrbit.copy(cross1o).negate();
			}
			else{
				launchIntoOrbit.copy(playerPosition).normalize().divideScalar(1);
			}

			store.dispatch(launch());

			// reduce own volume if greater than 3500
			if(store.getState().players[this.id].volume > 3500){
				socket.emit('launched', this.launchMult);
			}

			this.cannonMesh.applyImpulse(new CANNON.Vec3(launchIntoOrbit.x * 3500 * this.launchMult , launchIntoOrbit.z * 3500 * this.launchMult , launchIntoOrbit.y * 3500 * this.launchMult ), topOfBall);
			this.cooldown = Date.now();

			this.launchMult = 1;
			this.i = 1;
		}
    }
}

export default PlayerControls;
