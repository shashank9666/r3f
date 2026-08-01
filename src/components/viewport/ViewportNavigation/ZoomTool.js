"use client";

import { useRef, useEffect } from 'react';
import { useStore } from '../../../store/useStore';

export function useZoomTool() {
  const { camera, controls, zoomSpeed } = useStore();
  const isZooming = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    if (isZooming.current && camera) {
      const deltaY = e.clientY - previousMouse.current.y;
      
      // Dolly camera along its local Z axis
      // If we are in Orthographic, we would adjust zoom property instead
      if (camera.isOrthographicCamera) {
        camera.zoom -= deltaY * zoomSpeed * 0.5;
        camera.zoom = Math.max(0.1, camera.zoom);
        camera.updateProjectionMatrix();
      } else {
        camera.translateZ(deltaY * zoomSpeed * 0.5);
      }
      
      if (controls) controls.update();
      previousMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e) => {
    isZooming.current = false;
    document.body.style.cursor = 'default';
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  const startZoomDrag = (e) => {
    e.preventDefault();
    isZooming.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'ns-resize';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const stepZoom = (direction) => {
    if (!camera) return;
    if (camera.isOrthographicCamera) {
      camera.zoom += direction > 0 ? 1 : -1;
      camera.zoom = Math.max(0.1, camera.zoom);
      camera.updateProjectionMatrix();
    } else {
      camera.translateZ(direction > 0 ? -2 : 2);
    }
    if (controls) controls.update();
  };

  return { startZoomDrag, stepZoom };
}
