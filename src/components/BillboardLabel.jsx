import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Billboard component - always faces the camera
export function BillboardLabel({ position = [0, 0, 0], text, fontSize = 0.35 }) {
    const groupRef = useRef();
    const { camera } = useThree();

    useFrame(() => {
        if (groupRef.current) {
            // Make the label always face the camera
            groupRef.current.lookAt(camera.position);
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Black background plate */}
            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[3, 0.6]} />
                <meshBasicMaterial color="#000000" opacity={0.8} transparent />
            </mesh>

            {/* White text */}
            <Text
                position={[0, 0, 0]}
                fontSize={fontSize}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {text}
            </Text>
        </group>
    );
}
