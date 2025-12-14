import React, { useState } from 'react';

// 🎬 Maps cell indices to Biome Themes
// Each biome has a video path and a gradient fallback
const biomes = [
    // 🍋 Lemon (Orchard)
    {
        video: '/backgrounds/lemon_orchard.mp4',
        gradient: 'linear-gradient(to bottom, #f0f9ff, #fde047, #166534)',
        name: 'Lemon Orchard'
    },
    // 🍫 Carob (Earthy Fields)
    {
        video: '/backgrounds/carob_fields.mp4',
        gradient: 'linear-gradient(to bottom, #fff7ed, #ca8a04, #78350f)',
        name: 'Carob Fields'
    },
    // 🌿 Thyme (Mountain)
    {
        video: '/backgrounds/thyme_mountain.mp4',
        gradient: 'linear-gradient(to bottom, #dbeafe, #86efac, #15803d)',
        name: 'Thyme Mountain'
    },
    // 🫐 Blueberry (Forest)
    {
        video: '/backgrounds/blueberry_forest.mp4',
        gradient: 'linear-gradient(to bottom, #e0e7ff, #a78bfa, #4c1d95)',
        name: 'Blueberry Forest'
    },
    // 🌵 Daghmous (Desert)
    {
        video: '/backgrounds/daghmous_desert.mp4',
        gradient: 'linear-gradient(to bottom, #fefce8, #fdba74, #c2410c)',
        name: 'Daghmous Desert'
    },
    // 🍃 Herbs (Meadow)
    {
        video: '/backgrounds/herbs_meadow.mp4',
        gradient: 'linear-gradient(to bottom, #ecfccb, #84cc16, #3f6212)',
        name: 'Herbs Meadow'
    },
    // 🌹 Rose (Garden)
    {
        video: '/backgrounds/rose_garden.mp4',
        gradient: 'linear-gradient(to bottom, #fff1f2, #fda4af, #be123c)',
        name: 'Rose Garden'
    },
    // 🌿 Eucalyptus (Mist)
    {
        video: '/backgrounds/eucalyptus_mist.mp4',
        gradient: 'linear-gradient(to bottom, #f0fdfa, #5eead4, #0f766e)',
        name: 'Eucalyptus Mist'
    },
    // 🌰 Anise (Spice Fields)
    {
        video: '/backgrounds/anise_spice.mp4',
        gradient: 'linear-gradient(to bottom, #fffbeb, #fcd34d, #b45309)',
        name: 'Anise Spice'
    },
    // 🐝 Bee Honey (Beehive)
    {
        video: '/backgrounds/bee_hive.mp4',
        gradient: 'linear-gradient(to bottom, #fef3c7, #fcd34d, #92400e)',
        name: 'Bee Hive'
    },
];

// 🎥 Individual Video Layer Component
function VideoBackground({ biome, isActive }) {
    const [videoError, setVideoError] = useState(false);

    return (
        <div
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isActive ? 1 : 0 }}
        >
            {/* Video (with fallback to gradient) */}
            {!videoError ? (
                <video
                    src={biome.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setVideoError(true)}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.9)' }} // Slight dim for text readability
                />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{ background: biome.gradient }}
                />
            )}
        </div>
    );
}

// 🍯 HONEY PRODUCT BACKGROUND: Animated warm gradient for product page
function HoneyProductBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Animated Honey Gradient */}
            <div
                className="absolute inset-0 animate-pulse"
                style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'honeyFlow 8s ease-in-out infinite',
                }}
            />
            {/* Soft Dripping Effect Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
                }}
            />
            {/* Warm Glow */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 60%)',
                }}
            />
            <style>{`
                @keyframes honeyFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
}

// 🌍 Main Dynamic Background Component
export default function DynamicBackground({ activeIndex, viewMode = 'carousel' }) {
    const isCarouselMode = viewMode === 'carousel' || viewMode === 'transition';

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* 🎬 CAROUSEL MODE: Video/Gradient Biomes */}
            {isCarouselMode && (
                <>
                    {biomes.map((biome, index) => (
                        // 🎬 Video on all devices (user provided portrait video)
                        <VideoBackground
                            key={index}
                            biome={biome}
                            isActive={activeIndex === index}
                        />
                    ))}
                </>
            )}

            {/* 🍯 PRODUCT MODE: Animated Honey Background */}
            {viewMode === 'product' && <HoneyProductBackground />}

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/10" />
        </div>
    );
}
