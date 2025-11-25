import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import LemonCell from '../components/models/LemonCell';
import GreenField from '../components/GreenField';
import RealisticClouds from '../components/RealisticClouds';
import { useStore } from '../store';
import gsap from 'gsap';
import * as THREE from 'three';

// Camera animation component
function CameraAnimation({ isTransitioning }) {
    const hasAnimated = useRef(false);
    const { camera } = useThree();

    useFrame(() => {
        if (!hasAnimated.current && !isTransitioning) {
            const endPos = new THREE.Vector3(0, 3, 8);
            camera.position.lerp(endPos, 0.02);
            camera.lookAt(0, 0, 0);

            if (camera.position.distanceTo(endPos) < 0.1) {
                hasAnimated.current = true;
            }
        }
    });

    return null;
}

export default function LemonScene() {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const setIsTransitioningGlobal = useStore((state) => state.setIsTransitioning);
    const cellRef = useRef();

    const handleCellClick = () => {
        if (isTransitioning) return;

        console.log('🍋 Cell clicked! Starting CINEMATIC transition...');
        setIsTransitioning(true);
        setIsTransitioningGlobal(true);

        const cell = cellRef.current;

        if (cell) {
            // CINEMATIC TRANSITION SEQUENCE
            gsap.timeline()
                // Phase 1: Cell grows and spins
                .to(cell.scale, {
                    x: 2.5,
                    y: 2.5,
                    z: 2.5,
                    duration: 0.8,
                    ease: 'power2.inOut'
                })
                .to(cell.rotation, {
                    y: Math.PI * 2,
                    duration: 0.8,
                    ease: 'power2.inOut'
                }, '<')

                // Phase 2: EXPLODE towards camera
                .to(cell.scale, {
                    x: 5,
                    y: 5,
                    z: 5,
                    duration: 0.5,
                    ease: 'power3.in'
                })
                .to(cell.position, {
                    z: 5,
                    duration: 0.5,
                    ease: 'power3.in'
                }, '<')

                // Complete
                .call(() => {
                    setTimeout(() => {
                        console.log('✨ Transition complete!');
                        // Reset
                        gsap.to(cell.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 });
                        gsap.to(cell.position, { z: 0, duration: 0.3 });
                        gsap.to(cell.rotation, { y: 0, duration: 0.3 });
                        setIsTransitioning(false);
                        setIsTransitioningGlobal(false);
                    }, 300);
                });
        }
    };

    return (
        <div className="w-full h-screen relative">
            {/* Title */}
            <div className={`absolute top-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-white/40 shadow-lg">
                    <h1 className="text-4xl font-bold text-amber-900">🍋 عسل الليمون</h1>
                    <p className="text-amber-800 mt-2 font-medium text-center">Lemon Honey</p>
                </div>
            </div>

            {/* Click hint (bouncing) */}
            {!isTransitioning && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                    <div className="bg-amber-500/90 backdrop-blur-sm px-8 py-4 rounded-full text-white font-bold shadow-2xl text-lg cursor-pointer hover:bg-amber-600 transition-colors">
                        👆 اضغط على الخلية
                    </div>
                </div>
            )}

            <Canvas camera={{ position: [0, 5, 15], fov: 50 }} shadows>
                <CameraAnimation isTransitioning={isTransitioning} />

                <OrbitControls
                    enabled={!isTransitioning}
                    enableZoom={true}
                    enablePan={false}
                    minDistance={4}
                    maxDistance={20}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                    enableDamping={true}
                    dampingFactor={0.05}
                />

                <ambientLight intensity={0.6} />
                <spotLight
                    position={[10, 20, 10]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-10, 10, -10]} intensity={1} color="#FDE047" />

                {/* Blue sky with clouds */}
                <Environment preset="park" />
                <color attach="background" args={['#87CEEB']} />

                {/* Green Field (Nordic/Swiss style grass) */}
                <GreenField />

                {/* Lemon Cell - clickable with animation */}
                <Suspense fallback={null}>
                    <Float
                        speed={1.5}
                        rotationIntensity={0.2}
                        floatIntensity={0.5}
                        enabled={!isTransitioning}
                    >
                        <group ref={cellRef} onClick={handleCellClick} style={{ cursor: 'pointer' }}>
                            <LemonCell position={[0, 0, 0]} scale={1.5} />
                        </group>
                    </Float>
                </Suspense>

                <fog attach="fog" args={['#FEF3C7', 15, 40]} />
            </Canvas>
        </div>
    );
}
