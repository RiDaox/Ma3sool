import { useState } from 'react';
import HexCell from './HexCell';
import { honeyTypes } from '../data/honeyTypes';
import { useStore } from '../store';

export default function HexRing() {
    const setSelectedHoneyType = useStore((state) => state.setSelectedHoneyType);
    const setScene = useStore((state) => state.setScene);
    const setIsTransitioning = useStore((state) => state.setIsTransitioning);

    const handleCellClick = (honeyType) => {
        console.log('Clicked:', honeyType.name);
        setIsTransitioning(true);
        setSelectedHoneyType(honeyType.id);

        // بعد شوية نبدلو المشهد
        setTimeout(() => {
            setScene('inside');
            setIsTransitioning(false);
        }, 2000); // 2 seconds للـ transition
    };

    // ترتيب الخلايا في دائرة
    const radius = 8;
    const cells = honeyTypes.map((honeyType, index) => {
        const angle = (index * Math.PI * 2) / honeyTypes.length;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
            <HexCell
                key={honeyType.id}
                position={[x, 0, z]}
                honeyType={honeyType}
                index={index}
                onClick={() => handleCellClick(honeyType)}
            />
        );
    });

    return (
        <group>
            {cells}

            {/* إضاءة مركزية */}
            <pointLight position={[0, 5, 0]} intensity={2} color="#FCD34D" />
            <pointLight position={[0, -2, 0]} intensity={1} color="#F59E0B" />
        </group>
    );
}
