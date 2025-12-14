import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SmartCell({
  children,
  distance,
  isActive,
  direction,
  onClick,
}) {
  const groupRef = useRef();
  const tlRef = useRef(); // Store timeline reference

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Create a GSAP context for easy cleanup
    const ctx = gsap.context(() => {
      // 🟡 1) BASE SCALE & OPACITY (Distance based)
      // We use overwrite: 'auto' to ensure new tweens kill old ones on the same properties
      const baseScale =
        distance === 0 ? 1.0 :
          Math.abs(distance) === 1 ? 0.8 :
            0.6;

      const targetOpacity =
        distance === 0 ? 1.0 :
          Math.abs(distance) === 1 ? 0.35 :
            0.0;

      // Animate Scale
      gsap.to(group.scale, {
        x: baseScale,
        y: baseScale,
        z: baseScale,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto"
      });

      // Animate Opacity & Color
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.depthWrite = true;

          gsap.to(child.material, {
            opacity: targetOpacity,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });

          // Tint
          const targetColor = distance === 0 ? { r: 1, g: 1, b: 1 } : { r: 0.35, g: 0.35, b: 0.35 };
          gsap.to(child.material.color, {
            ...targetColor,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });

      // 🌀 2) ACTIVE TRANSITION (The "Pop" Effect)
      // Only run this if we are entering/leaving active state specifically
      // We use a separate timeline for this complex sequence

      if (isActive) {
        // Kill any previous transition timeline
        if (tlRef.current) tlRef.current.kill();

        const dir = direction || 1;

        // Create new timeline
        const tl = gsap.timeline();
        tlRef.current = tl;

        // ENTRY ANIMATION
        // Immediate set for the "pop" start position
        // We only want to "pop" if we just arrived. 
        // Since this effect runs on every distance change, we need to be careful.
        // Actually, for the "pop" effect, we should only trigger it when distance becomes 0.

        // However, to keep it simple and robust:
        // We just animate to the "active" state.

        tl.to(group.position, {
          z: 0,
          x: 0, // Center it
          duration: 0.6,
          ease: "back.out(1.2)", // Bouncy entry
          overwrite: "auto"
        }, 0);

        tl.to(group.rotation, {
          y: 0, // Face front
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto"
        }, 0);

      } else {
        // EXIT ANIMATION
        // When leaving active state
        // We don't need a complex timeline here, the distance-based logic above handles most of it.
        // But if we want a specific "exit" motion (like tilting away):

        // The distance-based logic handles scale/opacity.
        // We just ensure position/rotation settle back to neutral relative to the group.

        gsap.to(group.position, {
          z: 0,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto"
        });
      }

    }, groupRef); // Scope to groupRef

    return () => ctx.revert(); // Cleanup on unmount or dependency change
  }, [distance, isActive, direction]);

  return <group ref={groupRef} onClick={onClick}>{children}</group>;
}
