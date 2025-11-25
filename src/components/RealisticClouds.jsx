import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RealisticClouds() {
    const cloudsRef = useRef();

    // Slow cloud movement
    useFrame((state) => {
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.0002;
        }
    });

    // Cloud positions
    const cloudData = [
        { pos: [10, 15, -20], scale: 3 },
        { pos: [-15, 18, -25], scale: 4 },
        { pos: [20, 12, -30], scale: 3.5 },
        { pos: [-8, 20, -15], scale: 2.5 },
        { pos: [5, 16, -35], scale: 3.2 },
        { pos: [-20, 14, -28], scale: 3.8 },
        { pos: [15, 19, -22], scale: 2.8 },
    ];

    return (
        <group ref={cloudsRef}>
            {cloudData.map((cloud, i) => (
                <Cloud key={i} position={cloud.pos} scale={cloud.scale} />
            ))}
        </group>
    );
}

// Individual cloud component
function Cloud({ position, scale }) {
    const cloudRef = useRef();

    // Gentle floating animation
    useFrame((state) => {
        if (cloudRef.current) {
            cloudRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
        }
    });

    return (
        <group ref={cloudRef} position={position} scale={scale}>
            {/* Multiple spheres to create fluffy cloud shape */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={0.9}
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            <mesh position={[0.8, 0.2, 0]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={0.85}
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            <mesh position={[-0.7, 0.1, 0.3]}>
                <sphereGeometry args={[0.9, 16, 16]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={0.88}
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            <mesh position={[0.3, 0.4, -0.2]}>
                <sphereGeometry args={[0.7, 16, 16]} />
                <meshStandardMaterial
                    color="#F5F5F5"
                    transparent
                    opacity={0.82}
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            <mesh position={[-0.2, -0.1, 0.5]}>
                <sphereGeometry args={[0.75, 16, 16]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={0.86}
                    roughness={1}
                    metalness={0}
                />
            </mesh>
        </group>
    );
}
