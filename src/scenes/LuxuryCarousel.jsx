import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import LemonCell from '../components/models/LemonCell';
import CarobCell from '../components/models/CarobCell';
import LuxuryLighting from '../components/LuxuryLighting';
import ReflectiveFloor from '../components/ReflectiveFloor';
import gsap from 'gsap';
import * as THREE from 'three';

// Camera controller for smooth transitions
function CameraController({ activeIndex, cellPositions }) {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3());
    const targetLookAt = useRef(new THREE.Vector3());

    useEffect(() => {
        if (cellPositions[activeIndex]) {
            const cellPos = cellPositions[activeIndex];

            // Camera position - arc around the cell
            targetPos.current.set(
                cellPos[0] + 8,
                cellPos[1] + 4,
                cellPos[2] + 8
            );

            // Look at the cell
            targetLookAt.current.set(cellPos[0], cellPos[1], cellPos[2]);

            // Smooth GSAP animation
            gsap.to(camera.position, {
                x: targetPos.current.x,
                y: targetPos.current.y,
                z: targetPos.current.z,
                duration: 1.2,
                ease: 'power2.inOut'
            });
        }
    }, [activeIndex, cellPositions, camera]);

    useFrame(() => {
        camera.lookAt(targetLookAt.current);
    });

    return null;
}

export default function LuxuryCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Cell models data
    const cells = [
        {
            Component: LemonCell,
            position: [-6, 0, 0],
            name: 'عسل الليمون',
            nameEn: 'Lemon Honey'
        },
        {
            Component: CarobCell,
            position: [6, 0, 0],
            name: 'عسل الخروب',
            nameEn: 'Carob Honey'
        }
    ];

    const cellPositions = cells.map(c => c.position);

    // Auto-rotate through cells
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % cells.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [cells.length]);

    return (
        <div className="w-full h-screen relative bg-black">
            {/* Title overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
                        {cells[activeIndex].name}
                    </h1>
                    <p className="text-xl text-gray-300 font-light tracking-widest">
                        {cells[activeIndex].nameEn}
                    </p>
                </div>
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
                {cells.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                ? 'bg-white w-8'
                                : 'bg-gray-500 hover:bg-gray-300'
                            }`}
                    />
                ))}
            </div>

            <Canvas
                camera={{ position: [8, 4, 8], fov: 45 }}
                shadows
                gl={{ antialias: true, alpha: false }}
            >
                {/* Camera animation */}
                <CameraController activeIndex={activeIndex} cellPositions={cellPositions} />

                {/* Luxury Lighting System */}
                <LuxuryLighting activeIndex={activeIndex} />

                {/* Studio Environment */}
                <Environment preset="studio" />
                <color attach="background" args={['#0a0a0a']} />

                {/* Reflective Floor */}
                <ReflectiveFloor />

                {/* Cell Models */}
                <Suspense fallback={null}>
                    {cells.map((cell, index) => {
                        const Cell = cell.Component;
                        const isActive = index === activeIndex;

                        return (
                            <group
                                key={index}
                                position={cell.position}
                                onClick={() => setActiveIndex(index)}
                            >
                                <Cell
                                    scale={isActive ? 1.8 : 1.5}
                                    position={[0, 0, 0]}
                                />

                                {/* Subtle glow for inactive cells */}
                                {!isActive && (
                                    <pointLight
                                        position={[0, 2, 0]}
                                        intensity={0.5}
                                        color="#FFD700"
                                        distance={5}
                                    />
                                )}
                            </group>
                        );
                    })}
                </Suspense>

                {/* Fog for depth */}
                <fog attach="fog" args={['#0a0a0a', 10, 30]} />
            </Canvas>
        </div>
    );
}
