import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import LemonCell from '../components/models/LemonCell';
import CarobCell from '../components/models/CarobCell';
import gsap from 'gsap';

export default function DGCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const groupRef = useRef();

    // Cell models data
    const cells = [
        { Component: LemonCell, name: 'عسل البرتقال', nameEn: 'Orange Honey' },
        { Component: CarobCell, name: 'عسل الخروب', nameEn: 'Carob Honey' },
    ];

    // Handle next
    const handleNext = () => {
        if (activeIndex < cells.length - 1) {
            setActiveIndex(prev => prev + 1);
        }
    };

    // Handle previous
    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    };

    // Animate cells when active index changes
    useEffect(() => {
        if (groupRef.current) {
            const offset = activeIndex * 12; // 12 units spacing in depth (Z-axis)

            gsap.to(groupRef.current.position, {
                z: offset,
                duration: 1.2,
                ease: 'power2.inOut'
            });
        }
    }, [activeIndex]);

    return (
        <div className="w-full h-screen relative bg-gradient-to-b from-gray-800 via-gray-900 to-black">
            {/* Title */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center">
                <h1 className="text-6xl font-serif text-white mb-2 tracking-widest">
                    HONEYVERSE
                </h1>
                <p className="text-sm text-gray-400 tracking-[0.3em] uppercase">
                    Velvet Collection
                </p>
            </div>

            {/* Left Arrow */}
            {activeIndex > 0 && (
                <button
                    onClick={handlePrev}
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Right Arrow */}
            {activeIndex < cells.length - 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Product name */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 text-center">
                <h2 className="text-3xl font-serif text-white mb-1 tracking-wider">
                    {cells[activeIndex].name}
                </h2>
                <p className="text-sm text-gray-400 tracking-widest uppercase">
                    {cells[activeIndex].nameEn}
                </p>
            </div>

            {/* CTA Button */}
            <button className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 px-12 py-3 border-2 border-white/40 text-white tracking-widest text-sm hover:bg-white/10 transition-all">
                DISCOVER NOW
            </button>

            {/* Progress dots */}
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
                camera={{ position: [0, 2, 8], fov: 45 }}
                shadows
            >
                {/* Warm golden lighting */}
                <ambientLight intensity={0.3} color="#FFF5E1" />

                <directionalLight
                    position={[0, 8, 8]}
                    intensity={1.5}
                    color="#FFE4B5"
                    castShadow
                />

                <pointLight position={[-8, 4, -5]} intensity={2} color="#FFD700" />
                <pointLight position={[8, 4, -5]} intensity={2} color="#FFA500" />

                <pointLight position={[-6, 2, 2]} intensity={0.8} color="#FFEFD5" />
                <pointLight position={[6, 2, 2]} intensity={0.8} color="#FFEFD5" />

                <Environment preset="studio" />
                <color attach="background" args={['#2a2a2a']} />

                {/* Reflective floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        metalness={0.95}
                        roughness={0.05}
                        envMapIntensity={2}
                    />
                </mesh>

                {/* Cells in depth - carousel style */}
                <group ref={groupRef}>
                    <Suspense fallback={null}>
                        {cells.map((cell, index) => {
                            const Cell = cell.Component;
                            const isActive = index === activeIndex;

                            return (
                                <group
                                    key={index}
                                    position={[0, 0, -index * 12]}
                                >
                                    <Cell
                                        scale={isActive ? 2.5 : 2}
                                        position={[0, 0, 0]}
                                    />

                                    {/* Spotlight on active cell */}
                                    {isActive && (
                                        <spotLight
                                            position={[0, 6, 4]}
                                            angle={0.5}
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

                <fog attach="fog" args={['#1a1a1a', 12, 25]} />
            </Canvas>
        </div>
    );
}
