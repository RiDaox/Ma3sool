import { Canvas } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import HexCell from '../components/HexCell';

export default function IntroScene({ onEnterWorld }) {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <HexCell position={[0, 0, 0]} color="#f59e0b" onClick={onEnterWorld} />

      <Text position={[0, -3, 0]} fontSize={0.8} color="black">
        اضغط على الخلية لبدء الرحلة
      </Text>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}