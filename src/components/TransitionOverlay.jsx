import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import gsap from 'gsap';

export default function TransitionOverlay() {
    const overlayRef = useRef();
    const isTransitioning = useStore((state) => state.isTransitioning);
    const selectedHoneyType = useStore((state) => state.selectedHoneyType);
    const honeyTypes = useStore((state) => state.honeyTypes) || []; // Fallback if not in store yet, but we import data usually

    // We need to get the color of the selected honey. 
    // Since honeyTypes might not be in store, we'll import them or pass them.
    // For now let's use a generic gold/white flash or try to find the color.

    useEffect(() => {
        if (isTransitioning) {
            // Flash In
            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.in',
                delay: 0.5 // Wait for camera to start diving
            });
        } else {
            // Fade Out (reveal new scene)
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 1.5,
                ease: 'power2.out',
                delay: 0.2
            });
        }
    }, [isTransitioning]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 pointer-events-none bg-amber-100"
            style={{ opacity: 0 }}
        />
    );
}
