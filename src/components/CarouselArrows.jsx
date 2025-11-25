import { useEffect } from 'react';
import { useStore } from '../store';
import { honeyTypes } from '../data/honeyTypes';

export default function CarouselArrows() {
    const currentCellIndex = useStore((state) => state.currentCellIndex);
    const setCurrentCellIndex = useStore((state) => state.setCurrentCellIndex);

    const canGoPrev = currentCellIndex > 0;
    const canGoNext = currentCellIndex < honeyTypes.length - 1;

    const handlePrev = () => {
        if (canGoPrev) {
            setCurrentCellIndex(currentCellIndex - 1);
        }
    };

    const handleNext = () => {
        if (canGoNext) {
            setCurrentCellIndex(currentCellIndex + 1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentCellIndex]);

    return (
        <div className="fixed inset-0 pointer-events-none z-20">
            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`
          absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto
          bg-white/20 backdrop-blur-md px-6 py-4 rounded-full border-2 border-white/40
          transition-all duration-300 hover:bg-white/30 hover:scale-110
          ${!canGoPrev ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}
        `}
            >
                <span className="text-3xl text-amber-900">←</span>
            </button>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`
          absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto
          bg-white/20 backdrop-blur-md px-6 py-4 rounded-full border-2 border-white/40
          transition-all duration-300 hover:bg-white/30 hover:scale-110
          ${!canGoNext ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}
        `}
            >
                <span className="text-3xl text-amber-900">→</span>
            </button>

            {/* Cell indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/40">
                    <p className="text-amber-900 font-bold">
                        {honeyTypes[currentCellIndex].name} ({currentCellIndex + 1}/{honeyTypes.length})
                    </p>
                </div>
            </div>
        </div>
    );
}
