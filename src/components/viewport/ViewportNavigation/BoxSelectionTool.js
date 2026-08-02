"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../../store/useStore';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export default function BoxSelectionTool() {
  const { gl, camera, scene } = useThree();
  const activeTool = useStore(state => state.activeTool);
  const setSelectedIds = useStore(state => state.setSelectedIds);
  const selectedIds = useStore(state => state.selectedIds);
  const objects = useStore(state => state.objects);
  
  const [box, setBox] = useState(null); // { x, y, w, h } in pixels
  const startPos = useRef(null);
  
  useEffect(() => {
    if (activeTool !== 'box-select') {
      setBox(null);
      return;
    }
    
    const container = gl.domElement.parentElement;
    if (!container) return;
    
    const getPointer = (e) => {
      const rect = container.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        clientX: e.clientX,
        clientY: e.clientY
      };
    };

    const handlePointerDown = (e) => {
      if (e.button !== 0) return; // Only left click
      const pos = getPointer(e);
      startPos.current = pos;
      setBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
    };

    const handlePointerMove = (e) => {
      if (!startPos.current) return;
      const pos = getPointer(e);
      
      const x = Math.min(startPos.current.x, pos.x);
      const y = Math.min(startPos.current.y, pos.y);
      const w = Math.abs(pos.x - startPos.current.x);
      const h = Math.abs(pos.y - startPos.current.y);
      
      setBox({ x, y, w, h });
    };

    const handlePointerUp = (e) => {
      if (!startPos.current || !box) return;
      
      const rect = container.getBoundingClientRect();
      
      // Calculate Normalized Device Coordinates (NDC) for the box boundaries
      const minX = (box.x / rect.width) * 2 - 1;
      const maxY = -(box.y / rect.height) * 2 + 1;
      const maxX = ((box.x + box.w) / rect.width) * 2 - 1;
      const minY = -((box.y + box.h) / rect.height) * 2 + 1;
      
      const newSelection = [];
      
      // We do a simple center-point projection for selection 
      // (a robust implementation would check mesh bounding boxes against a frustum)
      objects.forEach(obj => {
        if (obj.selectable === false || obj.visible === false) return;
        
        // Find the mesh in the scene
        let meshPos = new THREE.Vector3(...obj.position);
        
        // Project to NDC
        meshPos.project(camera);
        
        // Check if inside box
        if (meshPos.x >= minX && meshPos.x <= maxX && meshPos.y >= minY && meshPos.y <= Math.max(maxY, minY)) {
          newSelection.push(obj.id);
        }
      });
      
      if (e.shiftKey) {
        // Add to selection
        const combined = new Set([...selectedIds, ...newSelection]);
        setSelectedIds(Array.from(combined));
      } else {
        setSelectedIds(newSelection);
      }
      
      startPos.current = null;
      setBox(null);
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeTool, gl, camera, objects, selectedIds, setSelectedIds, box]);

  if (!box) return null;

  return (
    <Html fullscreen style={{ pointerEvents: 'none', zIndex: 9999 }}>
      <div
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          border: '1px dashed #ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}
      />
    </Html>
  );
}
