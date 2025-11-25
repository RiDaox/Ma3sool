import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useStore } from '../store';
import * as THREE from 'three';
import Beehive from './models/Beehive';

export default function HexCell({
  position,
  honeyType,
  index,
  onClick,
  isActive = false,
  distanceFromActive = 0,
  opacity = 1,
  isFront = false
}) {
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation on Y axis
      meshRef.current.rotation.y += delta * 0.15;
    }

    // Get world position for dynamic scaling
    if (groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);

      const targetScale = worldPos.z > 0 ? 1.4 : 0.9;
      const currentScale = groupRef.current.scale.x;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, delta * 3)
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Your 3D Beehive Model */}
      <group ref={meshRef}>
        <Beehive
          scale={1.2}
          onClick={onClick}
        />

        {/* Add custom color/emissive to match honeyType */}
        <meshStandardMaterial
          attach="material"
          color={honeyType.color}
          emissive={honeyType.glowColor}
          emissiveIntensity={isFront ? 0.6 : 0.25}
        />
      </group>

      {/* Text label on TOP of beehive */}
      <Text
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.03}
        outlineColor="#FFFFFF"
      >
        {honeyType.name}
      </Text>

      {/* Clickable area */}
      <mesh onClick={onClick} visible={false}>
        <cylinderGeometry args={[2, 2, 3, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}