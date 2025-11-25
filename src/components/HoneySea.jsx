import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for Honey Wave effect
const HoneyMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#d97706') }, // Dark Amber
        uDeepColor: { value: new THREE.Color('#78350f') }, // Deep Brown
    },
    vertexShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Gentle, slow waves (Honey is viscous)
      float elevation = sin(pos.x * 1.5 + uTime * 0.5) * 0.2;
      elevation += sin(pos.y * 1.0 + uTime * 0.3) * 0.2;
      
      pos.z += elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColor;
    uniform vec3 uDeepColor;

    void main() {
      // Mix colors based on elevation for depth effect
      float mixStrength = (vElevation + 0.25) * 2.0;
      vec3 color = mix(uDeepColor, uColor, mixStrength);
      
      // Add specular shine (fake lighting)
      float shine = step(0.9, sin(vUv.x * 20.0 + vElevation * 5.0));
      
      gl_FragColor = vec4(color, 0.9); // Slight transparency
    }
  `,
};

export default function HoneySea() {
    const meshRef = useRef();

    // Create shader material
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#F59E0B') }, // Amber 500
                uDeepColor: { value: new THREE.Color('#92400E') }, // Amber 800
            },
            vertexShader: HoneyMaterial.vertexShader,
            fragmentShader: HoneyMaterial.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]} // Positioned below the carousel
        >
            <planeGeometry args={[50, 50, 64, 64]} />
            {/* We use primitive to attach the shader material properly */}
            <primitive object={material} attach="material" />
        </mesh>
    );
}
