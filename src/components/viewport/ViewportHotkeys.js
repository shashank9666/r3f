"use client";

import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import AddMenu from './AddMenu';
import RenameDialog from './RenameDialog';

export default function ViewportHotkeys() {
  const objects = useStore((state) => state.objects);
  const selectedIds = useStore((state) => state.selectedIds);
  const activeId = useStore((state) => state.activeId);
  const deleteObjects = useStore((state) => state.deleteObjects);
  const duplicateObjects = useStore((state) => state.duplicateObjects);
  const clearTransforms = useStore((state) => state.clearTransforms);
  const applyTransforms = useStore((state) => state.applyTransforms);
  const setTransformState = useStore((state) => state.setTransformState);
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMenuPosition, setAddMenuPosition] = useState({ x: 0, y: 0 });
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      
      // Shift + A: Add Menu
      if (key === 'a' && e.shiftKey) {
        e.preventDefault();
        setAddMenuPosition({ x: e.clientX, y: e.clientY });
        setShowAddMenu(true);
      }
      
      // B: Box Select
      if (key === 'b' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        useStore.getState().setActiveTool('box-select');
      }
      
      // X or Delete: Delete Objects
      if (key === 'x' || e.key === 'Delete') {
        if (selectedIds.length > 0) {
          deleteObjects(selectedIds);
        }
      }
      
      // Shift + D: Duplicate
      if (key === 'd' && e.shiftKey) {
        e.preventDefault();
        if (selectedIds.length > 0) {
          duplicateObjects(selectedIds);
          
          // Force enter Grab mode for the new objects (which will become selected immediately)
          // We use setTimeout to allow state to propagate
          setTimeout(() => {
            const currentSelected = useStore.getState().selectedIds;
            const currentObjects = useStore.getState().objects;
            
            const startPositions = {};
            currentSelected.forEach(id => {
              const obj = currentObjects.find(o => o.id === id);
              if (obj) startPositions[id] = [...obj.position];
            });
            
            setTransformState({ 
              active: true,
              mode: 'translate', 
              axisConstraint: null,
              planeConstraint: null,
              numericBuffer: '',
              startPositions
            });
          }, 50);
        }
      }
      
      // F2: Rename
      if (e.key === 'F2') {
        e.preventDefault();
        if (activeId) {
          setShowRenameDialog(true);
        }
      }
      
      const transformState = useStore.getState().transformState;
      
      // G : Grab / Translate
      if (key === 'g' && !e.altKey && !transformState.active) {
        if (selectedIds.length > 0) {
          const startPositions = {};
          selectedIds.forEach(id => {
            const obj = objects.find(o => o.id === id);
            if (obj) startPositions[id] = [...obj.position];
          });
          
          setTransformState({ 
            active: true,
            mode: 'translate', 
            axisConstraint: null,
            planeConstraint: null,
            numericBuffer: '',
            startPositions
          });
        }
      }
      
      // R / S : Rotate / Scale
      if (key === 'r' && !e.altKey && !transformState.active) {
        setTransformState({ mode: 'rotate', axisConstraint: null });
      } else if (key === 's' && !e.altKey && !transformState.active) {
        setTransformState({ mode: 'scale', axisConstraint: null });
      } 
      
      // X / Y / Z: Axis Constraints for modal transform
      else if (key === 'x' && !e.altKey && transformState.mode !== 'idle') {
        setTransformState({ axisConstraint: transformState.axisConstraint === 'X' ? null : 'X' });
      } else if (key === 'y' && !e.altKey && transformState.mode !== 'idle') {
        setTransformState({ axisConstraint: transformState.axisConstraint === 'Y' ? null : 'Y' });
      } else if (key === 'z' && !e.altKey && transformState.mode !== 'idle') {
        setTransformState({ axisConstraint: transformState.axisConstraint === 'Z' ? null : 'Z' });
      } 
      
      // Escape: Cancel Transform
      else if (e.key === 'Escape' && !transformState.active) {
        setTransformState({ mode: 'idle', axisConstraint: null });
      }
      
      // Ctrl + A: Apply Transform
      if (key === 'a' && e.ctrlKey) {
        e.preventDefault();
        applyTransforms();
      }
      
      // Alt + G / R / S : Clear Transforms
      if (e.altKey) {
        if (key === 'g') { e.preventDefault(); clearTransforms('location'); }
        if (key === 'r') { e.preventDefault(); clearTransforms('rotation'); }
        if (key === 's') { e.preventDefault(); clearTransforms('scale'); }
      }
      
      // Ctrl + C: Copy
      if (key === 'c' && e.ctrlKey) {
        if (selectedIds.length > 0) {
          const selectedObjects = objects.filter(o => selectedIds.includes(o.id));
          try {
            await navigator.clipboard.writeText(JSON.stringify({
              type: 'r3f-clone-clipboard',
              objects: selectedObjects
            }));
          } catch (err) {
            console.error('Failed to copy', err);
          }
        }
      }
      
      // Ctrl + V: Paste
      if (key === 'v' && e.ctrlKey) {
        try {
          const text = await navigator.clipboard.readText();
          const data = JSON.parse(text);
          if (data && data.type === 'r3f-clone-clipboard') {
            const addObject = useStore.getState().addObject;
            
            // Unselect all first (handled implicitly by multiple adds or manually)
            // Add each object with a slight offset
            data.objects.forEach(obj => {
              // Copy properties except ID, slightly offset position
              const { id, type, category, position, ...rest } = obj;
              const newPos = [position[0] + 0.5, position[1] + 0.5, position[2] + 0.5];
              addObject(type, category, { ...rest, position: newPos });
            });
          }
        } catch (err) {
          // Normal paste, ignore
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [objects, selectedIds, activeId, deleteObjects, duplicateObjects, clearTransforms, applyTransforms, setTransformState]);

  return (
    <>
      {showAddMenu && (
        <AddMenu 
          position={addMenuPosition} 
          onClose={() => setShowAddMenu(false)} 
        />
      )}
      {showRenameDialog && activeId && (
        <RenameDialog 
          activeId={activeId} 
          onClose={() => setShowRenameDialog(false)} 
        />
      )}
    </>
  );
}
