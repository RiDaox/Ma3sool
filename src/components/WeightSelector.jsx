import { useStore } from '../store';
import { availableWeights } from '../data/honeyTypes';

export default function WeightSelector() {
    const selectedWeight = useStore((state) => state.selectedWeight);
    const setSelectedWeight = useStore((state) => state.setSelectedWeight);
    const setScene = useStore((state) => state.setScene);

    const handleWeightClick = (weight) => {
        setSelectedWeight(weight.value);
        // الانتقال لمشهد القرعة
        setTimeout(() => {
            setScene('jar');
        }, 300);
    };

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
            {availableWeights.map((weight) => (
                <button
                    key={weight.value}
                    onClick={() => handleWeightClick(weight)}
                    className={`
            px-6 py-3 rounded-full font-bold text-lg
            transition-all duration-300 transform
            backdrop-blur-md border-2
            ${selectedWeight === weight.value
                            ? 'bg-amber-500 border-amber-600 text-white scale-110 shadow-2xl'
                            : 'bg-white/20 border-white/40 text-amber-900 hover:bg-white/30 hover:scale-105 hover:shadow-xl'
                        }
          `}
                >
                    <div className="text-center">
                        <div className="font-bold">{weight.label}</div>
                        <div className="text-sm opacity-80">{weight.price} د.م</div>
                    </div>
                </button>
            ))}
        </div>
    );
}
