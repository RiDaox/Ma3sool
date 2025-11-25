import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function LuxuryLighting({ activeIndex = 0 }) {
    const spotlightRef = useRef();
    const rimlightRef = useRef();

    useFrame(() => {
        // Smooth spotlight intensity based on active cell
        if (spotlightRef.current) {
            const targetIntensity = 2.5;
            spotlightRef.current.intensity += (targetIntensity - spotlightRef.current.intensity) * 0.1;
        }
    });

    return (
        <group>
            {/* Ambient Light - soft base lighting */}
            <ambientLight intensity={0.4} color="#ffffff" />

            {/* Top Light - soft from above */}
            <directionalLight
                position={[0, 10, 0]}
                intensity={1.5}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            {/* Rim Light - Golden glow from back */}
            <pointLight
                ref={rimlightRef}
                position={[5, 3, -5]}
                intensity={3}
                color="#FFD700"
                distance={20}
            />

            {/* Secondary Rim Light - from other side */}
            <pointLight
                position={[-5, 3, -5]}
                intensity={2}
                color="#FFA500"
                distance={20}
            />

            {/* Spotlight - focused on active cell */}
            <spotLight
                ref={spotlightRef}
                position={[0, 8, 5]}
                angle={0.3}
                penumbra={1}
                intensity={2.5}
                color="#ffffff"
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            {/* Fill Light - subtle from front */}
            <pointLight
                position={[0, 2, 8]}
                intensity={1}
                color="#ffffff"
                distance={15}
            />
        </group>
    );
}
