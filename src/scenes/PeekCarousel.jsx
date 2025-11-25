import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import LemonCell from '../components/models/LemonCell';
import CarobCell from '../components/models/CarobCell';
import gsap from 'gsap';
import * as THREE from 'three';

// Camera controller
function CameraController() {
    const { camera } = useThree();

    useEffect(() => {
        // Fixed camera position - close to center cell
        camera.position.set(0, 2, 6);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
}

export default function PeekCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const groupRef = useRef();

    // Cell models data
    const cells = [
        {
            Component: LemonCell,
            name: 'عسل الليمون',
            nameEn: 'Lemon Honey',
            color: '#FFA500'
        },
        {
            Component: CarobCell,
            name: 'عسل الخروب',
            nameEn: 'Carob Honey',
            color: '#8B4513'
        }
    ];

    // Handle navigation
    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % cells.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + cells.length) % cells.length);
    };

    // Animate cells when active index changes
    useEffect(() => {
        if (groupRef.current) {
            const offset = -activeIndex * 8; // 8 units spacing

            gsap.to(groupRef.current.position, {
                x: offset,
                duration: 1,
                ease: 'power2.inOut'
            });
        }
    }, [activeIndex]);

    return (
        <div className="w-full h-screen relative bg-gradient-to-b from-gray-900 to-black">
            {/* Title */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center">
                <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
                    {cells[activeIndex].name}
                </h1>
                <p className="text-xl text-gray-300 font-light tracking-widest">
                    {cells[activeIndex].nameEn}
                </p>
            </div>

            {/* Left Arrow */}
            {activeIndex > 0 && (
                <button
                    onClick={handlePrev}
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group"
                >
                    <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Right Arrow */}
            {activeIndex < cells.length - 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group"
                >
                    <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Progress indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {cells.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-12 bg-white' : 'w-8 bg-gray-500'
                            }`}
                    />
                ))}
            </div>

            <Canvas
                camera={{ position: [0, 2, 6], fov: 50 }}
                shadows
            >
                <CameraController />

                {/* Lighting */}
                <ambientLight intensity={0.5} />

                {/* Key light - from front top */}
                <directionalLight
                    position={[0, 5, 5]}
                    intensity={2}
                    castShadow
                />

                {/* Rim light - golden from back */}
                <pointLight
                    position={[0, 3, -5]}
                    intensity={2}
                    color="#FFD700"
                />

                {/* Fill lights from sides */}
                <pointLight position={[-5, 2, 0]} intensity={1} color="#ffffff" />
                <pointLight position={[5, 2, 0]} intensity={1} color="#ffffff" />

                <Environment preset="studio" />
                <color attach="background" args={['#0a0a0a']} />

                {/* Reflective floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Cells in a row */}
                <group ref={groupRef}>
                    <Suspense fallback={null}>
                        {cells.map((cell, index) => {
                            const Cell = cell.Component;
                            const isActive = index === activeIndex;
                            const distance = Math.abs(index - activeIndex);

                            return (
                                <group
                                    key={index}
                                    position={[index * 8, 0, 0]}
                                >
                                    <Cell
                                        scale={isActive ? 2 : 1.2}
                                        position={[0, 0, 0]}
                                    />

                                    {/* Spotlight on active cell */}
                                    {isActive && (
                                        <spotLight
                                            position={[0, 5, 3]}
                                            angle={0.4}
                                            penumbra={1}
                                            intensity={3}
                                            castShadow
                                        />
                                    )}
                                </group>
                            );
                        })}
                    </Suspense>
                </group>

                <fog attach="fog" args={['#0a0a0a', 8, 20]} />
            </Canvas>
        </div>
    );
}
