"use client";

import { useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import * as THREE from 'three';

export function useCameraViewToggle() {
  const isCameraView = useStore((state) => state.isCameraView);
  const setIsCameraView = useStore((state) => state.setIsCameraView);
  const setSavedCameraState = useStore((state) => state.setSavedCameraState);
  const savedCameraState = useStore((state) => state.savedCameraState);

  const toggleCameraView = () => {
    const mainCamera = useStore.getState().camera;
    const controls = useStore.getState().controls;
    
    if (!mainCamera || !controls) return;

    if (isCameraView) {
      // Exit Camera View - restore saved state
      if (savedCameraState) {
        mainCamera.position.copy(savedCameraState.position);
        mainCamera.quaternion.copy(savedCameraState.quaternion);
        controls.target.copy(savedCameraState.target);
        controls.update();
      }
      setIsCameraView(false);
    } else {
      // Enter Camera View
      // Save current state
      setSavedCameraState({
        position: mainCamera.position.clone(),
        quaternion: mainCamera.quaternion.clone(),
        target: controls.target.clone()
      });

      // Dummy camera is at [-6, 3, 6] looking at [0, 1, 0] roughly (or looking along its Z)
      // Let's set the main camera to match the dummy camera exactly
      const camPos = new THREE.Vector3(-6, 3, 6);
      
      // Let's make it look at the origin/cube
      const targetPos = new THREE.Vector3(0, 1, 0);

      mainCamera.position.copy(camPos);
      mainCamera.lookAt(targetPos);
      controls.target.copy(targetPos);
      controls.update();

      setIsCameraView(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Numpad 0 or regular 0 toggles camera view
      if (e.key === '0' || e.code === 'Numpad0') {
        // Prevent typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        toggleCameraView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCameraView, savedCameraState]); // Re-bind when state changes so toggle closure has latest state

  return { toggleCameraView, isCameraView };
}
