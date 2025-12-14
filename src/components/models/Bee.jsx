import React, { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Bee = forwardRef(function Bee({ scale = 1 }, ref) {
    const wingsRef = useRef();

    useFrame((state) => {
        if (wingsRef.current) {
            // Flap wings very fast
            wingsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 60) * 0.5;
        }
    });

    return (
        <group ref={ref} scale={scale}>
            {/* Body - Yellow/Black Stripes */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
                <meshStandardMaterial color="#FFD700" roughness={0.4} metalness={0.1} />
            </mesh>

            {/* Stripes (Torus rings) */}
            <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.14, 0.02, 8, 16]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.14, 0.02, 8, 16]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
            </mesh>

            {/* Eyes */}
            <mesh position={[0.06, 0.24, 0.08]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="black" roughness={0.1} />
            </mesh>
            <mesh position={[-0.06, 0.24, 0.08]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="black" roughness={0.1} />
            </mesh>

            {/* Wings Group */}
            <group ref={wingsRef} position={[0, 0.1, -0.05]}>
                {/* Right Wing */}
                <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.2]}>
                    <circleGeometry args={[0.2, 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                        roughness={0.1}
                    />
                </mesh>
                {/* Left Wing */}
                <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0.2]}>
                    <circleGeometry args={[0.2, 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.6}
                        side={THREE.DoubleSide}
                        roughness={0.1}
                    />
                </mesh>
            </group>

            {/* Stinger */}
            <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.05, 0.15, 8]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
        </group>
    );
});

export default Bee;
