"use client";

import React, { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';

export default function Axis({ position, color, label, onClick, isNegative = false }) {
  const [hovered, setHover] = useState(false);
  
  const { scale, opacity } = useSpring({
    scale: hovered ? 1.2 : 1,
    opacity: hovered ? 1 : (isNegative ? 0.7 : 0.9),
    config: { tension: 300, friction: 15 }
  });

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <animated.mesh
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
        scale={scale}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <animated.meshBasicMaterial color={color} transparent opacity={opacity} depthTest={false} />
      </animated.mesh>
    </group>
  );
}
