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
    const activeSceneCameraId = useStore.getState().activeSceneCameraId;

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
      if (!activeSceneCameraId) {
        addToast("No Active Camera set!", "error", 3000);
        return;
      }
      
      const sceneCamera = objects.find(o => o.id === activeSceneCameraId);
      if (!sceneCamera) {
        addToast("Active Camera not found in scene!", "error", 3000);
        return;
      }

      // Save current state
      setSavedCameraState({
        position: mainCamera.position.clone(),
        quaternion: mainCamera.quaternion.clone(),
        target: controls.target.clone()
      });

      // Move mainCamera to match the scene camera's transform
      const camPos = new THREE.Vector3(...sceneCamera.position);
      const camRot = new THREE.Euler(...sceneCamera.rotation);
      
      // Calculate a point in front of the camera to set as the orbit target
      // This ensures that orbiting while in camera view feels natural and pivots around what the camera is looking at
      const targetPos = new THREE.Vector3(0, 0, -10);
      targetPos.applyEuler(camRot).add(camPos);

      mainCamera.position.copy(camPos);
      mainCamera.setRotationFromEuler(camRot);
      controls.target.copy(targetPos);
      controls.update();

      setIsCameraView(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '0' || e.code === 'Numpad0') {
        if (e.ctrlKey || e.metaKey) {
          // Set selected object as active camera
          const selectedIds = useStore.getState().selectedIds;
          const objects = useStore.getState().objects;
          const addToast = useStore.getState().addToast;
          
          if (selectedIds.length === 1) {
            const selectedObj = objects.find(o => o.id === selectedIds[0]);
            if (selectedObj && selectedObj.category === 'camera') {
              useStore.getState().setActiveSceneCamera(selectedObj.id);
              addToast(`Set Active Camera to ${selectedObj.name || selectedObj.id}`, "info", 2000);
            } else {
              addToast("Selected object is not a camera", "error", 2000);
            }
          } else {
            addToast("Select exactly one camera to set as active", "error", 2000);
          }
        } else {
          // Toggle camera view
          toggleCameraView();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCameraView, savedCameraState]);

  return { toggleCameraView, isCameraView };
}
