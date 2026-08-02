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
    const objects = useStore.getState().objects;
    const addToast = useStore.getState().addToast;

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
      // 1. Find a camera in the scene objects
      const sceneCamera = objects.find(o => o.category === 'camera');
      if (!sceneCamera) {
        addToast("No Camera Found in scene!", "error", 3000);
        return;
      }

      // Save current state
      setSavedCameraState({
        position: mainCamera.position.clone(),
        quaternion: mainCamera.quaternion.clone(),
        target: controls.target.clone()
      });

      // 2. Move mainCamera to match the scene camera's transform
      const camPos = new THREE.Vector3(...sceneCamera.position);
      const camRot = new THREE.Euler(...sceneCamera.rotation);
      
      // Let's make it look at the origin/cube
      const targetPos = new THREE.Vector3(0, 1, 0);

      mainCamera.position.copy(camPos);
      mainCamera.setRotationFromEuler(camRot);
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
