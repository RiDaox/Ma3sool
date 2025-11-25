import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function MouseParticles({ count = 100 }) {
    const meshRef = useRef();
    const { viewport, mouse } = useThree();

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Particles state
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                x: 0,
                y: 0,
                z: 0,
                vx: (Math.random() - 0.5) * 0.05,
                vy: (Math.random() - 0.5) * 0.05,
                life: 0, // 0 = dead, 1 = full life
                scale: Math.random() * 0.5 + 0.2,
            });
        }
        return temp;
    }, [count]);

    // Mouse position tracking
    const mousePos = useRef(new THREE.Vector3(0, 0, 0));
    const lastMousePos = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state) => {
        if (!meshRef.current) return;

        // Update mouse position in 3D space
        // We project the 2D mouse to the plane at z=0
        mousePos.current.set(
            (state.mouse.x * viewport.width) / 2,
            (state.mouse.y * viewport.height) / 2,
            0
        );

        // Calculate mouse speed/movement
        const dist = mousePos.current.distanceTo(lastMousePos.current);
        const isMoving = dist > 0.01;

        // Spawn particles if moving
        if (isMoving) {
            // Spawn a few particles per frame based on speed
            let spawnCount = Math.min(Math.floor(dist * 20), 5);

            for (let i = 0; i < count; i++) {
                if (spawnCount <= 0) break;

                // Find a dead particle
                if (particles[i].life <= 0) {
                    particles[i].life = 1;
                    particles[i].x = mousePos.current.x + (Math.random() - 0.5) * 0.2;
                    particles[i].y = mousePos.current.y + (Math.random() - 0.5) * 0.2;
                    particles[i].vx = (Math.random() - 0.5) * 0.02;
                    particles[i].vy = (Math.random() - 0.5) * 0.02;
                    spawnCount--;
                }
            }
        }

        lastMousePos.current.copy(mousePos.current);

        // Update particles
        particles.forEach((p, i) => {
            if (p.life > 0) {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Decay
                p.life -= 0.02;

                // Update dummy
                dummy.position.set(p.x, p.y, 5); // Slightly in front
                const scale = p.scale * p.life;
                dummy.scale.setScalar(scale);
                dummy.rotation.z += 0.1;
                dummy.updateMatrix();

                meshRef.current.setMatrixAt(i, dummy.matrix);
            } else {
                // Hide dead particles
                dummy.scale.setScalar(0);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <planeGeometry args={[0.2, 0.2]} />
            <meshBasicMaterial
                color="#FCD34D"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </instancedMesh>
    );
}
