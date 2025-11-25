import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import * as THREE from 'three';
import gsap from 'gsap';

export default function CameraRig() {
    const { camera } = useThree();
    const scrollProgress = useStore((state) => state.scrollProgress);
    const currentScene = useStore((state) => state.currentScene);
    const isTransitioning = useStore((state) => state.isTransitioning);

    const targetPosition = useRef(new THREE.Vector3());
    const targetLookAt = useRef(new THREE.Vector3());

    useEffect(() => {
        // Setup initial camera - viewing ring from front
        camera.position.set(0, 3, 18);
        camera.lookAt(0, 0, 0);
        targetPosition.current.set(0, 3, 18);
        targetLookAt.current.set(0, 0, 0);
    }, [camera]);

    useFrame(() => {
        // If transitioning, we let GSAP handle the camera via the useEffect below
        // We only update manually if NOT transitioning
        if (isTransitioning) return;

        let newPos = new THREE.Vector3();
        let newLookAt = new THREE.Vector3(0, 0, 0);

        if (currentScene === 'ring') {
            // Circular carousel - zoom based on scroll
            const baseZ = THREE.MathUtils.lerp(22, 14, scrollProgress);
            const baseY = THREE.MathUtils.lerp(4, 2, scrollProgress);

            newPos.set(0, baseY, baseZ);
            newLookAt.set(0, 0, 0);
        } else if (currentScene === 'inside') {
            // داخل الخلية
            newPos.set(0, 0, 8);
            newLookAt.set(0, 0, 0);
        }

        // Smooth lerp
        targetPosition.current.lerp(newPos, 0.1);
        targetLookAt.current.lerp(newLookAt, 0.1);

        camera.position.copy(targetPosition.current);
        camera.lookAt(targetLookAt.current);
    });

    // Handle Transition Animation (The Dive)
    useEffect(() => {
        if (isTransitioning && currentScene === 'ring') {
            // DIVE IN!
            // Target is roughly where the front cell is (0, 0, 8)
            // We want to go THROUGH it, so maybe to (0, 0, 0) or even negative Z

            const tl = gsap.timeline();

            // 1. Anticipation (pull back slightly)
            tl.to(camera.position, {
                z: '+=2',
                duration: 0.4,
                ease: 'power2.out'
            })
                // 2. The Dive (Zoom in fast)
                .to(camera.position, {
                    x: 0,
                    y: 0,
                    z: 4, // Stop just in front/inside
                    duration: 1.2,
                    ease: 'power4.in',
                }, '-=0.2'); // Overlap slightly

        }
    }, [isTransitioning, currentScene, camera]);

    return null;
}
