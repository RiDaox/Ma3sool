import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StudioPlatform({ honeyType }) {
    const platformRef = useRef();
    const lightRingRef = useRef();

    useFrame((state, delta) => {
        if (!platformRef.current) return;

        // Rotation بطيئة
        platformRef.current.rotation.y += delta * 0.3;

        // Pulse للإضاءة
        if (lightRingRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
            lightRingRef.current.material.emissiveIntensity = pulse;
        }
    });

    return (
        <group position={[0, -2, 0]}>
            {/* القاعدة السداسية */}
            <mesh ref={platformRef} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[3, 3, 0.3, 6]} />
                <meshStandardMaterial
                    color={honeyType?.color || '#F59E0B'}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* حلقة الإضاءة */}
            <mesh ref={lightRingRef} position={[0, 0.2, 0]} scale={1.05}>
                <cylinderGeometry args={[3.2, 3.2, 0.1, 6]} />
                <meshStandardMaterial
                    color={honeyType?.glowColor || '#FCD34D'}
                    emissive={honeyType?.glowColor || '#FCD34D'}
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* إضاءة من تحت */}
            <pointLight
                position={[0, -1, 0]}
                intensity={3}
                color={honeyType?.glowColor || '#FCD34D'}
                distance={10}
            />

            {/* إضاءة من فوق */}
            <spotLight
                position={[0, 8, 0]}
                angle={0.5}
                penumbra={0.5}
                intensity={2}
                color="#ffffff"
                castShadow
            />
        </group>
    );
}
