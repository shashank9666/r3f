"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Hud, PerspectiveCamera, OrthographicCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import Axis from './Axis';

// Constants for axis positions and colors
const AXES = [
  { axis: 'x', label: 'X', direction: [1, 0, 0], color: '#ff4444', isNegative: false },
  { axis: '-x', label: '', direction: [-1, 0, 0], color: '#990000', isNegative: true },
  { axis: 'y', label: 'Y', direction: [0, 1, 0], color: '#88ff44', isNegative: false },
  { axis: '-y', label: '', direction: [0, -1, 0], color: '#448800', isNegative: true },
  { axis: 'z', label: 'Z', direction: [0, 0, 1], color: '#4488ff', isNegative: false },
  { axis: '-z', label: '', direction: [0, 0, -1], color: '#002299', isNegative: true },
];

function GizmoContent({ onAxisClick }) {
  const { camera } = useThree();
  const gizmoRef = useRef();

  useFrame(() => {
    if (gizmoRef.current) {
      // Synchronize gizmo rotation to the main camera's rotation
      // The gizmo container rotates inversely to the camera so that 
      // looking around makes the gizmo rotate correspondingly.
      gizmoRef.current.quaternion.copy(camera.quaternion).invert();
    }
  });

  return (
    <group ref={gizmoRef}>
      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} depthTest={false} />
      </mesh>

      {AXES.map((axis, i) => (
        <group key={i}>
          {/* Connecting line */}
          <line>
            <bufferGeometry attach="geometry" {...useMemo(() => {
              const geometry = new THREE.BufferGeometry();
              geometry.setAttribute('position', new THREE.Float32BufferAttribute([
                0, 0, 0, 
                axis.direction[0] * 0.8, axis.direction[1] * 0.8, axis.direction[2] * 0.8
              ], 3));
              return geometry;
            }, [axis.direction])} />
            <lineBasicMaterial attach="material" color={axis.color} depthTest={false} transparent opacity={axis.isNegative ? 0.3 : 0.8} />
          </line>
          
          <Axis 
            position={[axis.direction[0], axis.direction[1], axis.direction[2]]}
            color={axis.color}
            label={axis.label}
            isNegative={axis.isNegative}
            onClick={() => onAxisClick(axis.direction)}
          />
          
          {/* Label (only for positive axes) */}
          {!axis.isNegative && (
            <Text
              position={[axis.direction[0] * 1.3, axis.direction[1] * 1.3, axis.direction[2] * 1.3]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              depthTest={false}
            >
              {axis.label}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}

export default function NavigationGizmo() {
  const { camera } = useThree();
  const targetQuaternion = useRef(new THREE.Quaternion());
  const targetPosition = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);

  const handleAxisClick = (direction) => {
    // In a full implementation, this calculates the new camera position based on orbit target.
    // For now, we will simply log it or do a basic jump to demonstrate.
    console.log("Clicked axis direction:", direction);
  };

  useFrame((state, delta) => {
    if (isAnimating.current) {
      // Smoothly slerp camera rotation and lerp position
      camera.quaternion.slerp(targetQuaternion.current, 5 * delta);
      camera.position.lerp(targetPosition.current, 5 * delta);
      // If we are close enough, stop animating
      if (camera.quaternion.angleTo(targetQuaternion.current) < 0.01) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <Hud renderPriority={1}>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={40} />
      {/* Move it to top right. In ortho space, units are pixels/zoom. We will position it at top right corner */}
      <group position={[window.innerWidth / 80 - 1.5, window.innerHeight / 80 - 1.5, 0]}>
        <ambientLight intensity={1} />
        <GizmoContent onAxisClick={handleAxisClick} />
      </group>
    </Hud>
  );
}
