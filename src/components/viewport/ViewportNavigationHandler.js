"use client";

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export default function ViewportNavigationHandler() {
  const { gl, camera } = useThree();
  const activeTool = useStore((state) => state.activeTool);
  const setActiveTool = useStore((state) => state.setActiveTool);
  const controls = useStore((state) => state.controls);
  const zoomSpeed = useStore((state) => state.zoomSpeed);
  
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Update cursor
    if (activeTool === 'pan') {
      gl.domElement.style.cursor = 'all-scroll';
    } else if (activeTool === 'zoom') {
      gl.domElement.style.cursor = 'ns-resize';
    } else {
      gl.domElement.style.cursor = 'default';
    }
  }, [activeTool, gl.domElement]);

  useEffect(() => {
    if (activeTool === 'select' || !controls) return;

    const handlePointerDown = (e) => {
      isDragging.current = true;
      hasDragged.current = false;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      
      hasDragged.current = true;
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;

      if (activeTool === 'pan') {
        const offset = new THREE.Vector3();
        const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(camera.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
        
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
      } else if (activeTool === 'zoom') {
        if (camera.isOrthographicCamera) {
          camera.zoom *= Math.pow(0.99, deltaY * zoomSpeed);
          camera.zoom = Math.max(0.001, camera.zoom);
          camera.updateProjectionMatrix();
        } else {
          const distance = camera.position.distanceTo(controls.target);
          camera.translateZ(deltaY * zoomSpeed * distance * 0.05);
        }
        controls.update();
      }

      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      if (!isDragging.current) return; // Ignore pointer up if pointer down wasn't on canvas
      
      isDragging.current = false;
      
      // If the user just clicked on the canvas without dragging, revert to select mode
      if (!hasDragged.current) {
        setActiveTool('select');
      }
    };

    const domElement = gl.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeTool, camera, controls, gl.domElement, setActiveTool, zoomSpeed]);

  return null;
}
