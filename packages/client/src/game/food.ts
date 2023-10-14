import { scene, world, groundMaterial } from './main';
import { foodColors } from './config';
import socket from '../socket';
import store from '../store';

import * as THREE from 'three';
import * as CANNON from 'cannon';

import { FoodData } from '../types/DataTypes';

import {
  CustomMesh,
} from '../types/meshTypes';

export class Food {
  private id: string;
  private initialData: FoodData;
  public mesh?: CustomMesh;
  private eaten: boolean;
  private color: string | null = null;

  constructor(id: string, data: FoodData) {
    this.id = id;
    this.initialData = data;
    this.eaten = false;
  }

  init(): void {
    const someColors = foodColors();
    let count = 0;

    for (const prop in someColors) {
      if (Math.random() < 1 / ++count) {
        this.color = prop;
      }
    }

    if (this.color == null) {
      throw new Error("No color was selected for the food");
    }

    const { type, params, x, y, z } = this.initialData;
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;
    let shape: CANNON.Shape;

    switch (type) {
      case 'box':
        geometry = new THREE.BoxGeometry(params[0], params[1], params[2]);
        material = new THREE.MeshPhongMaterial({ color: someColors[this.color],  flatShading: true });
        shape = new CANNON.Box(new CANNON.Vec3(params[0] / 2, params[1] / 2, params[2] / 2));
        break;
      case 'moon':
        geometry = new THREE.IcosahedronGeometry(params[0], 1);
        material = new THREE.MeshPhongMaterial({ color: "#F8B195",  flatShading: true });
        shape = new CANNON.Sphere(params[0]);
        break;
      case 'sphere':
      default:
        geometry = new THREE.TetrahedronGeometry(params[0], 1);
        material = new THREE.MeshPhongMaterial({ color: someColors[this.color],  flatShading: true });
        shape = new CANNON.Sphere(params[0]);
    }

    const mesh = new THREE.Mesh(geometry, material) as CustomMesh;
    mesh.name = this.id;
    mesh.castShadow = true;
    mesh.position.set(x, y, z);

    if (type === "moon") {
      mesh.position.normalize().multiplyScalar(600);
    } else {
      mesh.position.normalize().multiplyScalar(500);
    }

    mesh.position.add(mesh.position.clone().normalize().multiplyScalar(params[0] * 2.5));
    mesh.lookAt(new THREE.Vector3(0, 0, 0));

    mesh.cannon = new CANNON.Body({ shape, mass: 0, material: groundMaterial });
    mesh.cannon.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    mesh.cannon.quaternion.set(-mesh.quaternion.x, -mesh.quaternion.y, -mesh.quaternion.z, mesh.quaternion.w);

    if (type === "moon") {
      mesh.cannon.collisionResponse = true;
    } else {
      mesh.cannon.collisionResponse = false;
    }

    mesh.cannon.addEventListener('collide', (e: any) => {
      const player = scene.getObjectByName(socket.id) as any;

      if (!this.eaten && player) {
        for (const contact of world.contacts) {
          const foodHits = contact.bi === mesh.cannon;
          const playerIsHit = contact.bj === player.cannon;
          const playerHits = contact.bi === player.cannon;
          const foodIsHit = contact.bj === mesh.cannon;

          if (foodHits && playerIsHit || playerHits && foodIsHit) {
            const playerVol = store.getState().players[socket.id].volume;
            const foodVol = (mesh.cannon as CANNON.Body).shapes[0].volume();

            if (playerVol > foodVol) {
              this.eaten = true;
              socket.emit('eat_food', this.id, foodVol + playerVol);
            }
          }
        }
      }
    });

    scene.add(mesh);
    world.add(mesh.cannon);

    this.mesh = mesh;
  }
}

export let controls: any; 



