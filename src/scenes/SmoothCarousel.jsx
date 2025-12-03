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
import * as THREE from 'three';

// Animated Cell Group - Rotates based on global rotation
function CellGroup({ rotationRef, children }) {
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            // Rotate the entire group based on the current rotation value
            groupRef.current.rotation.y = rotationRef.current;
        }
    });

    return <group ref={groupRef}>{children}</group>;
}

// Smart Cell Wrapper - Handles Opacity based on position
function SmartCell({ children, index, totalCells, rotationRef, baseScale, customScale }) {
    const groupRef = useRef();
    const materialsRef = useRef([]); // Cache materials to avoid traversal
    const angleStep = (2 * Math.PI) / totalCells;
    const baseAngle = index * angleStep;

    // Cache materials once on mount
    useEffect(() => {
        if (groupRef.current) {
            const mats = [];
            groupRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.transparent = true;
                    // Optional: Disable depth write for very transparent objects
                    child.material.depthWrite = true;
                    mats.push(child.material);
                }
            });
            materialsRef.current = mats;
        }
    }, []);

    useFrame(() => {
        if (groupRef.current) {
            // Calculate angular distance from center (0)
            // The group rotates by 'rotationRef.current', so the cell's effective angle is:
            // (baseAngle + rotationRef.current) normalized

            let currentAngle = (baseAngle + rotationRef.current) % (2 * Math.PI);
            if (currentAngle < 0) currentAngle += 2 * Math.PI;

            // We want the distance to 0 (front facing)
            // Distance can be at most PI (180 degrees)
            let dist = currentAngle;
            if (dist > Math.PI) dist = 2 * Math.PI - dist;

            // Opacity Logic
            // Visible range: +/- 60 degrees (approx 1 radian)
            // Opacity = 1 at dist=0, 0 at dist > 1.2
            const maxDist = 1.2;
            let opacity = 1 - (dist / maxDist);
            opacity = Math.max(0, Math.min(1, opacity));

            // Apply opacity to cached materials ONLY
            // This is much faster than traversing the scene graph every frame
            materialsRef.current.forEach(mat => {
                mat.opacity = opacity;
            });

            // Scale effect (optional: shrink slightly when far)
            const scale = (baseScale * (customScale || 1)) * (0.8 + 0.2 * opacity);
            groupRef.current.scale.setScalar(scale);
        }
    });

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

    // Physics & Rotation State
    const rotationRef = useRef(0);
    const targetRotationRef = useRef(0);
    const isDragging = useRef(false);
    const lastX = useRef(0);
    const velocity = useRef(0);

    // Cell models data
    const cellsData = [
        {
            Component: LemonCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الليمون',
            highlightColor: '#FFF44F',
            nameEn: 'Lemon Honey',
            rotation: [0, 2.8 / 0.6, 0],
            customScale: 2.3,
            customXOffset: 0.1
        },
        {
            Component: CarobCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الخروب',
            highlightColor: 'hsla(25, 75%, 47%, 0.84)',
            nameEn: 'Carob Honey',
            rotation: [0, 3.1, 0],
            customScale: 2,
            customXOffset: 0.9
        },
        {
            Component: ThymeCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الزعتر',
            highlightColor: '#4ADE80',
            nameEn: 'Thyme Honey',
            rotation: [0, 3.0 / 2.3, 0],
            customScale: 2.0,
            customXOffset: -1
        },
        {
            Component: BlueberryCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'التوت البري',
            highlightColor: '#A78BFA',
            nameEn: 'Blueberry Honey',
            rotation: [0, 2.5, 0],
            customScale: 1.9,
            customXOffset: 0,
            customYOffset: -1.0,
        },
        {
            Component: DaghmousCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الدغموس',
            highlightColor: '#FF4500',
            nameEn: 'Daghmous Honey',
            rotation: [0, 3.5, 0],
            customScale: 2,
            customXOffset: -1.6,
            customYOffset: -0.5,
        },
        {
            Component: RoseCell,
            line1: 'اكتشف منتجات',
            line2Prefix: 'خلية',
            highlight: 'الورد',
            highlightColor: '#FF69B4',
            nameEn: 'Rose Honey',
            rotation: [0, 3.0, 0],
            customScale: 2.0,
            customXOffset: 0,
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

    // Touch Handlers
    const onTouchStart = (e) => {
        isDragging.current = true;
        lastX.current = e.touches[0].clientX;
        velocity.current = 0;
    };

    const onTouchMove = (e) => {
        if (!isDragging.current) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - lastX.current;
        lastX.current = currentX;

        // Sensitivity factor (adjust for feel)
        const sensitivity = 0.005;
        targetRotationRef.current += deltaX * sensitivity;
        velocity.current = deltaX * sensitivity; // Track velocity for momentum
    };

    const onTouchEnd = () => {
        isDragging.current = false;

        // Snap to nearest cell
        // Current angle in "cell units"
        const currentAngle = targetRotationRef.current;
        // We want to snap to multiples of angleStep
        // But we need to account for direction.
        // Let's add some momentum first? For now, simple snap.

        const snapIndex = Math.round(currentAngle / angleStep);
        targetRotationRef.current = snapIndex * angleStep;
    };

    // Animation Loop for Smooth Scroll & UI Update
    // We can't use useFrame here because this component isn't inside Canvas.
    // We'll use a custom hook or just rely on the Canvas children to drive logic?
    // Actually, we need to update the UI (activeIndex) based on rotation.
    // We can put a "LogicController" inside Canvas to update the parent state.

    const LogicController = () => {
        useFrame(() => {
            // Smoothly interpolate rotation
            if (!isDragging.current) {
                rotationRef.current += (targetRotationRef.current - rotationRef.current) * 0.1;
            } else {
                rotationRef.current = targetRotationRef.current;
            }

            // Update Active Index for UI
            // Normalize rotation to 0..2PI
            let normRot = rotationRef.current % (2 * Math.PI);
            if (normRot < 0) normRot += 2 * Math.PI;

            // The active cell is the one closest to angle 0 (front)
            // Since we rotate the GROUP, the cell at index 0 is at 0 when rotation is 0.
            // When rotation is +angleStep, cell at index -1 (or last) comes to front?
            // Wait, if we rotate Group by +angle, everything moves right.
            // To bring next cell (index 1) to front (which is at +angleStep), we need to rotate Group by -angleStep.

            // So index = -rotation / angleStep
            let rawIndex = Math.round(-rotationRef.current / angleStep);
            // Normalize index to 0..totalCells-1
            let index = ((rawIndex % totalCells) + totalCells) % totalCells;

            if (index !== activeIndex) {
                setActiveIndex(index);
            }
        });
        return null;
    };

    return (
        <div
            className="w-full h-screen relative bg-gradient-to-b from-gray-800 via-gray-900 to-black overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Title */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center">
                <h1 className="text-6xl font-serif text-white mb-2 tracking-widest">
                    HONEYVERSE
                </h1>
                <p className="text-sm text-gray-400 tracking-[0.3em] uppercase">
                    Velvet Collection
                </p>
            </div>

            {/* Product Info */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl px-4 pointer-events-none">
                <div className="flex items-center justify-center gap-3 md:gap-6">
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
                shadows={!isMobile} // Disable shadows on mobile
                dpr={isMobile ? [1, 1.5] : [1, 2]} // Cap pixel ratio on mobile
                gl={{
                    powerPreference: "high-performance",
                    antialias: !isMobile, // Disable AA on mobile for speed
                    stencil: false,
                    depth: true
                }}
            >
                <LogicController />

                <ambientLight intensity={0.8} color="#FFF5E1" />
                <directionalLight position={[0, 10, 10]} intensity={1.5} color="#FFE4B5" />

                {/* Only show point lights on Desktop for extra fancy look */}
                {!isMobile && (
                    <>
                        <pointLight position={[-8, 5, -10]} intensity={2} color="#FFD700" />
                        <pointLight position={[8, 5, -10]} intensity={2} color="#FFA500" />
                    </>
                )}

                <Environment preset="studio" resolution={256} />
                <color attach="background" args={['#1a2332']} />
                <fog attach="fog" args={['#1a1a1a', 12, 25]} />

                <CellGroup rotationRef={rotationRef}>
                    <Suspense fallback={null}>
                        {cells.map((cell, index) => {
                            const Cell = cell.Component;
                            const baseScale = isMobile ? 2.0 : 1.8;

                            return (
                                <group
                                    key={index}
                                    position={cell.position}
                                    rotation={cell.rotation}
                                >
                                    <FloatingElement offset={index}>
                                        <SmartCell
                                            index={index}
                                            totalCells={totalCells}
                                            rotationRef={rotationRef}
                                            baseScale={baseScale}
                                            customScale={cell.customScale}
                                        >
                                            <Cell position={[0, 0, 0]} />
                                        </SmartCell>
                                    </FloatingElement>
                                </group>
                            );
                        })}
                    </Suspense>
                </CellGroup>
            </Canvas>
        </div>
    );
}
