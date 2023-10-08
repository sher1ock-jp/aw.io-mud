import React, { useRef, useState } from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';  // three.js の機能をインポート

interface BattleSphereProps {
  radius?: number;
  color?: string;
}

const BattleSphere: React.FC<BattleSphereProps> = ({ radius = 500, color = 'lightblue' }) => {

  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  return (
    <Sphere args={[radius, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial attach="material" color={color} side={THREE.DoubleSide} />
    </Sphere>
  );
}

export default BattleSphere;