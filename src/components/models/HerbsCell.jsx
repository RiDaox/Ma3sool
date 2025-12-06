import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'

export default function HerbsCell(props) {
    const group = useRef()
    const { scene } = useGLTF('/models/herbs_cell.glb')

    // GSAP entrance animation
    useEffect(() => {
        if (group.current) {
            gsap.set(group.current.scale, { x: 0, y: 0, z: 0 });
            // Initial position handled by parent, but we can animate entrance if needed
            // For now, we rely on the parent's passed props for final state, 
            // but we can add the pop-in effect here if it's not conflicting.
            // The LemonCell had it, so we keep it for consistency.

            // Note: The parent (SmoothCarousel) manages position/scale via AnimatedGroup/SmartCell.
            // The internal animation here might conflict if not careful. 
            // However, LemonCell has it, so I will include it but ensure it respects props.

            gsap.fromTo(group.current.scale,
                { x: 0, y: 0, z: 0 },
                {
                    x: props.scale?.x || props.scale || 1,
                    y: props.scale?.y || props.scale || 1,
                    z: props.scale?.z || props.scale || 1,
                    duration: 1.5,
                    ease: 'elastic.out(1, 0.5)',
                    delay: 0.3,
                    overwrite: 'auto' // Prevent conflicts
                }
            );
        }
    }, []); // Run once on mount

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload('/models/herbs_cell.glb')
