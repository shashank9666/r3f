"use client";

import React, { useRef } from 'react';
import { ZoomIn, Hand, Video, Grid3X3 } from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useStore } from '../../../store/useStore';
import * as THREE from 'three';

export default function NavigationToolbar() {
  const { viewMode, setViewMode, navigationMode, setNavigationMode, camera, controls } = useStore();
  
  // Drag states
  const isZooming = useRef(false);
  const isPanning = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    if (isZooming.current && camera) {
      const deltaY = e.clientY - previousMouse.current.y;
      // Dolly camera along its local Z axis
      camera.translateZ(deltaY * 0.05);
      if (controls) controls.update();
      previousMouse.current = { x: e.clientX, y: e.clientY };
    }
    
    if (isPanning.current && camera && controls) {
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      
      // Pan camera and target
      const offset = new THREE.Vector3();
      const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      
      offset.add(right.multiplyScalar(deltaX * 0.02));
      offset.add(up.multiplyScalar(deltaY * 0.02));
      
      camera.position.add(offset);
      controls.target.add(offset);
      controls.update();
      
      previousMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e) => {
    isZooming.current = false;
    isPanning.current = false;
    document.body.style.cursor = 'default';
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  const startDrag = (e, type) => {
    e.preventDefault();
    if (type === 'zoom') isZooming.current = true;
    if (type === 'pan') isPanning.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = type === 'zoom' ? 'ns-resize' : 'move';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleWalk = () => {
    setNavigationMode(navigationMode === 'fly' ? 'orbit' : 'fly');
  };

  const handleViewToggle = () => {
    setViewMode(viewMode === 'perspective' ? 'orthographic' : 'perspective');
  };

  return (
    <div className="absolute right-4 top-40 flex flex-col items-center z-40 select-none">
      <div onPointerDown={(e) => startDrag(e, 'zoom')}>
        <ToolbarButton icon={ZoomIn} title="Zoom in/out (Drag)" />
      </div>
      <div onPointerDown={(e) => startDrag(e, 'pan')}>
        <ToolbarButton icon={Hand} title="Move the view (Drag)" />
      </div>
      <ToolbarButton 
        icon={Video} 
        title="Toggle Camera Walk" 
        onClick={handleWalk} 
      />
      <ToolbarButton 
        icon={Grid3X3} 
        title="Switch Perspective/Orthographic" 
        onClick={handleViewToggle} 
      />
    </div>
  );
}
