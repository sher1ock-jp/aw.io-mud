import { scene, world, groundMaterial } from './main';
import { myColors } from './config';
import socket from '../socket';
import store from '../store';

import * as THREE from 'three';
import * as CANNON from 'cannon';

type FoodData = {
    type: 'box' | 'moon' | 'sphere';
    params: number[];
    x: number;
    y: number;
    z: number;
};

export function createFood(id: string, data:FoodData): THREE.Mesh{
    const someColors = myColors();
    let count = 0;

    const color = Object.keys(someColors).reduce((acc, prop) => {
      if (Math.random() < 1 / ++count) {
        acc = prop;
      }
      return acc;
    }, "");

    let geometry;
    let material;
    let shape;

    const { type, params, x, y, z } = data;
    switch(type) {
        case "box":
            geometry = new THREE.BoxGeometry(params[0], params[1], params[2]);
            material = new THREE.MeshPhongMaterial({ color: someColors[color], flatShading: true });
            shape = new CANNON.Box(new CANNON.Vec3(params[0] / 2, params[1] / 2, params[2] / 2));
            break;
        case "moon":
            geometry = new THREE.IcosahedronGeometry(params[0],1);
            material = new THREE.MeshPhongMaterial({ color: "#F8B195", flatShading: true });
            shape = new CANNON.Sphere(params[0]);
            break;
        case "sphere":
            default:
                geometry = new THREE.TetrahedronGeometry(params[0], 1);
                material = new THREE.MeshPhongMaterial({ color: someColors[color], flatShading: true });
                shape = new CANNON.Sphere(params[0]);
                break;
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = id;
    mesh.castShadow = true;
    mesh.position.set(x, y, z);

    if(type === "moon") {
        mesh.position.normalize().multiplyScalar(500);
    } else {
        mesh.position.normalize().multiplyScalar(400);
    }
    mesh.position.add(mesh.position.clone().normalize().multiplyScalar(params[0] * 2.5));

    mesh.lookAt(new THREE.Vector3(0, 0, 0));

    const cannonBody = new CANNON.Body({
        shape, mass: 0, material: groundMaterial
    });
    cannonBody.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    cannonBody.quaternion.set(-mesh.quaternion.x, -mesh.quaternion.y, -mesh.quaternion.z, mesh.quaternion.w);

    if(type === "moon"){
        cannonBody.collisionResponse = true;
    } else {
        cannonBody.collisionResponse = false;
    }

    cannonBody.addEventListener('collide', e => {
        const player = scene.getObjectByName(socket.id);
        if (!mesh.userData.eaten && player) {
          for (const contact of world.contacts) {
            const foodHits = contact.bi === cannonBody;
            const playerIsHit = contact.bj === (player as any).cannon;
            const playerHits = contact.bi === (player as any).cannon;
            const foodIsHit = contact.bj === cannonBody;
            if (foodHits && playerIsHit || playerHits && foodIsHit) {
              const playerVol = store.getState().players[socket.id].volume;
              const foodVol = cannonBody.shapes[0].volume();
    
              if (playerVol > foodVol) {
                mesh.userData.eaten = true;
                socket.emit('eat_food', id, foodVol + playerVol);
              }
            }
          }
        }
      });
    
      scene.add(mesh);
      world.add(cannonBody);
      mesh.userData.cannon = cannonBody;
    
      return mesh;
}



