import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import LemonCell from '../components/models/LemonCell';
import CarobCell from '../components/models/CarobCell';

export default function DGLayout() {
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

            {/* Navigation arrows */}
            <button className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Product name */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 text-center">
                <h2 className="text-3xl font-serif text-white mb-1 tracking-wider">
                    VELVET PASSION OUD
                </h2>
                <p className="text-sm text-gray-400 tracking-widest uppercase">
                    Honey Collection
                </p>
            </div>

            {/* CTA Button */}
            <button className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 px-12 py-3 border-2 border-white/40 text-white tracking-widest text-sm hover:bg-white/10 transition-all">
                DISCOVER NOW
            </button>

            <Canvas
                camera={{ position: [0, 2, 12], fov: 40 }}
                shadows
            >
                {/* Warm golden lighting - D&G style */}
                <ambientLight intensity={0.3} color="#FFF5E1" />

                {/* Key light - warm from front */}
                <directionalLight
                    position={[0, 8, 8]}
                    intensity={1.5}
                    color="#FFE4B5"
                    castShadow
                />

                {/* Rim lights - golden from back */}
                <pointLight position={[-8, 4, -5]} intensity={2} color="#FFD700" />
                <pointLight position={[8, 4, -5]} intensity={2} color="#FFA500" />

                {/* Fill lights from sides */}
                <pointLight position={[-6, 2, 2]} intensity={0.8} color="#FFEFD5" />
                <pointLight position={[6, 2, 2]} intensity={0.8} color="#FFEFD5" />

                <Environment preset="studio" />

                {/* Gradient background */}
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

                {/* 3 Cells - D&G positioning */}
                <Suspense fallback={null}>
                    {/* Left cell - Tall (like left perfume bottle) */}
                    <group position={[-4, 0.5, 0]}>
                        <LemonCell scale={2.2} />
                    </group>

                    {/* Center cell - Medium (like center bottle) */}
                    <group position={[0, -0.3, 1]}>
                        <CarobCell scale={1.8} />
                    </group>

                    {/* Right cell - Medium (like right bottle) */}
                    <group position={[4, -0.2, 0.5]}>
                        <LemonCell scale={1.9} />
                    </group>
                </Suspense>

                {/* Soft fog for depth */}
                <fog attach="fog" args={['#1a1a1a', 15, 30]} />
            </Canvas>
        </div>
    );
}
