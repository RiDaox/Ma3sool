import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import HexCell from './HexCell';
import { honeyTypes } from '../data/honeyTypes';
import { useStore } from '../store';
import gsap from 'gsap';
import * as THREE from 'three';
import { LemonIcon, LeafIcon, FlowerIcon, OrangeIcon, CrownIcon, TreeIcon } from './HoneyIcons';

// Map honey type IDs to their icons
const iconMap = {
    lemon: LemonIcon,
    thyme: LeafIcon,
    eucalyptus: TreeIcon,
    wildflower: FlowerIcon,
    sidr: CrownIcon,
    orange: OrangeIcon,
};

export default function HexCarousel() {
    const groupRef = useRef();
    const currentCellIndex = useStore((state) => state.currentCellIndex);
    const setSelectedHoneyType = useStore((state) => state.setSelectedHoneyType);
    const setScene = useStore((state) => state.setScene);
    const setIsTransitioning = useStore((state) => state.setIsTransitioning);

    const targetRotation = useRef(0);
    const currentRotation = useRef(0);

    const handleCellClick = (honeyType) => {
        console.log('Clicked:', honeyType.name);
        setIsTransitioning(true);
        setSelectedHoneyType(honeyType.id);

        setTimeout(() => {
            setScene('inside');
            setIsTransitioning(false);
        }, 2000);
    };

    // Smooth rotation with GSAP when index changes
    useEffect(() => {
        const anglePerCell = (Math.PI * 2) / honeyTypes.length;
        const newRotation = -currentCellIndex * anglePerCell;

        targetRotation.current = newRotation;

        // GSAP animation - smooth luxury rotation
        gsap.to(currentRotation, {
            current: newRotation,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (groupRef.current) {
                    groupRef.current.rotation.y = currentRotation.current;
                }
            }
        });
    }, [currentCellIndex]);

    // Circular ring layout
    const radius = 8;
    const anglePerCell = (Math.PI * 2) / honeyTypes.length;

    const cells = honeyTypes.map((honeyType, index) => {
        const angle = index * anglePerCell;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        // Calculate which cell is at front (facing camera)
        const rotationOffset = currentRotation.current || 0;
        const cellAngle = angle + rotationOffset;
        const normalizedAngle = ((cellAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        // Front is at angle 0, back is at PI
        const distanceFromFront = Math.abs(normalizedAngle - Math.PI);
        const isFront = distanceFromFront > Math.PI * 0.7;

        // Get the icon component for this honey type
        const IconComponent = iconMap[honeyType.id] || LemonIcon;

        return (
            <group key={honeyType.id} position={[x, 0, z]}>
                <HexCell
                    position={[0, 0, 0]}
                    honeyType={honeyType}
                    index={index}
                    isActive={index === currentCellIndex}
                    distanceFromActive={Math.abs(index - currentCellIndex)}
                    onClick={() => handleCellClick(honeyType)}
                    opacity={1}
                    isFront={isFront}
                />
            </group>
        );
    });

    // Floating animation
    useFrame((state) => {
        if (groupRef.current) {
            const floatY = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            groupRef.current.position.y = floatY;
        }
    });

    return (
        <group ref={groupRef}>
            {cells}

            {/* Central light */}
            <pointLight position={[0, 5, 0]} intensity={3} color="#FCD34D" />
            <pointLight position={[0, -2, 0]} intensity={1.5} color="#F59E0B" />

            {/* Rotating spotlight */}
            <spotLight
                position={[0, 10, 12]}
                angle={0.4}
                penumbra={0.5}
                intensity={6}
                color="#FFFFFF"
                castShadow
            />

            {/* Rim lights */}
            <pointLight position={[-10, 3, 0]} intensity={2} color="#F59E0B" />
            <pointLight position={[10, 3, 0]} intensity={2} color="#FCD34D" />
        </group>
    );
}
