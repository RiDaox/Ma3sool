import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, PresentationControls, ScrollControls, useScroll } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useLayoutEffect } from 'react';

import gsap from 'gsap';
import * as THREE from 'three';
import AnimatedGroup from '../components/AnimatedGroup';
import SmartCell from '../components/models/SmartCell';
import BeeSwarm from '../components/BeeSwarm';
import ProductOverlay from '../components/ProductOverlay';
import LemonJar from '../components/products/LemonJar';
import DynamicBackground from '../components/DynamicBackground';

// Models
import LemonCell from '../components/models/LemonCell';
import CarobCell from '../components/models/CarobCell';
import BlueberryCell from '../components/models/BlueberryCell';
import ThymeCell from '../components/models/ThymeCell';
import DaghmousCell from '../components/models/DaghmousCell';
import RoseCell from '../components/models/RoseCell';
import HerbsCell from '../components/models/HerbsCell';
import EucalyptusCell from '../components/models/EucalyptusCell';
import AniseCell from '../components/models/AniseCell';
import BeeHoneyCell from '../components/models/BeeHoneyCell';


// Components
// 📜 SINGLE ITEM (Controlled by Scroll)
function ScrollItem({ index, total, cell, isMobile, onClick, setActiveIndex }) {
    const group = useRef();
    const scroll = useScroll();

    useFrame(() => {
        // 🧮 MATH: Calculate "influence" of this item based on scroll position
        const currentFloatIndex = scroll.offset * (total - 1);
        const distance = Math.abs(currentFloatIndex - index);

        // 1.0 when active, 0.0 when neighbor becomes active
        // effectively: linear interpolation
        const strength = Math.max(0, 1 - distance * 1.2); // Tweak to 1.2 for fuller intersection

        if (group.current) {
            // 📏 SCALE: Grows to max, shrinks to 0
            const baseScale = isMobile
                ? (cell.customMobileScale || (2.6 * (cell.customScale || 1)))
                : (2.2 * (cell.customScale || 1));

            // Smoothstep for smoother scale transition
            const smoothStrength = THREE.MathUtils.smoothstep(strength, 0, 1);
            const targetScale = baseScale * smoothStrength;

            group.current.scale.setScalar(targetScale);

            // 📍 POSITION: Cells rise from BOTTOM to TOP
            // INVERTED: Scroll down = cells come UP from below
            const yOffset = (currentFloatIndex - index) * 2;
            group.current.position.y = yOffset;

            // 🔄 ROTATION: Base Rotation only (Fixed in place)
            // User requested to remove the scroll-driven spin.
            const baseRotation = cell.rotation ? cell.rotation[1] : 0;
            group.current.rotation.y = baseRotation;

            // 👻 VISIBILITY hack (hide if too small to save draw calls)
            group.current.visible = strength > 0.01;
        }
    });

    const Cell = cell.Component;

    return (
        <group ref={group} onClick={onClick}>
            <Cell />
        </group>
    );
}

// 🎬 SCENE MANAGER
function VerticalScrollScene({ cellsData, setActiveIndex, handleCellClick, isMobile, visible }) {
    const scroll = useScroll();

    useFrame(() => {
        // Sync Active Index for UI (Title, etc)
        const total = cellsData.length;
        const currentFloatIndex = scroll.offset * (total - 1);
        const currentIntIndex = Math.round(currentFloatIndex);
        setActiveIndex(currentIntIndex);
    });

    if (!visible) return null;

    return (
        <group position={[0, -0.5, 0]}>
            {cellsData.map((cell, i) => (
                <ScrollItem
                    key={i}
                    index={i}
                    total={cellsData.length}
                    cell={cell}
                    isMobile={isMobile}
                    onClick={handleCellClick}
                />
            ))}
        </group>
    );
}

// Animated Cell Group - Hides during product view
function CellGroup({ children, visible = true }) {
    const group = useRef();
    useLayoutEffect(() => {
        if (group.current) {
            gsap.to(group.current.position, {
                y: visible ? 0 : -10,
                duration: 1,
                ease: "power3.inOut"
            });
            gsap.to(group.current.scale, {
                x: visible ? 1 : 0,
                y: visible ? 1 : 0,
                z: visible ? 1 : 0,
                duration: 1,
                ease: "power3.inOut"
            });
        }
    }, [visible]);
    return <group ref={group}>{children}</group>;
}

// Camera Controller for Mythical Transitions
function CameraController({ viewMode }) {
    const { camera } = useThree();
    const initialPos = useRef(new THREE.Vector3(0, 0.5, 16));

    useLayoutEffect(() => {
        if (viewMode === 'transition') {
            gsap.to(camera.position, { z: 4, y: 0, duration: 1.5, ease: "power4.in" });
        } else if (viewMode === 'product') {
            camera.position.set(0, 0, 8);
            camera.lookAt(0, 0, 0);
        } else if (viewMode === 'carousel') {
            gsap.to(camera.position, {
                x: initialPos.current.x,
                y: initialPos.current.y,
                z: initialPos.current.z,
                duration: 1.5,
                ease: "power4.out",
                delay: 0.5
            });
        }
    }, [viewMode, camera]);

    return null;
}

// Cell models data
const cellsData = [
    // 🍋 LEMON CELL
    {
        Component: LemonCell,
        line1: 'اكتشف منتجات',
        line2Prefix: 'خلية',
        highlight: 'الليمون',
        highlightColor: '#FFF44F',
        nameEn: 'Lemon Honey',
        rotation: [0, 4.7, 0],
        // 💻 Desktop Settings
        customScale: 4,
        customXOffset: -0.1,
        customYOffset: 1.7,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 9,
        customMobileXOffset: 0,
        customMobileYOffset: 1.8,
        customMobileSpacing: 1.0,
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
        customScale: 3.5,
        customXOffset: 0,
        customYOffset: 1.8,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 7.5,
        customMobileXOffset: 1.1,
        customMobileYOffset: 1.5,
        customMobileSpacing: 1.0,
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
        customScale: 3.5,
        customXOffset: -1,
        customYOffset: 1.5,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 8.5,
        customMobileXOffset: -1,
        customMobileYOffset: 1.5,
        customMobileSpacing: 1.0,
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
        customScale: 3.1,
        customXOffset: 0,
        customYOffset: 0.5,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 6.0,
        customMobileXOffset: 0,
        customMobileYOffset: 0.5,
        customMobileSpacing: 1.0,
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
        customScale: 3.5,
        customXOffset: -0.5,
        customYOffset: 1.5,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 8.5,
        customMobileXOffset: -1,
        customMobileYOffset: 1.5,
        customMobileSpacing: 1.0,
    },
    // 🍃 HERBS CELL
    {
        Component: HerbsCell,
        line1: 'اكتشف منتجات',
        line2Prefix: 'خلية',
        highlight: 'الأعشاب',
        highlightColor: '#22c55e',
        nameEn: 'Herbs Honey',
        rotation: [0, 4.5, 0],
        // 💻 Desktop Settings
        customScale: 6,
        customXOffset: 3,
        customYOffset: 1.5,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 13,
        customMobileXOffset: 5,
        customMobileYOffset: 1,
        customMobileSpacing: 1.0,
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
        customScale: 4.0,
        customXOffset: 0,
        customYOffset: 1.8,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 8.5,
        customMobileXOffset: 0,
        customMobileYOffset: 1.5,
        customMobileSpacing: 1.0,
    },
    // 🌿 EUCALYPTUS CELL
    {
        Component: EucalyptusCell,
        line1: 'اكتشف منتجات',
        line2Prefix: 'خلية',
        highlight: 'الكاليبتوس',
        highlightColor: '#10B981',
        nameEn: 'Eucalyptus Honey',
        rotation: [0, 5, 0],
        // 💻 Desktop Settings
        customScale: 3.5,
        customXOffset: 0,
        customYOffset: 1.5,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 7.5,
        customMobileXOffset: 0,
        customMobileYOffset: 1.5,
        customMobileSpacing: 1.0,
    },
    // 🌰 ANISE CELL (النافع)
    {
        Component: AniseCell,
        line1: 'اكتشف منتجات',
        line2Prefix: 'خلية',
        highlight: 'النافع',
        highlightColor: '#D4A574',
        nameEn: 'Anise Honey',
        rotation: [0, 5, 0],
        // 💻 Desktop Settings
        customScale: 3.5,
        customXOffset: 0,
        customYOffset: 1.5,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 11,
        customMobileXOffset: 0,
        customMobileYOffset: 1.5,
        customMobileSpacing: 1.0,
    },
    // 🐝 BEE HONEY CELL (عسل النحل)
    {
        Component: BeeHoneyCell,
        line1: 'اكتشف منتجات',
        line2Prefix: 'عسل',
        highlight: 'النحل',
        highlightColor: '#FFD700', // Golden
        nameEn: 'Bee Honey',
        rotation: [0, 5, 0],
        // 💻 Desktop Settings
        customScale: 3.5,
        customXOffset: 0,
        customYOffset: 1.5,
        customSpacing: 1.0,
        // 📱 Mobile Settings
        customMobileScale: 8,
        customMobileXOffset: 0,
        customMobileYOffset: 1.5,
        customMobileSpacing: 1.0,
    },
];

export default function SmoothCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    // Phase 2 States
    const [viewMode, setViewMode] = useState('carousel'); // carousel, transition, product
    const [whiteFlash, setWhiteFlash] = useState(false);
    const [showProductJar, setShowProductJar] = useState(true); // Default true

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 🌟 MYTHICAL TRANSITION TRIGGER
    const handleCellClick = () => {
        if (viewMode !== 'carousel') return;
        setViewMode('transition');
        setTimeout(() => setWhiteFlash(true), 1200);
        setTimeout(() => {
            setViewMode('product');
            setWhiteFlash(false);
        }, 1800);
    };

    // 🔙 BACK TO HIVE
    const handleBackToHive = () => {
        setWhiteFlash(true);
        setShowProductJar(false);
        setTimeout(() => {
            setViewMode('carousel');
            setWhiteFlash(false);
        }, 500);
    };

    // ⚖️ WEIGHT SELECTION Logic
    const handleWeightSelect = (weight) => {
        if (weight === 500) {
            setShowProductJar(true);
        } else {
            setShowProductJar(false);
        }
    };

    // ⏱️ AUTO-ENTER TIMER: If user stays on a cell for 7s, enter product view
    useEffect(() => {
        if (viewMode !== 'carousel') return;

        const timer = setTimeout(() => {
            handleCellClick();
        }, 7000); // 7 Seconds Delay

        return () => clearTimeout(timer);
    }, [activeIndex, viewMode]);

    const isCarouselVisible = viewMode === 'carousel' || viewMode === 'transition';

    return (
        <div className="w-full h-screen relative overflow-hidden bg-[#f0f4f8]">
            {/* 🌍 DYNAMIC BACKGROUND (Biomes - Carousel Only) */}
            <DynamicBackground activeIndex={activeIndex} viewMode={viewMode} />

            {/* ⚡ WHITE FLASH OVERLAY - z-[100] to be ABOVE EVERYTHING including Canvas */}
            <div
                className={`absolute inset-0 z-[100] bg-white pointer-events-none transition-opacity duration-300 ease-out 
                ${whiteFlash ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* 🖥️ CAROUSEL UI (Visible only in carousel mode) */}
            <div className={`absolute inset-0 z-40 pointer-events-none transition-all duration-700 ${viewMode === 'carousel' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                {/* Title - Vintage Style */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center flex flex-col items-center">
                    <h1 className="text-7xl font-cursive text-[#2c3e50] mb-2 drop-shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>
                        Rodana
                    </h1>
                    <p className="text-sm text-[#7f8c8d] tracking-[0.3em] uppercase font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Raw Infused Honey
                    </p>
                </div>


                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-[#2c3e50]/60 animate-bounce flex flex-col items-center gap-2">
                    <span className="text-xs tracking-[0.3em] font-medium uppercase">Scroll to Discover</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>

                {/* CTA Button - Triggers Transition */}
                <button
                    onClick={handleCellClick}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 px-12 py-3 border-2 border-[#2c3e50]/40 text-[#2c3e50] font-bold tracking-widest text-sm hover:bg-[#2c3e50] hover:text-white transition-all"
                >
                    DISCOVER NOW
                </button>
            </div>

            {/* 🛍️ PRODUCT DETAIL UI (Visible only in 'product' mode) */}
            {viewMode === 'product' && (
                <ProductOverlay
                    activeProduct={cellsData[activeIndex]} // Updated to use cellsData
                    onWeightSelect={handleWeightSelect}
                    onBack={handleBackToHive}
                />
            )}

            <Canvas
                camera={{ position: [0, 0.5, 16], fov: isMobile ? 50 : 45 }}
                shadows={!isMobile}
                dpr={isMobile ? [1, 1.5] : [1, 2]}
                gl={{
                    powerPreference: "high-performance",
                    antialias: !isMobile,
                    stencil: false,
                    depth: true,
                    alpha: true, // 🎬 Make Canvas transparent so video shows through
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2
                }}
            >
                <Suspense fallback={null}>
                    {/* ☀️ BRIGHT REALISTIC LIGHTING */}
                    <ambientLight intensity={1.5} color="#ffffff" />
                    <directionalLight
                        position={[5, 10, 5]}
                        intensity={2.0}
                        color="#fffdf0"
                        castShadow={!isMobile}
                    />
                    <directionalLight
                        position={[-5, 5, -5]}
                        intensity={1.0}
                        color="#e0f7fa"
                    />

                    {/* 🎥 CAMERA CONTROLLER FOR TRANSITIONS */}
                    <CameraController viewMode={viewMode} />

                    {/* 🌌 ENVIRONMENT FOR LIGHTING ONLY (Video is the background) */}
                    <Environment
                        preset="night"
                        background={false} // 🎬 Disabled! Video is now the background
                        blur={0.4}
                    />

                    {/* 🐝 FLYING BEES SWARM */}
                    <BeeSwarm count={30} radius={viewMode === 'product' ? 30 : 20} />

                    {/* 📜 VERTICAL SCROLL CONTROLS */}
                    <ScrollControls pages={cellsData.length} damping={0.2} style={{ scrollbarWidth: 'none' }}>
                        <VerticalScrollScene
                            cellsData={cellsData}
                            setActiveIndex={setActiveIndex}
                            handleCellClick={handleCellClick}
                            isMobile={isMobile}
                            visible={isCarouselVisible}
                        />
                    </ScrollControls>

                    {/* 🍯 PRODUCT DETAIL VIEW (The Jar) */}
                    {/* 🍯 PRODUCT DETAIL VIEW (The Jar) - Only for Lemon Honey */}
                    {viewMode === 'product' && cellsData[activeIndex].nameEn === 'Lemon Honey' && (
                        <group position={[0, -1, 0]}>
                            <PresentationControls
                                global={true} // Enable global touch to fix mobile interaction issues
                                cursor={true}
                                snap={false}
                                speed={10.0} // SUPER FAST Rotation
                                zoom={1}
                                rotation={[0, 0, 0]}
                                polar={[-Math.PI, Math.PI]}
                                azimuth={[-Math.PI, Math.PI]}
                                config={{ mass: 0.05, tension: 500, friction: 10 }} // Instant snappy physics (high tension, low mass)
                            >
                                <LemonJar
                                    visible={true}
                                    customScale={isMobile ? 0.8 : 1.0} // 📱 CONTROL JAR SIZE HERE: Mobile=0.8, Desktop=1.0
                                />
                            </PresentationControls>
                            <spotLight
                                position={[2, 5, 2]}
                                angle={0.5}
                                penumbra={0.5}
                                intensity={3}
                                color="white"
                                castShadow
                            />
                        </group>
                    )}
                </Suspense>
            </Canvas>
        </div>
    );
}