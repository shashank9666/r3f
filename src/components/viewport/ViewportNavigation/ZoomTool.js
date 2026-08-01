"use client";

/* eslint-disable react-hooks/immutability */
import { useRef, useEffect } from 'react';
import { useStore } from '../../../store/useStore';

export function useZoomTool() {
  const { camera, controls, zoomSpeed } = useStore();
  const isZooming = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    if (isZooming.current && camera && controls) {
      const deltaY = e.clientY - previousMouse.current.y;
      
      if (camera.isOrthographicCamera) {
        // Exponential zoom for orthographic
        camera.zoom *= Math.pow(0.99, deltaY * zoomSpeed);
        camera.zoom = Math.max(0.001, camera.zoom);
        camera.updateProjectionMatrix();
      } else {
        // Distance-scaled dolly for perspective
        const distance = camera.position.distanceTo(controls.target);
        camera.translateZ(deltaY * zoomSpeed * distance * 0.05);
      }
      
      controls.update();
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
    if (!camera || !controls) return;
    if (camera.isOrthographicCamera) {
      camera.zoom *= direction > 0 ? 1.2 : 0.8;
      camera.zoom = Math.max(0.001, camera.zoom);
      camera.updateProjectionMatrix();
    } else {
      const distance = camera.position.distanceTo(controls.target);
      camera.translateZ(direction > 0 ? -distance * 0.2 : distance * 0.2);
    }
    controls.update();
  };

  return { startZoomDrag, stepZoom };
}
