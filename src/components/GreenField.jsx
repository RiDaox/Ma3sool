import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GreenField() {
    const grassRef = useRef();
    const count = 90000; // Doubled grass density!

    // Initialize instance matrices
    useEffect(() => {
        if (grassRef.current) {
            const dummy = new THREE.Object3D();

            for (let i = 0; i < count; i++) {
                // Random position
                const x = (Math.random() - 0.5) * 50;
                const z = (Math.random() - 0.5) * 50;
                const y = -2;

                // Random scale - Thinner blades
                const scaleX = 0.4 + Math.random() * 0.3;
                const scaleY = 0.6 + Math.random() * 0.8;
                const scaleZ = 0.4 + Math.random() * 0.3;

                dummy.position.set(x, y, z);
                dummy.scale.set(scaleX, scaleY, scaleZ);
                dummy.updateMatrix();

                grassRef.current.setMatrixAt(i, dummy.matrix);
            }

            grassRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [count]);

    // Wind animation
    useFrame((state) => {
        if (grassRef.current) {
            const time = state.clock.elapsedTime;
            const dummy = new THREE.Object3D();

            for (let i = 0; i < count; i++) {
                grassRef.current.getMatrixAt(i, dummy.matrix);
                dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

                // Wind sway
                const windX = Math.sin(time * 0.5 + dummy.position.x * 0.1) * 0.05;
                const windZ = Math.cos(time * 0.3 + dummy.position.z * 0.1) * 0.03;

                dummy.rotation.set(windX, 0, windZ);
                dummy.updateMatrix();

                grassRef.current.setMatrixAt(i, dummy.matrix);
            }

            grassRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group>
            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#2D5016"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Grass blades */}
            <instancedMesh
                ref={grassRef}
                args={[null, null, count]}
                castShadow
                receiveShadow
            >
                {/* Thinner geometry */}
                <coneGeometry args={[0.015, 0.7, 3, 1]} />
                <meshStandardMaterial
                    color="#4CAF50"
                    roughness={0.8}
                    metalness={0.0}
                />
            </instancedMesh>
        </group>
    );
}
