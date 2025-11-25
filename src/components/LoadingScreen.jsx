import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const curtainRef = useRef(null);

  useEffect(() => {
    // Counter Animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // 2 seconds total

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline();

      // 1. Text Scale Up & Fade Out
      tl.to(textRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      })
        // 2. Curtain Reveal (Slide Up with bounce/fluidity)
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          delay: 0.1
        })
        // 3. Container removal
        .to(containerRef.current, {
          display: 'none',
          duration: 0,
          onComplete: () => {
            // Call onComplete AFTER animation finishes
            if (onComplete) onComplete();
          }
        });
    }
  }, [progress, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* The Curtain (Gold Background) */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-gradient-to-b from-amber-300 to-amber-500"
      />

      {/* Content */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center">
        <div className="text-6xl mb-4">🍯</div>
        <h1 className="text-4xl font-bold text-amber-900 tracking-widest">
          HONEYVERSE
        </h1>
        <div className="mt-4 text-amber-900 font-mono text-xl">
          {progress}%
        </div>
      </div>
    </div>
  );
}