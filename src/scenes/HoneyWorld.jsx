import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';

export default function HoneyWorld() {
  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />

      <Text position={[0, 0, -10]} fontSize={3} color="#451a03" anchorX="center">
        مرحباً في عالم العسل!
      </Text>

      <OrbitControls autoRotate />
    </Canvas>
  );
}