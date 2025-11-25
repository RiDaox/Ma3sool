import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        // Move cursor logic
        const onMouseMove = (e) => {
            const { clientX, clientY } = e;

            // Main dot follows instantly
            gsap.to(cursorRef.current, {
                x: clientX,
                y: clientY,
                duration: 0,
            });

            // Follower follows with lag (smoothness)
            gsap.to(followerRef.current, {
                x: clientX,
                y: clientY,
                duration: 0.6,
                ease: 'power3.out'
            });
        };

        // Hover detection logic
        const onMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('[role="button"]')) {
                setIsHovering(true);
            }
        };

        const onMouseOut = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mouseout', onMouseOut);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mouseout', onMouseOut);
        };
    }, []);

    // Hover animation
    useEffect(() => {
        if (isHovering) {
            gsap.to(followerRef.current, {
                scale: 3,
                backgroundColor: 'rgba(251, 191, 36, 0.2)', // Amber-400 transparent
                borderColor: 'transparent',
                duration: 0.3
            });
        } else {
            gsap.to(followerRef.current, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: '#F59E0B', // Amber-500
                duration: 0.3
            });
        }
    }, [isHovering]);

    return (
        <>
            {/* Main Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-amber-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />

            {/* Trailing Ring */}
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-amber-500 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
            />

            {/* Hide default cursor globally */}
            <style>{`
        body {
          cursor: none;
        }
        a, button, [role="button"] {
          cursor: none;
        }
      `}</style>
        </>
    );
}
