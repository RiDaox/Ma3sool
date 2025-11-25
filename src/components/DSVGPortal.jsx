import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function DSVGPortal({ onEnter }) {
  const groupRef = useRef();
  const { camera } = useThree();

  // SVG path لحرف D من اللوغو (مستخرج يدويًا)
  const dPath = "M 20 25 Q 20 20, 25 20 Q 35 20, 35 30 Q 35 50, 35 70 Q 35 80, 25 80 Q 20 80, 20 75 L 20 25 L 30 25 Q 38 25, 38 35 Q 38 65, 38 65 Q 38 75, 30 75 L 20 75";

  useEffect(() => {
    const shape = new THREE.Shape();
    const points = dPath.split(/(?=[MLCQ])/).map(cmd => {
      const [letter, ...coords] = cmd.trim().split(/\s+/);
      return { letter, coords: coords.map(Number) };
    });

    points.forEach(({ letter, coords }) => {
      if (letter === 'M') shape.moveTo(coords[0] - 50, coords[1] - 50);
      if (letter === 'L') shape.lineTo(coords[0] - 50, coords[1] - 50);
      if (letter === 'Q') shape.quadraticCurveTo(coords[0] - 50, coords[1] - 50, coords[2] - 50, coords[3] - 50);
    });

    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshStandardMaterial({ color: "#f59e0b", emissive: "#f59e0b", emissiveIntensity: 0.8 });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.1, 0.1, 0.1);
    groupRef.current.add(mesh);

    return () => groupRef.current.remove(mesh);
  }, []);

  const enterD = () => {
    gsap.to(camera.position, {
      x: 0, y: 0, z: 3, duration: 1.5, ease: "power2.in"
    });
    gsap.to(camera.position, {
      z: -3, duration: 2, delay: 1.5, ease: "power3.inOut",
      onComplete: onEnter
    });
  };

  return <group ref={groupRef} onClick={enterD} />;
}