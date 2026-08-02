"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export default function TransformProxy({ objectRefs }) {
  const selectedIds = useStore((state) => state.selectedIds);
  const objects = useStore((state) => state.objects);
  const updateObject = useStore((state) => state.updateObject);
  const transformState = useStore((state) => state.transformState);
  const setTransformState = useStore((state) => state.setTransformState);

  const proxyRef = useRef();
  
  // To calculate delta matrix
  const [initialMatrix, setInitialMatrix] = useState(null);
  const [initialChildMatrices, setInitialChildMatrices] = useState({});

  useEffect(() => {
    // Only use proxy if multiple items are selected and we're NOT in modal (G) mode.
    // Modal translate handles multiple objects using its own offset logic.
    if (selectedIds.length > 1 && !transformState.active && transformState.mode !== 'idle' && proxyRef.current) {
      
      // Calculate Median Point
      const medianPoint = new THREE.Vector3();
      let count = 0;
      
      const childMatrices = {};
      
      selectedIds.forEach(id => {
        const obj = objects.find(o => o.id === id);
        if (obj) {
          medianPoint.add(new THREE.Vector3(...obj.position));
          count++;
          
          const ref = objectRefs.current[id];
          if (ref) {
            // Save initial local matrix of each selected object
            ref.updateMatrix();
            childMatrices[id] = ref.matrix.clone();
          }
        }
      });
      
      if (count > 0) {
        medianPoint.divideScalar(count);
        proxyRef.current.position.copy(medianPoint);
        proxyRef.current.rotation.set(0, 0, 0);
        proxyRef.current.scale.set(1, 1, 1);
        proxyRef.current.updateMatrix();
        
        setInitialMatrix(proxyRef.current.matrix.clone());
        setInitialChildMatrices(childMatrices);
      }
    } else {
      setInitialMatrix(null);
    }
  }, [selectedIds, transformState.mode, transformState.active, objects, objectRefs]);

  if (selectedIds.length <= 1 || transformState.active || transformState.mode === 'idle') return null;

  const handleDraggingChanged = (e) => {
    if (!e.value && proxyRef.current && initialMatrix) {
      // Drag ended, update store
      const proxyMatrix = proxyRef.current.matrix;
      const proxyMatrixInverse = initialMatrix.clone().invert();
      const deltaMatrix = proxyMatrix.clone().multiply(proxyMatrixInverse);

      selectedIds.forEach(id => {
        const initialChildMat = initialChildMatrices[id];
        if (initialChildMat) {
          const newChildMat = deltaMatrix.clone().multiply(initialChildMat);
          const position = new THREE.Vector3();
          const quaternion = new THREE.Quaternion();
          const scale = new THREE.Vector3();
          newChildMat.decompose(position, quaternion, scale);
          
          const euler = new THREE.Euler().setFromQuaternion(quaternion);
          
          updateObject(id, {
            position: [position.x, position.y, position.z],
            rotation: [euler.x, euler.y, euler.z],
            scale: [scale.x, scale.y, scale.z]
          });
        }
      });

      setTransformState({ mode: 'idle', axisConstraint: null, planeConstraint: null });
    }
  };

  // During drag, update actual object meshes live for visual feedback
  const handleObjectChange = (e) => {
    if (proxyRef.current && initialMatrix) {
      proxyRef.current.updateMatrix();
      const proxyMatrix = proxyRef.current.matrix;
      const proxyMatrixInverse = initialMatrix.clone().invert();
      const deltaMatrix = proxyMatrix.clone().multiply(proxyMatrixInverse);

      selectedIds.forEach(id => {
        const initialChildMat = initialChildMatrices[id];
        const ref = objectRefs.current[id];
        if (initialChildMat && ref) {
          const newChildMat = deltaMatrix.clone().multiply(initialChildMat);
          const position = new THREE.Vector3();
          const quaternion = new THREE.Quaternion();
          const scale = new THREE.Vector3();
          newChildMat.decompose(position, quaternion, scale);
          
          ref.position.copy(position);
          ref.quaternion.copy(quaternion);
          ref.scale.copy(scale);
        }
      });
    }
  };

  return (
    <group ref={proxyRef}>
      <TransformControls
        object={proxyRef}
        mode={transformState.mode}
        showX={transformState.axisConstraint === null || transformState.axisConstraint === 'X'}
        showY={transformState.axisConstraint === null || transformState.axisConstraint === 'Y'}
        showZ={transformState.axisConstraint === null || transformState.axisConstraint === 'Z'}
        onDraggingChanged={handleDraggingChanged}
        onChange={handleObjectChange}
      />
    </group>
  );
}
