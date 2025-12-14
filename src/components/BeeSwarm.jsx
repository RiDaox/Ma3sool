import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Bee from './models/Bee';

function FlyingBee({ initialPos, speed, radius, offset, height }) {
    const group = useRef();

    useFrame((state) => {
        if (!group.current) return;

        const t = state.clock.getElapsedTime() * speed + offset;

        // Circular orbit with some vertical wave
        const x = Math.sin(t) * radius;
        const z = Math.cos(t) * radius;
        const y = Math.sin(t * 2) * 0.5 + height;

        // Look ahead
        const nextX = Math.sin(t + 0.1) * radius;
        const nextZ = Math.cos(t + 0.1) * radius;
        const nextY = Math.sin((t + 0.1) * 2) * 0.5 + height;

        group.current.position.set(x, y, z);
        group.current.lookAt(nextX, nextY, nextZ);
    });

    return <Bee ref={group} scale={0.4} />;
}

export default function BeeSwarm({ count = 10, radius = 5 }) {
    const bees = useMemo(() => {
        return new Array(count).fill(0).map((_, i) => ({
            speed: 0.2 + Math.random() * 0.3,
            offset: (i / count) * Math.PI * 2, // Distribute evenly
            radius: radius + (Math.random() - 0.5) * 2, // Vary radius slightly
            height: (Math.random() - 0.5) * 3 // Vary height
        }));
    }, [count, radius]);

    return (
        <group>
            {bees.map((bee, i) => (
                <FlyingBee
                    key={i}
                    speed={bee.speed}
                    radius={bee.radius}
                    offset={bee.offset}
                    height={bee.height}
                />
            ))}
        </group>
    );
}
