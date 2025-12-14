import React, { useState } from 'react';

export default function ProductOverlay({ activeProduct, onWeightSelect, onBack }) {
    const weights = [50, 150, 250, 500, 1000];
    const [selectedWeight, setSelectedWeight] = useState(null); // Initially null, product hidden? Or default 500? Use null as per request "click 500g to see jar"

    const handleWeightClick = (weight) => {
        setSelectedWeight(weight);
        onWeightSelect(weight);
    };

    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-5 left-4 text-[#2c3e50] font-bold text-lg tracking-widest hover:text-[#D4A574] transition-colors pointer-events-auto flex items-center gap-2"
            >
                ← BACK TO HIVE
            </button>

            {/* Product Title (Top Center) - Arabic Format */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
                <p className="text-lg md:text-xl text-[#2c3e50]/70 tracking-[0.2em] mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    {activeProduct?.line1}
                </p>
                <h1 className="text-3xl md:text-5xl font-bold drop-shadow-md" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    <span className="text-[#2c3e50]">{activeProduct?.line2Prefix} </span>
                    <span style={{ color: activeProduct?.highlightColor }}>
                        {activeProduct?.highlight}
                    </span>
                </h1>
            </div>

            {/* 🍯 JAR IS VISIBLE BY DEFAULT - No weight selector */}
            {activeProduct?.nameEn !== 'Lemon Honey' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto">
                    <h2 className="text-4xl md:text-6xl font-serif text-[#D4A574]/30 tracking-widest uppercase mb-4 animate-pulse">
                        Coming Soon
                    </h2>
                    <p className="text-sm md:text-base text-[#2c3e50]/60 tracking-[0.4em]">
                        PREPARING THE HIVE
                    </p>
                </div>
            )}
        </div>
    );
}
