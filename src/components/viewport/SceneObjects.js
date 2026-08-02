"use client";

import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { TransformControls } from '@react-three/drei';

export default function SceneObjects() {
  const objects = useStore((state) => state.objects);
  const selectedIds = useStore((state) => state.selectedIds);
  const setSelectedIds = useStore((state) => state.setSelectedIds);
  const activeId = useStore((state) => state.activeId);
  const transformState = useStore((state) => state.transformState);
  const setTransformState = useStore((state) => state.setTransformState);
  const updateObject = useStore((state) => state.updateObject);
  
  const transformRef = useRef();

  // Keyboard shortcuts for g (translate) and s (scale)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'g' || e.key === 'G') {
        setTransformState({ mode: 'translate' });
      } else if (e.key === 's' || e.key === 'S') {
        setTransformState({ mode: 'scale' });
      } else if (e.key === 'Escape') {
        setTransformState({ mode: 'idle' });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTransformState]);

  const handlePointerDown = (e, id) => {
    e.stopPropagation(); // Prevent clicking on things behind
    
    if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      // Select only this object
      setSelectedIds([id]);
    }
  };

  return (
    <>
      {objects.map((obj) => {
        const isSelected = selectedIds.includes(obj.id);
        const isActive = activeId === obj.id;
        
        return (
          <group key={obj.id}>
            {isActive && transformState.mode !== 'idle' ? (
              <TransformControls
                ref={transformRef}
                mode={transformState.mode}
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                onObjectChange={(e) => {
                  if (e.target.object) {
                    const { position, rotation, scale } = e.target.object;
                    updateObject(obj.id, {
                      position: [position.x, position.y, position.z],
                      rotation: [rotation.x, rotation.y, rotation.z],
                      scale: [scale.x, scale.y, scale.z]
                    });
                  }
                }}
              >
                <mesh
                  onPointerDown={(e) => handlePointerDown(e, obj.id)}
                >
                  {obj.type === 'cube' && <boxGeometry args={[2, 2, 2]} />}
                  {/* Add an orange outline or emissive if selected to match blender somewhat */}
                  <meshStandardMaterial 
                    color={obj.color} 
                    roughness={0.7} 
                    emissive={isSelected ? "#ffaa00" : "#000000"}
                    emissiveIntensity={isSelected ? 0.2 : 0}
                  />
                </mesh>
              </TransformControls>
            ) : (
              <mesh
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                onPointerDown={(e) => handlePointerDown(e, obj.id)}
              >
                {obj.type === 'cube' && <boxGeometry args={[2, 2, 2]} />}
                <meshStandardMaterial 
                  color={obj.color} 
                  roughness={0.7} 
                  emissive={isSelected ? "#ffaa00" : "#000000"}
                  emissiveIntensity={isSelected ? 0.2 : 0}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}
