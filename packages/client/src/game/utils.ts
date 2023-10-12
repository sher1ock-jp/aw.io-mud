import * as THREE from "three";
import * as CANNON from "cannon";

import { scene, world } from "./main";
import { PlayerData } from "../types/DataTypes";


export const setCannonPosition = (mesh:any): void => {
    mesh.cannon.position.x = mesh.position.x;
    mesh.cannon.position.z = mesh.position.y;
    mesh.cannon.position.y = mesh.position.z;
    mesh.cannon.quaternion.x = -mesh.quaternion.x;
    mesh.cannon.quaternion.z = -mesh.quaternion.y;
    mesh.cannon.quaternion.y = -mesh.quaternion.z;
    mesh.cannon.quaternion.w = mesh.quaternion.w;
}

export const setMeshPosition = (mesh:any): void => {
    mesh.position.x = mesh.cannon.position.x;
    mesh.position.z = mesh.cannon.position.y;
    mesh.position.y = mesh.cannon.position.z;
    mesh.quaternion.x = -mesh.cannon.quaternion.x;
    mesh.quaternion.z = -mesh.cannon.quaternion.y;
    mesh.quaternion.y = -mesh.cannon.quaternion.z;
    mesh.quaternion.w = mesh.cannon.quaternion.w;
}

export const getMeshData = (mesh: any): Record<string, number> => {
    return {
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
        qx: mesh.quaternion.x,
        qy: mesh.quaternion.y,
        qz: mesh.quaternion.z,
        qw: mesh.quaternion.w
    };
};

export const makeTextSprite = (message: string, fontsize: number): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get 2D context');
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'Bold ' + fontsize/2 + 'px Quicksand';
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillText(message, canvas.width / 2, fontsize/2);

    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    return sprite;
}

export const attachFood =  (id: string, playerId: string, playerData: PlayerData): void => {
    const foodObject = scene.getObjectByName(id);
    const player = scene.getObjectByName(playerId);
    const newQuat = new CANNON.Quaternion(
        -playerData.qx,
        -playerData.qy,
        -playerData.qz,
        playerData.qw
    );
    const threeQuat = new THREE.Quaternion(
        -playerData.qx,
        -playerData.qy,
        -playerData.qz,
        playerData.qw
    );

    if(foodObject){
        world.remove(foodObject.cannon);

        const scaled = Math.min(.4 + player.scale.x, .75);

        const vec1 = new CANNON.Vec3((foodObject.position.x - playerData.x) * scaled,
                               (foodObject.position.z - playerData.z) * scaled,
                               (foodObject.position.y - playerData.y) * scaled);
        const vmult = newQuat.inverse().vmult(vec1);
        player.cannon.addShape(foodObject.cannon.shapes[0], vmult, newQuat.inverse());

        const invQuat = threeQuat.conjugate();
        const vec2 = new THREE.Vector3((foodObject.position.x - playerData.x) * scaled,
                                (foodObject.position.y - playerData.y) * scaled,
                                (foodObject.position.z - playerData.z) * scaled);
        const vecRot = vec2.applyQuaternion(invQuat);

        foodObject.position.set(vecRot.x, vecRot.y, vecRot.z);
        foodObject.quaternion.set(invQuat.x, invQuat.y, invQuat.z, invQuat.w);

        player.children[0].add(foodObject);

        while(player.cannon.shapes.length > 80){
            player.cannnon.shapes.splice(1,1);
            player.cannnon.shapeOffsets.splice(1,1);
            player.cannnon.shapeOrientations.splice(1,1);
            player.children[0].children.splice(0,1);
        }   
    }

};

export const attachPlayer = (id: string, playerId: string, eater:PlayerData, eaten:PlayerData  ): void => {
    const foodObject = scene.getObjectByName(id);
    const player = scene.getObjectByName(playerId);
    const newQuat = new CANNON.Quaternion(-eater.qx,
                                          -eater.qz,
                                          -eater.qy,
                                          eater.qw);
    const threeQuat = new THREE.Quaternion(eater.qx,
                                           eater.qy,
                                           eater.qz,
                                           eater.qw);

    // attach player to eater
    if (foodObject) {
        world.remove(foodObject.cannon);

    // scale attachment point according to scale (larger players have farther attachment point)
    const scaled = Math.min(.3 + player.scale.x/20, .6);

    // figure out where and in what orientation to attach object to player
    const vec1 = new CANNON.Vec3((eaten.x - eater.x) * scaled,
                                   (eaten.z - eater.z) * scaled,
                                   (eaten.y - eater.y) * scaled);
    const vmult = newQuat.inverse().vmult(vec1);
    player.cannon.addShape(foodObject.cannon.shapes[0], vmult, newQuat.inverse());

    const invQuat = threeQuat.conjugate();
    const vec2 = new THREE.Vector3((eaten.x - eater.x) * scaled,
                                (eaten.y - eater.y) * scaled,
                                (eaten.z - eater.z) * scaled);
    const vecRot = vec2.applyQuaternion(invQuat);

    // create new clone of player to add
    const clone = foodObject.clone();
    clone.name = "";

    clone.position.set(vecRot.x, vecRot.y, vecRot.z);
    clone.quaternion.multiply(invQuat);

    // add to pivot obj of player
    player.children[0].add(clone);

    // throw out older food
    if (player.cannon.shapes.length > 80) {
       player.cannon.shapes.splice(1, 1);
       player.cannon.shapeOffsets.splice(1, 1);
       player.cannon.shapeOrientations.splice(1, 1);
       player.children[0].children.splice(0, 1);
     }
  }
}
  