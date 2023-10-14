import { forOwn } from 'lodash';
import store from '../store';
import socket from '../socket';

import { getMeshData, setCannonPosition, setMeshPosition } from './utils';
import { fixedTimeStep, maxSubSteps, foodColors } from './config';
import LoadEnvironment from './game';
import { controls, Player } from './player';
import { Food } from './food';
import { removeAllFood } from '../reducers/food';
import { initialized, stopGame } from '../reducers/gameState';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';


let animateTimeout: number;
let scene: any;
let camera: any;
let canvas: HTMLCanvasElement;
let renderer: THREE.WebGLRenderer;
let composer: any;
let pass: any;
let shader: any;
let world: any;
let groundMaterial: CANNON.Material;
let ballMaterial: any;
let groundGroundCm: any;
let shadowLight: any;
let geometry; 
let material;
let groundShape; 
let groundBody;
let hemisphereLight;
let ambientLight;
const timeFromStart = Date.now();
let time; 
let lastTime;
let afkCall: any;
const someColors = foodColors();

export const init = (): void => {
    setupStoreAndEvents();
    initializeScene();
    initializePlayersAndFood();
    setupWorld();
    createLevel();
    setupLighting();
    LoadEnvironment();
    setupPostProcessing();
    window.addEventListener('resize', onWindowResize, false);
}

const setupStoreAndEvents = (): void => {
    store.dispatch(initialized());
    console.log('initialized');

    window.onfocus = () => clearTimeout(afkCall);

    window.onblur = () => {
        afkCall = setTimeout(() => {
          store.dispatch(stopGame());
          store.dispatch(removeAllFood());
          console.log('onblur');
          socket.emit('leave');
        }, 60 * 1000);
    };
}

// Setup the main rendering scene, camera and renderer.
const initializeScene = (): void => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        1,
        2500,
    );
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    renderer = new THREE.WebGLRenderer({ alpha: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
        window.innerWidth,
        window.innerHeight,
        false,
    );
    scene.add(camera);

    // shading
    renderer.shadowMap.enabled = true;
    // renderer.shadowMapSoft = true;
}

 // Create player and food meshes based on the state in the Redux store.
const initializePlayersAndFood = (): void => {
    const { players, food } = store.getState();

    // Using the `forOwn` function from `lodash` to iterate over players in the store's state. 
    // For each player, a new Player instance is created and initialized. The main player's instance 
    // (the one corresponding to the socket's ID) will have the `isMainPlayer` flag set.
    forOwn(players, (data, id) => {
        const isMainPlayer = id === socket.id;
        const newPlayer = new Player(id, data, isMainPlayer);
        newPlayer.init();
    });
    
    // Similarly, for each food item in the store's state, a new Food instance is created and initialized.
    forOwn(food, (data, id) => {
        const newFood = new Food(id, data);
        newFood.init();
    });
}

 // Setup the main rendering scene, camera and renderer.
const setupWorld = (): void => {
    world = new CANNON.World();
    world.gravity.set(0, 0, 0); // Setting the world's gravity to zero, making objects not fall in any direction.
    world.broadphase = new CANNON.NaiveBroadphase(); // Broadphase algorithm for detecting potential collision pairs.

    // Creating materials for ground and ball with Cannon.js to control their physical properties.
    groundMaterial = new CANNON.Material('groundMaterial');
    ballMaterial = new CANNON.Material('ballMaterial');
    groundGroundCm = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
        friction: 0.9,
        restitution: 0.0,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
        // frictionEquationRegularizationTime: 3,
        frictionEquationRelaxation: 3,
    });
    const ballCm = new CANNON.ContactMaterial(ballMaterial, ballMaterial, {
        friction: 0.0,
        restitution: 0.9,
    });
    world.addContactMaterial(groundGroundCm);
    world.addContactMaterial(ballCm);

    createLevel();
}

// Create the main level (planet and its surrounding particles).
function createLevel() {
    // planet creation
    const planet_geometry = new THREE.TetrahedronGeometry(500, 4);
    const planet_material = new THREE.MeshPhongMaterial({ color: someColors.red, flatShading: true});
    const planet = new THREE.Mesh(planet_geometry, planet_material);
    
    planet.receiveShadow = true;

    scene.add(planet);

    // create Cannon planet
    const planetShape = new CANNON.Sphere(500);
    const planetBody = new CANNON.Body({ mass: 0, material: groundMaterial, shape: planetShape });
    world.add(planetBody); // type error

    const particleCount = 1800;
    const positions = new Float32Array(particleCount * 3); // 3 vertices per point
    const pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 2,
    });
    
    for (let p = 0; p < particleCount; p++) {
        positions[p * 3] = (Math.random() * 1000 - 500);     // x
        positions[p * 3 + 1] = (Math.random() * 1000 - 500); // y
        positions[p * 3 + 2] = (Math.random() * 1000 - 500); // z
    }
    
    const particles = new THREE.BufferGeometry();
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);
}

const setupLighting = (): void => {
    const hemisphereLight = new THREE.HemisphereLight('#004570', someColors.pink, 0.8);

    const shadowLight = new THREE.DirectionalLight('#4ECDC4', 0.3);

    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 512;
    shadowLight.shadow.mapSize.height = 512;

    scene.add(hemisphereLight);
    scene.add(shadowLight);

    const ambientLight = new THREE.AmbientLight(someColors.green, 0.5);
    scene.add(ambientLight);

    LoadEnvironment();
}

const setupPostProcessing = (): void => {
    // effect composer for post-processing (renderer goes thru this)
    const parameters = {
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false,
    };

    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);

    composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(new RenderPass(scene, camera));

    const vignetteShader = new ShaderPass(VignetteShader);
    vignetteShader.renderToScreen = true;
    composer.addPass(vignetteShader);

    // Events
    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      window.innerWidth,
      window.innerHeight,
      false,
    );
}

let prevTs: number;
let requestedFrame: number;

// Main animation loop. This function continuously updates the scene and its objects.
export function animate(ts: number): void{
    requestedFrame = requestAnimationFrame(animate);

    if(prevTs == undefined){
        prevTs = ts;
    }

    if (ts - prevTs < (1000 / 30)) {
        return;
        }

    prevTs = ts;

    const { players } = store.getState();

    const playerMesh = scene.getObjectByName(socket.id);
    
    // If the player's mesh exists, then updating game state and rendering the scene.
    if(playerMesh){
        socket.emit('update_position', getMeshData(playerMesh));
        // Set the direction of the light
        shadowLight.position.copy(playerMesh.position);
        shadowLight.position.multiplyScalar(1.2);

        // receive and process controls and camera
        if (controls) controls.update();

        // sync THREE mesh with Cannon mesh
        // Cannon's y & z are swapped from THREE, and w is flipped
        if (playerMesh.cannon) setMeshPosition(playerMesh);

        // for all other players
        forOwn(players, (currentPlayer, id) => {
            const currentMesh = scene.getObjectByName(id);
            if (currentPlayer.socketId !== socket.id && currentMesh) setCannonPosition(currentMesh);
        });
        LoadEnvironment();
        render();
    } else {
        store.dispatch(stopGame());
        store.dispatch(removeAllFood());
        console.log('nomesh');
        cancelAnimationFrame(requestedFrame);
        socket.emit('leave');
      }
}

function render() {
    renderer.clear();
    composer.render();
}


export {
    scene, camera, canvas, renderer, world, groundMaterial, ballMaterial, timeFromStart,
};