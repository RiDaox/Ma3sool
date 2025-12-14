import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HoneycombLoader({ onComplete }) {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const barRef = useRef(null);
    const progressRef = useRef(null);
    const hexRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Exit animation (Swipe Up)
                gsap.to(containerRef.current, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: 'power4.inOut',
                    onComplete: onComplete
                });
            }
        });

        // Initial State
        gsap.set(progressRef.current, { scaleX: 0 });

        // 1. Text fades in
        tl.fromTo(textRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        )
            // 2. Honeycomb pulses/fills
            .fromTo(hexRef.current,
                { scale: 0, rotation: -90, opacity: 0 },
                { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
                "-=0.5"
            )
            // 3. Progress Bar Fills
            .to(progressRef.current, {
                scaleX: 1,
                duration: 2.5,
                ease: "power2.inOut"
            })
            // 4. "Loaded" Text Pop
            .to(textRef.current, {
                scale: 1.1,
                color: '#D4A574',
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });

    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Texture (Optional subtle hex pattern) */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle, #D4A574 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />

            {/* Central Honeycomb Icon */}
            <div ref={hexRef} className="relative w-32 h-32 mb-12">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_25px_rgba(212,165,116,0.6)]">
                    <path
                        d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z"
                        stroke="#D4A574"
                        strokeWidth="1.5"
                        fill="rgba(212,165,116, 0.05)"
                    />
                    <path
                        d="M50 15L80.31 32.5V67.5L50 85L19.69 67.5V32.5L50 15Z"
                        fill="#D4A574"
                        className="animate-pulse"
                        style={{ animationDuration: '3s' }}
                    />
                </svg>
            </div>

            {/* Title Text - Vintage Style */}
            <div ref={textRef} className="text-center z-10 flex flex-col items-center">
                <h1 className="text-6xl md:text-8xl text-[#f0f0f0] mb-2 drop-shadow-lg" style={{ fontFamily: "'Great Vibes', cursive" }}>
                    Rodana
                </h1>
                <p className="text-xl md:text-2xl text-[#D4A574] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Raw Infused Honey
                </p>
            </div>

            {/* Progress Bar Container */}
            <div
                ref={barRef}
                className="absolute bottom-24 w-64 md:w-96 h-[2px] bg-[#333] rounded-full overflow-hidden"
            >
                {/* Filling Bar */}
                <div
                    ref={progressRef}
                    className="w-full h-full bg-[#D4A574] origin-left shadow-[0_0_15px_#D4A574]"
                />
            </div>
        </div>
    );
}
