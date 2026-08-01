"use client";

import { useRef } from 'react';
import { useStore } from '../../../store/useStore';
import * as THREE from 'three';

export function usePanTool() {
  const { camera, controls } = useStore();
  const isPanning = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    if (isPanning.current && camera && controls) {
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      
      const offset = new THREE.Vector3();
      const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      
      // Adjust pan speed based on distance or zoom
      let speed = 0.02;
      if (camera.isOrthographicCamera) {
        speed = 1 / camera.zoom;
      } else {
        speed = camera.position.distanceTo(controls.target) * 0.002;
      }

      offset.add(right.multiplyScalar(deltaX * speed));
      offset.add(up.multiplyScalar(deltaY * speed));
      
      camera.position.add(offset);
      controls.target.add(offset);
      controls.update();
      
      previousMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e) => {
    isPanning.current = false;
    document.body.style.cursor = 'default';
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  const startPanDrag = (e) => {
    e.preventDefault();
    isPanning.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'move';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return { startPanDrag };
}
