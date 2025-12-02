import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const curtainRef = useRef(null);

  useEffect(() => {
    // Simulate loading progress with a timer
    const duration = 2000; // 2 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;
    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        setDisplayProgress(100);
        clearInterval(timer);
      } else {
        setDisplayProgress(Math.floor(currentProgress));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (displayProgress === 100) {
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
  }, [displayProgress, onComplete]);

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
          {displayProgress}%
        </div>
      </div>
    </div>
  );
}