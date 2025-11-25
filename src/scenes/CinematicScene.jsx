import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import { useRef } from 'react';
import DSVGPortal from '../components/DSVGPortal';

export default function CinematicScene({ onEnterWorld }) {
  const { camera } = useThree();

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Environment preset="sunset" />

      <DSVGPortal onEnter={onEnterWorld} />

      <Text position={[0, -4, 0]} fontSize={0.8} color="black">
        اضغط على D
      </Text>
    </>
  );
}