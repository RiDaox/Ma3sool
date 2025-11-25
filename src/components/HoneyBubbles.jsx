import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HoneyBubbles({ count = 40 }) {
    const meshRef = useRef();

    // Generate random initial positions and speeds
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20; // Spread width
            const y = Math.random() * 10 - 5; // Spread height
            const z = (Math.random() - 0.5) * 10; // Spread depth
            const speed = 0.02 + Math.random() * 0.05;
            const scale = 0.05 + Math.random() * 0.15;
            const offset = Math.random() * Math.PI * 2;
            temp.push({ x, y, z, speed, scale, offset });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            // Move up
            particle.y += particle.speed;

            // Reset if too high
            if (particle.y > 6) {
                particle.y = -4;
            }

            // Wobbly movement
            const t = state.clock.elapsedTime;
            const wobbleX = Math.sin(t * 2 + particle.offset) * 0.2;

            // Update dummy object
            dummy.position.set(
                particle.x + wobbleX,
                particle.y,
                particle.z
            );
            dummy.scale.setScalar(particle.scale);
            dummy.updateMatrix();

            // Update instance matrix
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
                color="#ffeb3b"
                emissive="#ffeb3b"
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
                roughness={0.1}
                metalness={0.8}
            />
        </instancedMesh>
    );
}
