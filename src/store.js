import { create } from 'zustand';

export const useStore = create((set) => ({
    currentScene: 'loading', 
    selectedHoneyType: null, 
    selectedWeight: null, // null أو '50g', '100g', etc.

    // تقدم السكرول (0 إلى 1)
    scrollProgress: 0,

    // موقع الكاميرا
    cameraPosition: [0, 5, 50],
    cameraTarget: [0, 0, 0],

    // حالة الانتقال
    isTransitioning: false,

    // Carousel state
    currentCellIndex: 0, // الخلية النشطة (0-5)

    // Actions
    setScene: (scene) => set({ currentScene: scene }),

    setSelectedHoneyType: (type) => set({
        selectedHoneyType: type,
        selectedWeight: null, // reset weight عند تغيير النوع
    }),

    setSelectedWeight: (weight) => set({ selectedWeight: weight }),

    setScrollProgress: (progress) => set({ scrollProgress: progress }),

    setCameraPosition: (position) => set({ cameraPosition: position }),

    setCameraTarget: (target) => set({ cameraTarget: target }),

    setIsTransitioning: (value) => set({ isTransitioning: value }),

    setCurrentCellIndex: (index) => set({ currentCellIndex: index }),

    // Reset للرجوع للحلقة
    resetSelection: () => set({
        selectedHoneyType: null,
        selectedWeight: null,
        currentScene: 'ring',
    }),
}));
