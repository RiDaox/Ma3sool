import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import LemonCell from '../components/models/LemonCell';
import CarobCell from '../components/models/CarobCell';
import BlueberryCell from '../components/models/BlueberryCell';
import ThymeCell from '../components/models/ThymeCell';
import DaghmousCell from '../components/models/DaghmousCell';
import RoseCell from '../components/models/RoseCell';
import HerbsCell from '../components/models/HerbsCell';
import gsap from 'gsap';
import * as THREE from 'three';

// Animated Group - Handles smooth position/rotation transitions
function AnimatedGroup({ position, rotation, children }) {
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            // Smoothly interpolate position
            groupRef.current.position.lerp(new THREE.Vector3(...position), 0.1);

            // Smoothly interpolate rotation (using quaternion for better rotation)
            // But for simple Y rotation, lerping Euler is okay if no gimbal lock
            // Using simple lerp for now
            groupRef.current.rotation.x += (rotation[0] - groupRef.current.rotation.x) * 0.1;
            groupRef.current.rotation.y += (rotation[1] - groupRef.current.rotation.y) * 0.1;
            groupRef.current.rotation.z += (rotation[2] - groupRef.current.rotation.z) * 0.1;
        }
    });

    return <group ref={groupRef}>{children}</group>;
}

// Static Cell Group - Just a container
function CellGroup({ children }) {
    return <group>{children}</group>;
}

// Smart Cell Wrapper - Handles Scale & Opacity based on distance
function SmartCell({ children, distance }) {
    const groupRef = useRef();

    useEffect(() => {
        if (groupRef.current) {
            // Scale animation
            // Distance 0 (Active): 1.0
            // Distance 1 (Side): 0.8
            // Distance 2 (Far): 0.6
            const targetScale = distance === 0 ? 1.0 : (distance <= 1 ? 0.8 : 0.6);

            gsap.to(groupRef.current.scale, {
                x: targetScale,
                y: targetScale,
                z: targetScale,
                duration: 0.5,
                ease: 'power2.out'
            });

            // Opacity/Dimming animation
            groupRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.transparent = true;
                    child.material.depthWrite = true;

                    // Distance 0: 1.0 opacity
                    // Distance 1: 0.3 opacity
                    // Distance 2: 0.0 opacity (invisible)
                    const targetOpacity = distance === 0 ? 1.0 : (distance <= 1 ? 0.3 : 0.0);

                    // Tint color for inactive cells
                    if (distance > 0) {
                        gsap.to(child.material.color, { r: 0.2, g: 0.2, b: 0.2, duration: 0.5 });
                    } else {
                        gsap.to(child.material.color, { r: 1, g: 1, b: 1, duration: 0.5 });
                    }

                    gsap.to(child.material, {
                        opacity: targetOpacity,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        }
    }, [distance]);

    return <group ref={groupRef}>{children}</group>;
}

// Floating animation wrapper
function FloatingElement({ children, offset = 0 }) {
    const group = useRef();

    useFrame((state) => {
        if (group.current) {
            const t = state.clock.getElapsedTime();
            group.current.position.y = Math.sin(t * 1.5 + offset) * 0.15;
            group.current.rotation.z = Math.sin(t * 0.8 + offset) * 0.03;
        }
    });

    return <group ref={group}>{children}</group>;
}

export default function SmoothCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Cell models data
    // 📐 SPACING GUIDE: customSpacing/customMobileSpacing controls individual cell spacing
    // 1.0 = normal, >1.0 = more space, <1.0 = less space
    const cellsData = [
        // 🍋 LEMON CELL
        {
            Component: LemonCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الليمون',
            highlightColor: '#FFF44F',
            nameEn: 'Lemon Honey',
            rotation: [0, 2.8 / 0.6, 0],
            // 💻 Desktop Settings
            customScale: 2.3,
            customXOffset: 0.1,
            customYOffset: 1.8,
            customSpacing: 1.0, // � spacing multiplier
            // �📱 Mobile Settings
            customMobileScale: 9,
            customMobileXOffset: 0.1,
            customMobileYOffset: 1.8,
            customMobileSpacing: 1.0, // 📏 spacing multiplier
        },
        // 🍫 CAROB CELL
        {
            Component: CarobCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الخروب',
            highlightColor: 'hsla(25, 75%, 47%, 0.84)',
            nameEn: 'Carob Honey',
            rotation: [0, 3.1 / 2, 0],
            // 💻 Desktop Settings
            customScale: 2,
            customXOffset: 0.9,
            customYOffset: 1.8,
            customSpacing: 1.0, // 📏 spacing multiplier
            // 📱 Mobile Settings
            customMobileScale: 7.5,
            customMobileXOffset: 5,
            customMobileYOffset: 1.8,
            customMobileSpacing: 1.0, // 📏 spacing multiplier
        },
        // 🌿 THYME CELL
        {
            Component: ThymeCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الزعتر',
            highlightColor: '#4ADE80',
            nameEn: 'Thyme Honey',
            rotation: [0, 5, 0],
            // 💻 Desktop Settings
            customScale: 2.0,
            customXOffset: -1,
            customYOffset: 1.5,
            customSpacing: 1.0, // 📏 spacing multiplier
            // 📱 Mobile Settings
            customMobileScale: 8.5,
            customMobileXOffset: -5,
            customMobileYOffset: 1.5,
            customMobileSpacing: 1.0, // 📏 spacing multiplier
        },
        // 🫐 BLUEBERRY CELL
        {
            Component: BlueberryCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'التوت البري',
            highlightColor: '#A78BFA',
            nameEn: 'Blueberry Honey',
            rotation: [0, 5, 0],
            // 💻 Desktop Settings
            customScale: 1.9,
            customXOffset: 0,
            customYOffset: 0.5,
            customSpacing: 1.0, // 📏 spacing multiplier
            // 📱 Mobile Settings
            customMobileScale: 6.0,
            customMobileXOffset: 0,
            customMobileYOffset: 0.5,
            customMobileSpacing: 1.0, // 📏 spacing multiplier
        },
        // 🌵 DAGHMOUS CELL
        {
            Component: DaghmousCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الدغموس',
            highlightColor: '#FF4500',
            nameEn: 'Daghmous Honey',
            rotation: [0, 5, 0],
            // 💻 Desktop Settings
            customScale: 2,
            customXOffset: -1.6,
            customYOffset: 1.5,
            customSpacing: 1.0, // 📏 spacing multiplier
            // 📱 Mobile Settings
            customMobileScale: 8.5,
            customMobileXOffset: -1.6,
            customMobileYOffset: 1.5,
            customMobileSpacing: 1.0, // 📏 spacing multiplier
        },
        // 🍃 HERBS CELL
        {
            Component: HerbsCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الأعشاب',
            highlightColor: '#22c55e',
            nameEn: 'Herbs Honey',
            rotation: [0, 5, 0],
            // 💻 Desktop Settings
            customScale: 3,
            customXOffset: 1,
            customYOffset: 1,
            customSpacing: 1.0, // 📏 spacing multiplier
            // 📱 Mobile Settings
            customMobileScale: 11,
            customMobileXOffset: 14,
            customMobileYOffset: 1.5,
            customMobileSpacing: 1.0, // 📏 spacing multiplier
        },
        // 🌹 ROSE CELL
        {
            Component: RoseCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الربيع',
            highlightColor: '#FF69B4',
            nameEn: 'Rose Honey',
            rotation: [0, 5, 0],
            // 💻 Desktop Settings
            customScale: 2.0,
            customXOffset: 0,
            customYOffset: 1.5,
            customSpacing: 1.0, // 📏 spacing multiplier
            // 📱 Mobile Settings
            customMobileScale: 7.5,
            customMobileXOffset: 0,
            customMobileYOffset: 1.5,
            customMobileSpacing: 1.0, // 📏 spacing multiplier
        },
    ];

    const RADIUS = isMobile ? 14 : 18;
    const totalCells = cellsData.length;
    const angleStep = (2 * Math.PI) / totalCells;

    // Generate positions - CIRCULAR
    const cells = cellsData.map((cell, index) => {
        const angle = index * angleStep;
        const customRotY = cell.rotation ? cell.rotation[1] : 0;
        return {
            ...cell,
            position: [
                (RADIUS * Math.sin(angle)) + (cell.customXOffset || 0),
                0,
                RADIUS * Math.cos(angle)
            ],
            rotation: [0, -angle + customRotY, 0]
        };
    });

    return (
        <div className="w-full h-screen relative bg-gradient-to-b from-gray-800 via-gray-900 to-black overflow-hidden">
            {/* Title */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center">
                <h1 className="text-6xl font-serif text-white mb-2 tracking-widest">
                    HONEYVERSE
                </h1>
                <p className="text-sm text-gray-400 tracking-[0.3em] uppercase">
                    Velvet Collection
                </p>
            </div>

            {/* Product Info with Navigation Arrows */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl px-4">
                <div className="flex items-center justify-center gap-3 md:gap-6">
                    {/* Previous Arrow */}
                    <button
                        onClick={() => setActiveIndex((prev) => (prev - 1 + cells.length) % cells.length)}
                        className="relative w-14 h-14 flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto"
                    >
                        <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-[#D4A574]/60 transition-all duration-500 group-hover:scale-110" />
                        <div className="absolute inset-1 rounded-full bg-white/5 backdrop-blur-sm group-hover:bg-[#D4A574]/20 transition-all duration-300" />
                        <svg
                            className="w-6 h-6 text-white/70 group-hover:text-[#D4A574] relative z-10 transition-all duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Product Info */}
                    <div className="text-center w-64 md:w-80 relative group cursor-default">
                        <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
                        <h3 className="text-base md:text-xl font-light text-white/90 mb-1 tracking-wide relative z-10">
                            {cells[activeIndex].line1}
                        </h3>
                        <h2 className="text-2xl md:text-4xl font-serif text-white mb-2 tracking-wider whitespace-nowrap relative z-10 drop-shadow-lg">
                            {cells[activeIndex].line2Prefix}{' '}
                            <span style={{ color: cells[activeIndex].highlightColor, textShadow: `0 0 20px ${cells[activeIndex].highlightColor}40` }}>
                                {cells[activeIndex].highlight}
                            </span>
                        </h2>
                        <p className="text-xs md:text-sm text-[#D4A574] tracking-[0.2em] uppercase font-medium relative z-10">
                            {cells[activeIndex].nameEn}
                        </p>
                    </div>

                    {/* Next Arrow */}
                    <button
                        onClick={() => setActiveIndex((prev) => (prev + 1) % cells.length)}
                        className="relative w-14 h-14 flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto"
                    >
                        <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-[#D4A574]/60 transition-all duration-500 group-hover:scale-110" />
                        <div className="absolute inset-1 rounded-full bg-white/5 backdrop-blur-sm group-hover:bg-[#D4A574]/20 transition-all duration-300" />
                        <svg
                            className="w-6 h-6 text-white/70 group-hover:text-[#D4A574] relative z-10 transition-all duration-300 group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
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
                        className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-12 bg-white' : 'w-8 bg-gray-500'}`}
                    />
                ))}
            </div>

            <Canvas
                camera={{ position: [0, 0.5, 16], fov: isMobile ? 50 : 45 }}
                shadows={!isMobile}
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                gl={{
                    powerPreference: "high-performance",
                    antialias: !isMobile,
                    stencil: false,
                    depth: true
                }}
            >
                <ambientLight intensity={0.8} color="#FFF5E1" />
                <directionalLight position={[0, 10, 10]} intensity={1.5} color="#FFE4B5" />

                {!isMobile && (
                    <>
                        <pointLight position={[-8, 5, -10]} intensity={2} color="#FFD700" />
                        <pointLight position={[8, 5, -10]} intensity={2} color="#FFA500" />
                    </>
                )}

                <Environment preset="studio" resolution={256} />
                <color attach="background" args={['#1a2332']} />
                <fog attach="fog" args={['#1a1a1a', 12, 25]} />

                <CellGroup>
                    <Suspense fallback={null}>
                        {cellsData.map((cell, index) => {
                            const Cell = cell.Component;

                            // Calculate relative position
                            let relativeIndex = index - activeIndex;
                            // Handle wrapping for infinite scroll effect
                            if (relativeIndex < -totalCells / 2) relativeIndex += totalCells;
                            if (relativeIndex > totalCells / 2) relativeIndex -= totalCells;

                            // Show cells up to distance 2 to allow smooth entry/exit
                            const distance = Math.abs(relativeIndex);
                            const isVisible = distance <= 2;
                            if (!isVisible) return null;

                            // 📍 SIMPLE LINEAR LAYOUT:
                            // Side cells always at screen edges (half visible)
                            // xOffset is large enough to push sides to edges
                            const xOffset = isMobile ? 5.5 : 6.0;
                            const zOffset = -2;

                            // Y offset per cell (for vertical adjustment only)
                            const cellYOffset = isMobile
                                ? (cell.customMobileYOffset ?? cell.customYOffset ?? 0)
                                : (cell.customYOffset ?? 0);

                            const position = [
                                relativeIndex * xOffset,  // Simple: index * offset
                                -1 + cellYOffset,
                                distance * zOffset
                            ];

                            // Rotation: Face forward, slight tilt for sides
                            const rotation = [
                                0,
                                (cell.rotation ? cell.rotation[1] : 0) + (relativeIndex * -0.5),
                                0
                            ];

                            // 📱 MOBILE SETTINGS:
                            // If mobile, use customMobileScale if defined, otherwise use baseScale * customScale
                            let scale;
                            if (isMobile) {
                                scale = cell.customMobileScale || (2.6 * (cell.customScale || 1));
                            } else {
                                scale = 2.2 * (cell.customScale || 1);
                            }

                            return (
                                <AnimatedGroup
                                    key={index}
                                    position={position}
                                    rotation={rotation}
                                >
                                    <FloatingElement offset={index}>
                                        <SmartCell distance={distance}>
                                            <Cell
                                                position={[0, 0, 0]}
                                                scale={scale}
                                            />
                                        </SmartCell>
                                    </FloatingElement>
                                </AnimatedGroup>
                            );
                        })}
                    </Suspense>
                </CellGroup>

                <Environment preset="sunset" />
            </Canvas>
        </div>
    );
}
