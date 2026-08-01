/* eslint-disable react-hooks/immutability */
"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Hud, PerspectiveCamera, OrthographicCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import Axis from './Axis';
import { useStore } from '../../../store/useStore';

// Constants for axis positions and colors
const AXES = [
  { axis: 'x', label: 'X', direction: [1, 0, 0], color: '#ff4444', isNegative: false },
  { axis: '-x', label: '', direction: [-1, 0, 0], color: '#990000', isNegative: true },
  { axis: 'y', label: 'Y', direction: [0, 1, 0], color: '#88ff44', isNegative: false },
  { axis: '-y', label: '', direction: [0, -1, 0], color: '#448800', isNegative: true },
  { axis: 'z', label: 'Z', direction: [0, 0, 1], color: '#4488ff', isNegative: false },
  { axis: '-z', label: '', direction: [0, 0, -1], color: '#002299', isNegative: true },
];

function GizmoAxisNode({ axis, onAxisClick }) {
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0, 0, 
      axis.direction[0] * 0.8, axis.direction[1] * 0.8, axis.direction[2] * 0.8
    ], 3));
    return geom;
  }, [axis.direction]);

  return (
    <group>
      {/* Connecting line */}
      <line>
        <bufferGeometry attach="geometry" {...geometry} />
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
  );
}

function GizmoContent({ onAxisClick }) {
  const { camera, gl } = useThree();
  const gizmoRef = useRef();
  
  // Drag state
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (gizmoRef.current) {
      gizmoRef.current.quaternion.copy(camera.quaternion).invert();
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
    gl.domElement.style.cursor = 'grabbing';
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;
    previousMouse.current = { x: e.clientX, y: e.clientY };

    // Orbit the main camera
    // Convert current camera position to spherical coordinates
    const distance = camera.position.length();
    const spherical = new THREE.Spherical().setFromVector3(camera.position);

    // Apply delta (adjust sensitivity as needed)
    spherical.theta -= deltaX * 0.01;
    spherical.phi -= deltaY * 0.01;

    // Clamp phi to avoid flipping
    spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, spherical.phi));

    // Convert back to vector and update camera
    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, 0); // Assuming origin target for now
  };

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      gl.domElement.style.cursor = 'default';
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <group>
      {/* Semi-transparent background circle that also acts as hit area */}
      {/* This sits outside gizmoRef so it doesn't rotate, ensuring a perfect 2D circle background */}
      <mesh 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
      >
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} depthTest={false} />
      </mesh>

      <group ref={gizmoRef}>
        {/* Center dot */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} depthTest={false} />
        </mesh>

        {AXES.map((axis, i) => (
          <GizmoAxisNode key={i} axis={axis} onAxisClick={onAxisClick} />
        ))}
      </group>
    </group>
  );
}

function GizmoContainer() {
  const { size, camera: hudCamera } = useThree();
  const targetQuaternion = useRef(new THREE.Quaternion());
  const targetPosition = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);

  // We need the main camera for animating
  const mainCamera = useStore(state => state.camera);

  const handleAxisClick = (direction) => {
    if (!mainCamera) return;
    const distance = mainCamera.position.length();
    
    targetPosition.current.set(
      direction[0] * distance,
      direction[1] * distance,
      direction[2] * distance
    );
    
    const dummyCamera = mainCamera.clone();
    dummyCamera.position.copy(targetPosition.current);
    if (Math.abs(direction[1]) > 0.9) {
      dummyCamera.up.set(0, 0, -Math.sign(direction[1]));
    } else {
      dummyCamera.up.set(0, 1, 0);
    }
    dummyCamera.lookAt(0, 0, 0);
    targetQuaternion.current.copy(dummyCamera.quaternion);
    
    isAnimating.current = true;
  };

  useFrame((state, delta) => {
    if (isAnimating.current && mainCamera) {
      mainCamera.quaternion.slerp(targetQuaternion.current, 10 * delta);
      mainCamera.position.lerp(targetPosition.current, 10 * delta);
      
      if (mainCamera.quaternion.angleTo(targetQuaternion.current) < 0.01 && 
          mainCamera.position.distanceTo(targetPosition.current) < 0.05) {
        mainCamera.quaternion.copy(targetQuaternion.current);
        mainCamera.position.copy(targetPosition.current);
        isAnimating.current = false;
      }
    }
  });

  // Zoom is 40. Top right corner:
  const cx = size.width / 80 - 1.5;
  const cy = size.height / 80 - 2; // Offset for top menu

  return (
    <group position={[cx, cy, 0]}>
      <ambientLight intensity={1} />
      <GizmoContent onAxisClick={handleAxisClick} />
    </group>
  );
}

export default function NavigationGizmo() {
  return (
    <Hud renderPriority={1}>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={40} />
      <GizmoContainer />
    </Hud>
  );
}
