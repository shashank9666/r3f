"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../../store/useStore';
import * as THREE from 'three';
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';

export default function BoxSelectionTool() {
  const { camera, scene, gl } = useThree();
  const activeTool = useStore((state) => state.activeTool);
  const setActiveTool = useStore((state) => state.setActiveTool);
  const setSelectedIds = useStore((state) => state.setSelectedIds);
  const objects = useStore((state) => state.objects);

  const [selectionBox, setSelectionBox] = useState(null);
  
  // HTML Overlay State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSelectionBox(new SelectionBox(camera, scene));
  }, [camera, scene]);

  useEffect(() => {
    if (activeTool !== 'box-select' || !selectionBox) return;

    const domElement = gl.domElement.parentElement;
    if (!domElement) return;

    domElement.style.cursor = 'crosshair';

    const getNDCCoordinates = (clientX, clientY) => {
      const rect = domElement.getBoundingClientRect();
      return new THREE.Vector3(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
        0.5
      );
    };

    const handlePointerDown = (e) => {
      // Allow orbit controls or other tools to work on right/middle click
      if (e.button !== 0) return;
      
      e.preventDefault();
      
      const ndc = getNDCCoordinates(e.clientX, e.clientY);
      selectionBox.startPoint.copy(ndc);
      
      setStartPoint({ x: e.clientX, y: e.clientY });
      setEndPoint({ x: e.clientX, y: e.clientY });
      setIsDrawing(true);
    };

    const handlePointerMove = (e) => {
      if (!isDrawing) return;
      
      e.preventDefault();
      setEndPoint({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = (e) => {
      if (!isDrawing) return;
      if (e.button !== 0) return;
      
      e.preventDefault();
      setIsDrawing(false);
      
      const ndc = getNDCCoordinates(e.clientX, e.clientY);
      selectionBox.endPoint.copy(ndc);

      const allSelected = selectionBox.select();
      
      // Filter out helpers, grid, etc. We only want objects from our store
      const objectIds = objects.map(o => o.id);
      
      // Find meshes that belong to our objects
      const newSelectedIds = new Set();
      
      allSelected.forEach(mesh => {
        // Walk up to find if this mesh belongs to one of our stored objects
        let current = mesh;
        while (current) {
          // In SceneObjects, we didn't explicitly set the name/userData of the group to the ID.
          // Wait, we need a way to map Three.js objects back to store objects.
          // For now, let's look at the userData.id if it was set, or we can check the scene graph.
          if (current.userData && current.userData.id) {
            if (objectIds.includes(current.userData.id)) {
              newSelectedIds.add(current.userData.id);
            }
            break;
          }
          current = current.parent;
        }
      });
      
      // If we are holding shift, we add to selection, otherwise replace
      if (e.shiftKey) {
        const currentSelected = useStore.getState().selectedIds;
        setSelectedIds(Array.from(new Set([...currentSelected, ...newSelectedIds])));
      } else {
        setSelectedIds(Array.from(newSelectedIds));
      }
      
      // Optional: automatically revert tool
      // setActiveTool('select');
    };

    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Create the visual box element imperatively
    const boxEl = document.createElement('div');
    boxEl.style.position = 'fixed';
    boxEl.style.border = '1px dashed rgba(255, 255, 255, 0.8)';
    boxEl.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    boxEl.style.pointerEvents = 'none';
    boxEl.style.zIndex = '100';
    boxEl.style.display = 'none';
    document.body.appendChild(boxEl);

    const updateVisualBox = () => {
      if (isDrawing) {
        const left = Math.min(startPoint.x, endPoint.x);
        const top = Math.min(startPoint.y, endPoint.y);
        const width = Math.abs(endPoint.x - startPoint.x);
        const height = Math.abs(endPoint.y - startPoint.y);
        
        boxEl.style.left = `${left}px`;
        boxEl.style.top = `${top}px`;
        boxEl.style.width = `${width}px`;
        boxEl.style.height = `${height}px`;
        boxEl.style.display = 'block';
      } else {
        boxEl.style.display = 'none';
      }
    };
    
    updateVisualBox();

    return () => {
      domElement.style.cursor = 'default';
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (document.body.contains(boxEl)) {
        document.body.removeChild(boxEl);
      }
    };
  }, [activeTool, selectionBox, gl.domElement, isDrawing, startPoint, endPoint, objects, setSelectedIds]);

  return null;
}
