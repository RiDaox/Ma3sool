import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useStore } from '../store';
import HoneycombBackground from '../components/HoneycombBackground';
import HoneyJar from '../components/models/HoneyJar';
import WeightSelector from '../components/WeightSelector';
import { Suspense, useRef, useEffect } from 'react';
import { honeyTypes } from '../data/honeyTypes';

// Component to handle manual rotation with drag and smooth momentum
function RotatableJar({ honeyJarRef }) {
    const { gl } = useThree();
    const isDragging = useRef(false);
    const previousMouseX = useRef(0);
    const previousMouseY = useRef(0);
    const velocityX = useRef(0); // For horizontal momentum
    const velocityY = useRef(0); // For vertical momentum
    const targetRotationY = useRef(0); // Horizontal rotation
    const targetRotationX = useRef(0); // Vertical rotation

    useEffect(() => {
        const handleMouseDown = (e) => {
            isDragging.current = true;
            previousMouseX.current = e.clientX;
            previousMouseY.current = e.clientY;
            velocityX.current = 0;
            velocityY.current = 0;
        };

        const handleMouseMove = (e) => {
            if (isDragging.current && honeyJarRef.current) {
                const deltaX = e.clientX - previousMouseX.current;
                const deltaY = e.clientY - previousMouseY.current;

                velocityX.current = deltaX * 0.01; // Horizontal velocity
                velocityY.current = deltaY * 0.01; // Vertical velocity

                targetRotationY.current += velocityX.current; // Y-axis (left/right)
                targetRotationX.current -= velocityY.current; // X-axis (up/down) - negative for natural feel

                previousMouseX.current = e.clientX;
                previousMouseY.current = e.clientY;
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const canvas = gl.domElement;
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // Animation loop for smooth rotation with momentum
        let animationId;
        const animate = () => {
            if (honeyJarRef.current) {
                // Apply momentum decay when not dragging
                if (!isDragging.current) {
                    velocityX.current *= 0.95; // Smooth deceleration
                    velocityY.current *= 0.95;
                    targetRotationY.current += velocityX.current;
                    targetRotationX.current += velocityY.current;
                }

                // Smooth lerp to target rotation
                const currentRotationY = honeyJarRef.current.rotation.y;
                const currentRotationX = honeyJarRef.current.rotation.x;

                honeyJarRef.current.rotation.y += (targetRotationY.current - currentRotationY) * 0.1;
                honeyJarRef.current.rotation.x += (targetRotationX.current - currentRotationX) * 0.1;
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(animationId);
        };
    }, [gl, honeyJarRef]);

    return null;
}

export default function InsideCellScene() {
    const selectedHoneyType = useStore((state) => state.selectedHoneyType);
    const selectedWeight = useStore((state) => state.selectedWeight);
    const setScene = useStore((state) => state.setScene);
    const setIsTransitioning = useStore((state) => state.setIsTransitioning);
    const resetSelection = useStore((state) => state.resetSelection);
    const honeyJarRef = useRef();

    const honey = honeyTypes.find(h => h.id === selectedHoneyType) || honeyTypes[0];
    const showJar = selectedWeight !== null;

    const handleBack = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            resetSelection();
            setIsTransitioning(false);
        }, 1000);
    };

    return (
        <div className="w-full h-full relative">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="absolute top-8 left-8 z-50 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/40 text-amber-900 font-bold hover:bg-white/30 transition-all hover:scale-105"
            >
                ← BACK
            </button>

            {/* Info Panel */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-center">
                <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-white/40 shadow-lg">
                    <h1 className="text-3xl font-bold text-amber-900">{honey?.name}</h1>
                    <p className="text-amber-800 mt-2 font-medium">{honey?.description}</p>
                </div>
            </div>

            {/* Weight Selector */}
            {!showJar && <WeightSelector />}

            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                {/* Lighting */}
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#FCD34D" />
                <Environment preset="city" />

                {/* Background - STATIC (close to jar, part of scene) */}
                <HoneycombBackground />

                {/* 3D Model - Manually rotatable via drag */}
                {showJar && (
                    <Suspense fallback={null}>
                        <group ref={honeyJarRef}>
                            <HoneyJar position={[0, 0.7, 0]} scale={0.5} />
                        </group>
                    </Suspense>
                )}

                {/* Manual rotation handler (drag to rotate) */}
                {showJar && <RotatableJar honeyJarRef={honeyJarRef} />}

                {/* Fog */}
                <fog attach="fog" args={['#FEF3C7', 10, 40]} />
            </Canvas>
        </div>
    );
}
