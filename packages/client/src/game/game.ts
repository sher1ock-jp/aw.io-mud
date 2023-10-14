import { scene, camera } from './main';
import { forOwn } from 'lodash';

import store from '../store';
import socket from '../socket';

import { PlayerData } from '../types/DataTypes';

// type PlayerData = {
//   x: number;
//   y: number;
//   z: number;
//   qx: number;
//   qy: number;
//   qz: number;
//   qw: number;
//   scale: number;
//   volume: number;
// };

const LoadEnvironment = () => {
  const { players } = store.getState();

  // Iterate over each player's data.
  forOwn(players, (data, id) => {
    // Get the object representing the player in the 3D scene.
    const playerObject = scene.getObjectByName(id);
    const { x, y, z, qx, qy, qz, qw, scale } = data;

    // If the playerObject exists and has a "cannon" property (probably a physics body).
    if (playerObject && "cannon" in playerObject) {
      // If the current player is not the user.
      if (id !== socket.id) {
        // Update the player's position and rotation.
        playerObject.position.set(x, y, z);
        playerObject.quaternion.set(qx, qy, qz, qw);

        // If the player object has a "sprite" (probably a 2D text or image overlay).
        if ("sprite" in playerObject) {
          // Adjust the position of the sprite based on the player's position and scale.
          playerObject.sprite.position.copy(playerObject.position).add(
            playerObject.sprite.position.clone().normalize().multiplyScalar(scale * 15)
          );
        }
      }

      // If the current player is the user.
      if (id === socket.id) {
        // Adjust the mass of the player's physics body based on their scale.
        (playerObject.cannon as any).mass = 24 + scale * 5;
      }

      // If the player object has a "sprite".
      if ("sprite" in playerObject) {
        // Adjust the sprite's scale.
        playerObject.sprite.scale.set(scale * 50, scale * 25, scale * 0.5);
      }

      // Adjust the player object's scale and its children's scale based on the player's scale.
      playerObject.scale.set(scale, scale, scale);
      (playerObject.children[0] as any).scale.set(1 / scale, 1 / scale, 1 / scale);

      // Adjust the size of the player's physics body.
      (playerObject.cannon as any).shapes[0].radius = scale * 10;

      // Adjust the camera's far clipping plane based on the player's scale.
      camera.far += scale * 0.3;
    }
  });
  return null;
};

export default LoadEnvironment;
