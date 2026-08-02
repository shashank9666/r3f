/* eslint-disable */
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

const transformPlane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const intersection = new THREE.Vector3();
const startIntersection = new THREE.Vector3();
const tempVec = new THREE.Vector3();

export default function ModalTransformHandler({ objectRefs }) {
  const { camera, gl, pointer } = useThree();
  const objects = useStore((state) => state.objects);
  const selectedIds = useStore((state) => state.selectedIds);
  const activeId = useStore((state) => state.activeId);
  const transformState = useStore((state) => state.transformState);
  const setTransformState = useStore((state) => state.setTransformState);
  const updateObject = useStore((state) => state.updateObject);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const controls = useStore((state) => state.controls);

  useEffect(() => {
    if (transformState.active && transformState.mode === 'translate') {
      const activeObj = objects.find(o => o.id === activeId);
      if (activeObj) {
        // Disable orbit controls
        if (controls) controls.enabled = false;
        
        // Plane normal is looking at the camera
        const normal = new THREE.Vector3().copy(camera.position).sub(new THREE.Vector3(...activeObj.position)).normalize();
        transformPlane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(...activeObj.position));
        
        // Raycast initial position
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(transformPlane, startIntersection)) {
          setIsCapturing(true);
        }
      }
    } else {
      setIsCapturing(false);
      // Re-enable orbit controls
      if (controls) controls.enabled = true;
    }
    
    return () => {
      if (controls) controls.enabled = true;
    };
  }, [transformState.active, transformState.mode, activeId, controls]);

  useFrame(() => {
    if (!isCapturing || !transformState.active || transformState.mode !== 'translate') return;

    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(transformPlane, intersection)) {
      
      const offset = intersection.clone().sub(startIntersection);
      
      // Apply Constraints
      if (transformState.axisConstraint === 'X') {
        offset.y = 0; offset.z = 0;
      } else if (transformState.axisConstraint === 'Y') {
        offset.x = 0; offset.z = 0;
      } else if (transformState.axisConstraint === 'Z') {
        offset.x = 0; offset.y = 0;
      } else if (transformState.planeConstraint === 'XY') {
        offset.z = 0;
      } else if (transformState.planeConstraint === 'XZ') {
        offset.y = 0;
      } else if (transformState.planeConstraint === 'YZ') {
        offset.x = 0;
      }
      
      // Precision (Shift)
      if (transformState.precision) {
        offset.multiplyScalar(0.1);
      }
      
      // Numeric Override
      if (transformState.numericBuffer) {
        const val = parseFloat(transformState.numericBuffer);
        if (!isNaN(val)) {
          if (transformState.axisConstraint === 'X') offset.set(val, 0, 0);
          else if (transformState.axisConstraint === 'Y') offset.set(0, val, 0);
          else if (transformState.axisConstraint === 'Z') offset.set(0, 0, val);
          else offset.set(val, val, val); // Simplified
        }
      }

      // Snapping
      if (transformState.snapping && !transformState.numericBuffer) {
        offset.x = Math.round(offset.x);
        offset.y = Math.round(offset.y);
        offset.z = Math.round(offset.z);
      }
      
      // Update HUD imperatively
      const deltaEl = document.getElementById('transform-hud-delta');
      if (deltaEl) {
        const mag = offset.length();
        deltaEl.innerText = `Dx: ${offset.x.toFixed(4)} m  Dy: ${offset.y.toFixed(4)} m  Dz: ${offset.z.toFixed(4)} m (${mag.toFixed(4)} m)`;
      }
      
      // Update object refs imperatively
      selectedIds.forEach(id => {
        const startPosArray = transformState.startPositions[id];
        const ref = objectRefs.current[id];
        if (startPosArray && ref) {
          ref.position.set(
            startPosArray[0] + offset.x,
            startPosArray[1] + offset.y,
            startPosArray[2] + offset.z
          );
        }
      });
    }
  });

  // Handle Keys & Confirmation
  useEffect(() => {
    if (!transformState.active) return;
    
    const handleKeyDown = (e) => {
      // Don't prevent default on input elements
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      e.preventDefault();
      const key = e.key.toLowerCase();
      
      // Constraints
      if (key === 'x') {
        if (e.shiftKey) setTransformState({ planeConstraint: 'YZ', axisConstraint: null });
        else setTransformState({ axisConstraint: 'X', planeConstraint: null });
      }
      else if (key === 'y') {
        if (e.shiftKey) setTransformState({ planeConstraint: 'XZ', axisConstraint: null });
        else setTransformState({ axisConstraint: 'Y', planeConstraint: null });
      }
      else if (key === 'z') {
        if (e.shiftKey) setTransformState({ planeConstraint: 'XY', axisConstraint: null });
        else setTransformState({ axisConstraint: 'Z', planeConstraint: null });
      }
      
      // Modifiers
      else if (key === 'shift') setTransformState({ precision: true });
      else if (key === 'control') setTransformState({ snapping: true });
      
      // Numeric
      else if (/^[-0-9.]$/.test(e.key)) {
        setTransformState({ numericBuffer: transformState.numericBuffer + e.key });
      }
      else if (e.key === 'Backspace') {
        setTransformState({ numericBuffer: transformState.numericBuffer.slice(0, -1) });
      }
      
      // Confirm/Cancel
      else if (e.key === 'Enter' || e.key === ' ') confirmTransform();
      else if (e.key === 'Escape') cancelTransform();
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') setTransformState({ precision: false });
      else if (e.key === 'Control') setTransformState({ snapping: false });
    };
    
    const handleMouseUp = (e) => {
      if (e.button === 0) confirmTransform();
      else if (e.button === 2) cancelTransform();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('pointerup', handleMouseUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('pointerup', handleMouseUp);
    };
  }, [transformState.active, transformState.numericBuffer, transformState.axisConstraint, transformState.planeConstraint, setTransformState, gl, selectedIds, objectRefs]);

  const confirmTransform = () => {
    // Save new pos to state
    selectedIds.forEach(id => {
      const ref = objectRefs.current[id];
      if (ref) {
        updateObject(id, { position: [ref.position.x, ref.position.y, ref.position.z] });
      }
    });

    setTransformState({ 
      active: false, 
      mode: 'idle', 
      axisConstraint: null, 
      planeConstraint: null, 
      numericBuffer: '' 
    });
  };

  const cancelTransform = () => {
    selectedIds.forEach(id => {
      const startPos = transformState.startPositions[id];
      const ref = objectRefs.current[id];
      if (startPos && ref) {
        ref.position.set(...startPos);
      }
    });
    setTransformState({ 
      active: false, 
      mode: 'idle', 
      axisConstraint: null, 
      planeConstraint: null, 
      numericBuffer: '' 
    });
  };

  return null;
}
