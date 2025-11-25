import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HoneycombBackground() {
    const groupRef = useRef();

    // إنشاء شبكة من السداسيات
    const hexagons = useMemo(() => {
        const hexes = [];
        const rows = 15;
        const cols = 15;
        const hexRadius = 1.5;
        const spacing = hexRadius * 1.8;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * spacing + (row % 2) * (spacing / 2) - (cols * spacing) / 2;
                const y = row * spacing * 0.866 - (rows * spacing * 0.866) / 2;
                const z = -15 - Math.random() * 5; // عمق عشوائي

                hexes.push({
                    position: [x, y, z],
                    rotation: Math.random() * Math.PI * 2,
                    scale: 0.8 + Math.random() * 0.4,
                });
            }
        }

        return hexes;
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Rotation بطيئة جداً
        groupRef.current.rotation.z += delta * 0.05;

        // تحريك الأطفال
        groupRef.current.children.forEach((child, i) => {
            child.rotation.z += delta * 0.1 * (i % 2 === 0 ? 1 : -1);
        });
    });

    return (
        <group ref={groupRef}>
            {hexagons.map((hex, i) => (
                <mesh key={i} position={hex.position} rotation={[0, 0, hex.rotation]} scale={hex.scale}>
                    <cylinderGeometry args={[1, 1, 0.1, 6]} />
                    <meshStandardMaterial
                        color="#F59E0B"
                        emissive="#FCD34D"
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.15}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}
