import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import HexCarousel from '../components/HexCarousel';
import HoneycombBackground from '../components/HoneycombBackground';
import CameraRig from '../components/CameraRig';
import CarouselArrows from '../components/CarouselArrows';
import HoneySea from '../components/HoneySea';
import HoneyBubbles from '../components/HoneyBubbles';
import MouseParticles from '../components/MouseParticles';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useStore } from '../store';

export default function RingScene() {
    useScrollProgress();
    const scrollProgress = useStore((state) => state.scrollProgress);

    return (
        <>
            {/* Carousel Navigation Arrows */}
            <CarouselArrows />

            {/* Scroll progress bar */}
            <div className="fixed top-4 right-4 z-10">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border-2 border-white/40">
                    <p className="text-amber-900 text-sm font-bold mb-1">Zoom: {Math.round(scrollProgress * 100)}%</p>
                    <div className="w-32 h-2 bg-amber-900/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
                            style={{ width: `${scrollProgress * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <Canvas camera={{ position: [0, 3, 18], fov: 50 }}>
                <CameraRig />

                {/* الإضاءة */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <Environment preset="sunset" />

                {/* خلفية honeycomb */}
                <HoneycombBackground />

                {/* بحر العسل والفقاعات */}
                <HoneySea />
                <HoneyBubbles count={50} />

                {/* Mouse Trail Effect */}
                <MouseParticles count={150} />

                {/* Circular Carousel */}
                <HexCarousel />

                {/* Fog للعمق */}
                <fog attach="fog" args={['#FEF3C7', 18, 50]} />
            </Canvas>
        </>
    );
}
