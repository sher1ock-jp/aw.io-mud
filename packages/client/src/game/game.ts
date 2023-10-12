import { useThree } from '@react-three/fiber';
import { forOwn } from 'lodash';
import { useState, useEffect } from 'react';

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
  const { scene, camera } = useThree();
  const [players, setPlayers] = useState<Record<string, PlayerData>>({});

  useEffect(() => {
    setPlayers(store.getState().players);
    forOwn(players, (data, id) => {
      const playerObject = scene.getObjectByName(id);

      const { x, y, z, qx, qy, qz, qw, scale } = data;

      if (playerObject && "cannon" in playerObject) {
        if (id !== socket.id) {
          playerObject.position.set(x, y, z);
          playerObject.quaternion.set(qx, qy, qz, qw);

          if ("sprite" in playerObject) {
            playerObject.sprite.position.copy(playerObject.position).add(
              playerObject.sprite.position.clone().normalize().multiplyScalar(scale * 15)
            );
          }
        }

        if (id === socket.id) {
          (playerObject.cannon as any).mass = 24 + scale * 5;
        }

        if ("sprite" in playerObject) {
          playerObject.sprite.scale.set(scale * 50, scale * 25, scale * 0.5);
        }

        playerObject.scale.set(scale, scale, scale);
        (playerObject.children[0] as any).scale.set(1 / scale, 1 / scale, 1 / scale);
        (playerObject.cannon as any).shapes[0].radius = scale * 10;

        camera.far += scale * 0.3;
      }
    });
  }, [players, camera, scene]);

  return null;
};

export default LoadEnvironment;
