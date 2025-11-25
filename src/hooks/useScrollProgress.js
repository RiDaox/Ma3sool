import { useEffect } from 'react';
import { useStore } from '../store';

// Custom hook لتتبع تقدم السكرول - virtual scroll
export function useScrollProgress() {
    const setScrollProgress = useStore((state) => state.setScrollProgress);
    const scrollProgress = useStore((state) => state.scrollProgress);
    const currentScene = useStore((state) => state.currentScene);

    useEffect(() => {
        // السكرول يشتغل فقط في مشهد ring
        if (currentScene !== 'ring') {
            return;
        }

        const handleWheel = (e) => {
            e.preventDefault(); // منع السكرول العادي

            // تحديث progress بناءً على اتجاه السكرول
            const delta = e.deltaY > 0 ? 0.02 : -0.02; // سكرول لتحت = zoom in
            const newProgress = Math.max(0, Math.min(1, scrollProgress + delta));

            setScrollProgress(newProgress);
        };

        // استخدام wheel event بدل scroll
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => window.removeEventListener('wheel', handleWheel);
    }, [setScrollProgress, scrollProgress, currentScene]);
}
