import * as THREE from 'three';

export default function ReflectiveFloor() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
            receiveShadow
        >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={1.5}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
