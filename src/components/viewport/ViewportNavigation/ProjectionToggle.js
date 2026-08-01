"use client";

import { useStore } from '../../../store/useStore';

export function useProjectionToggle() {
  const { projection, setProjection, camera, controls } = useStore();

  const toggleProjection = () => {
    if (!camera || !controls) return;
    
    // In a real seamless transition, we'd calculate frustum sizes here
    // For now we just toggle the state, and Viewport.js will swap the active camera component
    setProjection(projection === 'perspective' ? 'orthographic' : 'perspective');
  };

  return { toggleProjection, projection };
}
