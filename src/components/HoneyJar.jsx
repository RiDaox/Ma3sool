import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import StudioPlatform from './StudioPlatform';

export default function HoneyJar({ honeyType, weight }) {
    const jarRef = useRef();

    // لو عندك موديل GLB، استخدمه هنا
    // const { scene } = useGLTF('/models/honey-jar.glb');

    useFrame((state, delta) => {
        if (!jarRef.current) return;

        // Rotation بطيئة
        jarRef.current.rotation.y += delta * 0.5;

        // Float animation خفيف
        jarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    });

    return (
        <group>
            {/* القاعدة المضاءة */}
            <StudioPlatform honeyType={honeyType} />

            {/* القرعة - دابا نستخدمو شكل بسيط، غادي نبدلوه بموديل */}
            <group ref={jarRef} position={[0, 0, 0]}>
                {/* الجسم */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1.2, 1.5, 3, 32]} />
                    <meshPhysicalMaterial
                        color={honeyType?.color || '#F59E0B'}
                        transparent
                        opacity={0.7}
                        metalness={0.1}
                        roughness={0.1}
                        transmission={0.9}
                        thickness={0.5}
                    />
                </mesh>

                {/* الغطاء */}
                <mesh position={[0, 1.7, 0]}>
                    <cylinderGeometry args={[1.3, 1.1, 0.4, 32]} />
                    <meshStandardMaterial
                        color="#D97706"
                        metalness={0.8}
                        roughness={0.3}
                    />
                </mesh>

                {/* العسل داخل القرعة */}
                <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[1.1, 1.4, 2, 32]} />
                    <meshStandardMaterial
                        color={honeyType?.color || '#F59E0B'}
                        emissive={honeyType?.glowColor || '#FCD34D'}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </group>

            {/* إضاءة إضافية للقرعة */}
            <pointLight position={[3, 2, 3]} intensity={1} color="#ffffff" />
            <pointLight position={[-3, 2, -3]} intensity={1} color="#ffffff" />
        </group>
    );
}

// Preload the model if you have one
// useGLTF.preload('/models/honey-jar.glb');
