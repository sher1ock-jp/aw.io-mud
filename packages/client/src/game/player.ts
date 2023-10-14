// Importing essential libraries.
import * as THREE from 'three';   // Three.js for 3D rendering.
import * as CANNON from 'cannon'; // Cannon.js for physics simulation.

// Importing necessary modules and configurations.
import PlayerControls from './playerControls';
import store from '../store';
import socket from '../socket';
import { makeTextSprite } from './utils';
import { ballMaterial, camera, scene, world } from './main';
import { playerColors } from './config';

// Importing custom type definitions.
import { PlayerData } from '../types/DataTypes';
import { CustomMesh } from '../types/meshTypes';

// Constants and global variables.
const COLLISION_COOLDOWN = 5000; // Cooldown period to avoid rapid-fire collision events.
let lastEaten = Date.now();      // Timestamp of the last time a player was "eaten".
let controls: PlayerControls;    // Player's control instan

export class Player {
    private id: string;
    private initialData: PlayerData;
    private isMainPlayer: boolean;
    public mesh?: CustomMesh;

    constructor(id: string, data: PlayerData, isMainPlayer: boolean) {
        this.id = id;
        this.initialData = data;
        this.isMainPlayer = isMainPlayer;
    }

    get meshData() {    
        return this.mesh ? {
            x: this.mesh.position.x,
            y: this.mesh.position.y,
            z: this.mesh.position.z,
            qx: this.mesh.quaternion.x,
            qy: this.mesh.quaternion.y,
            qz: this.mesh.quaternion.z,
            qw: this.mesh.quaternion.w,
        } : {};
    }

    private getRandomColor() {
        const someColors = playerColors();
        const colorKeys = Object.keys(someColors);
        const randomKey = colorKeys[~~(Math.random() * colorKeys.length)];
        return someColors[randomKey];
    }

    private createThreeMesh() {
        const geometry = new THREE.TetrahedronGeometry(10, 2);
        const material = new THREE.MeshPhongMaterial({
            color: this.getRandomColor(),
            flatShading: true,
        });
        return new THREE.Mesh(geometry, material) as CustomMesh;
    }

    private createCannonBody(isMain: boolean) {
        const shape = new CANNON.Sphere(10);
        if (isMain) {
            const body = new CANNON.Body({
                shape,
                mass: 35,
                material: ballMaterial,
            });
            body.linearDamping = body.angularDamping = 0.41;
            return body;
        }
        return new CANNON.Body({ shape, mass: 0 });
    }

    private handleGravityForMain(mesh: CustomMesh) {
        mesh.cannon!.preStep = function () {
            let ball_to_planet = new CANNON.Vec3();
            this.position.negate(ball_to_planet);
            
            const distance = ball_to_planet.norm();
            ball_to_planet.normalize();
            ball_to_planet = ball_to_planet.scale(4500000 * this.mass / distance ** 2);
            
            world.gravity.set(ball_to_planet.x, ball_to_planet.y, ball_to_planet.z);
        };
    }

    private handleCollisionForOtherPlayers(mesh: CustomMesh) {
        mesh.cannon!.addEventListener('collide', (_e: any) => {
            const { players } = store.getState();
            const player = scene.getObjectByName(socket.id) as CustomMesh;

            if (!player || Date.now() - lastEaten <= COLLISION_COOLDOWN) return;

            for (const contact of world.contacts) {
                const thisHits = contact.bi === mesh.cannon;
                const mainIsHit = contact.bj === player.cannon;
                const mainHits = contact.bi === player.cannon;
                const thisIsHit = contact.bj === mesh.cannon;

                if (thisHits && mainIsHit || mainHits && thisIsHit) {
                    const mainVol = players[socket.id].volume;
                    const thisVol = players[this.id].volume;

                    if (thisVol > mainVol) {
                        lastEaten = Date.now();
                        socket.emit('got_eaten', this.id, thisVol + mainVol);
                    }
                }
            }
        });
    }

    // Method to initialize the player's mesh, set its position, and apply special behaviors.
    init() {
        const mesh = this.createThreeMesh();
        mesh.cannon = this.createCannonBody(this.isMainPlayer);
        mesh.castShadow = true;
        
        // set spawn position according to server socket message
        mesh.position.x = this.initialData.x;
        mesh.position.y = this.initialData.y;
        mesh.position.z = this.initialData.z;
    
        // set spawn somewhere a bit in the air
        mesh.position.normalize().multiplyScalar(500);
        mesh.position.multiplyScalar(1.4);
    
        mesh.quaternion.x = this.initialData.qx;
        mesh.quaternion.y = this.initialData.qy;
        mesh.quaternion.z = this.initialData.qz;
        mesh.quaternion.w = this.initialData.qw;
    
        mesh.name = this.id;
        mesh.nickname = this.initialData.nickname;
    
        // add pivot to attach food to
        const pivot = new THREE.Group();
        mesh.add(pivot);
    
        // add Cannon body
        mesh.cannon.position.x = mesh.position.x;
        mesh.cannon.position.z = mesh.position.y;
        mesh.cannon.position.y = mesh.position.z;
        mesh.cannon.quaternion.x = -mesh.quaternion.x;
        mesh.cannon.quaternion.z = -mesh.quaternion.y;
        mesh.cannon.quaternion.y = -mesh.quaternion.z;
        mesh.cannon.quaternion.w = mesh.quaternion.w;
        
        scene.add(mesh);
        world.add(mesh.cannon);

        if (this.isMainPlayer) {
            this.handleGravityForMain(mesh);
        } else {
            this.handleCollisionForOtherPlayers(mesh);
        }
        
        this.mesh = mesh;
        
        if (this.isMainPlayer && this.mesh.cannon) {
            controls = new PlayerControls({
                camera: camera,
                player: this.mesh,
                cannonMesh: this.mesh.cannon,
                id: this.id
            });
        }
    }
}

export { controls };
