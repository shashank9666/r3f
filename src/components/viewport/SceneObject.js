"use client";

import React, { useRef, useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

export default function SceneObject({ id }) {
  const meshRef = useRef();
  const objData = useStore(state => state.objects.find(o => o.id === id));
  const isSelected = useStore(state => state.selectedIds.includes(id));
  const isActive = useStore(state => state.activeId === id);

  if (!objData) return null;

  // We only support 'cube' type for now as a placeholder
  let geometry;
  if (objData.type === 'cube') {
    geometry = <boxGeometry args={[2, 2, 2]} />;
  } else {
    geometry = <boxGeometry args={[1, 1, 1]} />;
  }

  // Blender highlights: active object is light orange (#ff9900), selected is dark orange (#cc4400)
  const outlineColor = isActive ? "#ff9900" : "#cc4400";

  return (
    <mesh
      ref={meshRef}
      position={objData.position}
      rotation={objData.rotation}
      scale={objData.scale}
      userData={{ id }}
    >
      {geometry}
      <meshStandardMaterial 
        color={objData.color || '#8c8c8c'} 
        roughness={0.7} 
      />
      
      {/* Selection Outline */}
      {isSelected && (
        <Edges
          linewidth={2}
          threshold={15} // Display edges only when angle exceeds 15 deg
          color={outlineColor}
        />
      )}
    </mesh>
  );
}
