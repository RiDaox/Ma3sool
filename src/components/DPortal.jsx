import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function DPortal({ position = [0, 0, 0], onEnter }) {
  const meshRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.2;
    innerRef.current.rotation.y -= delta * 0.4;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* الخلية الخارجية (D) */}
      <mesh>
        <cylinderGeometry args={[3, 3, 1, 6]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>

      {/* الفتحة الداخلية (الباب) */}
      <mesh ref={innerRef} position={[0, 0, 0.4]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 6]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
      </mesh>

      {/* النقر للدخول */}
      <mesh position={[0, 0, -0.5]} onClick={onEnter}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}