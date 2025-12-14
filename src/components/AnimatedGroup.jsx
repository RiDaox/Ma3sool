// src/components/AnimatedGroup.jsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const AnimatedGroup = forwardRef(function AnimatedGroup(
  { children, targetPosition = [0, 0, 0], targetRotation = [0, 0, 0] },
  ref
) {
  const innerRef = useRef();

  useImperativeHandle(ref, () => innerRef.current);

  useFrame((state) => {
    if (!innerRef.current) return;

    const [tx, ty, tz] = targetPosition;
    const [rx, ry, rz] = targetRotation;

    // Lerp position
    const targetPos = new THREE.Vector3(tx, ty, tz);

    // Add floating effect
    const time = state.clock.getElapsedTime();
    const floatY = Math.sin(time * 2 + innerRef.current.position.x) * 0.05;
    targetPos.y += floatY;

    // Check for large jumps (wrap-around)
    const dist = innerRef.current.position.distanceTo(targetPos);

    // If distance is huge (e.g. wrapping from one side to another), SNAP immediately
    // Threshold: 10 units is generous enough for normal moves, but smaller than a wrap
    if (dist > 10) {
      innerRef.current.position.copy(targetPos);
      innerRef.current.rotation.set(rx, ry, rz);
    } else if (dist > 0.001) {
      innerRef.current.position.lerp(targetPos, 0.2);
    }

    // "Lerp" rotation
    // Helper for rotation lerp
    const lerpRot = (current, target, factor) => current + (target - current) * factor;

    // Add slight rotation wobble
    const wobbleX = Math.sin(time * 1.5) * 0.02;
    const wobbleZ = Math.cos(time * 1.3) * 0.02;

    const targetRx = rx + wobbleX;
    const targetRz = rz + wobbleZ;

    if (Math.abs(targetRx - innerRef.current.rotation.x) > 0.001) innerRef.current.rotation.x = lerpRot(innerRef.current.rotation.x, targetRx, 0.2);
    if (Math.abs(ry - innerRef.current.rotation.y) > 0.001) innerRef.current.rotation.y = lerpRot(innerRef.current.rotation.y, ry, 0.2);
    if (Math.abs(targetRz - innerRef.current.rotation.z) > 0.001) innerRef.current.rotation.z = lerpRot(innerRef.current.rotation.z, targetRz, 0.2);
  });

  return <group ref={innerRef}>{children}</group>;
});

export default AnimatedGroup;
