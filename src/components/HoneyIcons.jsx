import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 🍋 Lemon Icon
export function LemonIcon({ position = [0, 0, 0], scale = 0.3 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Lemon body */}
            <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#FDE047" metalness={0.2} roughness={0.3} />
            </mesh>
            {/* Lemon tip */}
            <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[0.3, 0.5, 8]} />
                <meshStandardMaterial color="#FDE047" />
            </mesh>
            {/* Small leaf */}
            <mesh position={[0, 1, 0.2]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[0.6, 0.1, 0.3]} />
                <meshStandardMaterial color="#84CC16" />
            </mesh>
        </group>
    );
}

// 🌿 Thyme/Leaf Icon
export function LeafIcon({ position = [0, 0, 0], scale = 0.3 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Leaf shape */}
            <mesh rotation={[0, 0, 0.3]}>
                <sphereGeometry args={[1, 8, 16]} />
                <meshStandardMaterial color="#22C55E" metalness={0.1} roughness={0.4} />
            </mesh>
            {/* Stem */}
            <mesh position={[0, -0.8, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
                <meshStandardMaterial color="#15803D" />
            </mesh>
        </group>
    );
}

// 🌸 Flower Icon
export function FlowerIcon({ position = [0, 0, 0], scale = 0.3 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Center */}
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#FCD34D" emissive="#FCD34D" emissiveIntensity={0.5} />
            </mesh>
            {/* Petals */}
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos((i * Math.PI * 2) / 5) * 0.6,
                        0,
                        Math.sin((i * Math.PI * 2) / 5) * 0.6
                    ]}
                >
                    <sphereGeometry args={[0.4, 8, 8]} />
                    <meshStandardMaterial color="#EC4899" metalness={0.2} roughness={0.3} />
                </mesh>
            ))}
        </group>
    );
}

// 🍊 Orange Icon
export function OrangeIcon({ position = [0, 0, 0], scale = 0.3 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Orange body */}
            <mesh>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#FB923C" metalness={0.2} roughness={0.3} />
            </mesh>
            {/* Texture dots */}
            {[...Array(20)].map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.random() * 1.5 - 0.75,
                        Math.random() * 1.5 - 0.75,
                        Math.random() * 1.5 - 0.75
                    ]}
                >
                    <sphereGeometry args={[0.05, 4, 4]} />
                    <meshStandardMaterial color="#EA580C" />
                </mesh>
            ))}
        </group>
    );
}

// 👑 Crown/Sidr Icon
export function CrownIcon({ position = [0, 0, 0], scale = 0.3 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Crown base */}
            <mesh>
                <cylinderGeometry args={[1, 1.2, 0.3, 6]} />
                <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Crown points */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos((i * Math.PI * 2) / 6) * 1,
                        0.5,
                        Math.sin((i * Math.PI * 2) / 6) * 1
                    ]}
                >
                    <coneGeometry args={[0.2, 0.6, 4]} />
                    <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.1} />
                </mesh>
            ))}
        </group>
    );
}

// 🌲 Eucalyptus/Tree Icon
export function TreeIcon({ position = [0, 0, 0], scale = 0.3 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Tree top */}
            <mesh position={[0, 0.5, 0]}>
                <coneGeometry args={[0.8, 1.5, 8]} />
                <meshStandardMaterial color="#10B981" metalness={0.1} roughness={0.5} />
            </mesh>
            {/* Trunk */}
            <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.2, 0.25, 1, 8]} />
                <meshStandardMaterial color="#78350F" />
            </mesh>
        </group>
    );
}
