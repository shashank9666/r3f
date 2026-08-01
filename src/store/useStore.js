import { create } from 'zustand';

// Store constant default values for the viewport
export const useStore = create((set) => ({
  viewport: {
    camera: {
      position: [7, 5, 7],
      fov: 45,
    },
    lighting: {
      ambientIntensity: 0.5,
      directionalIntensity: 1.5,
      directionalPosition: [10, 10, 5],
      secondaryDirectionalIntensity: 0.5,
      secondaryDirectionalPosition: [-10, 10, -5],
    },
    showGrid: true,
    showCube: true,
  },

  // Example functions to update the store if needed later
  toggleGrid: () => set((state) => ({ 
    viewport: { ...state.viewport, showGrid: !state.viewport.showGrid } 
  })),
  
  toggleCube: () => set((state) => ({ 
    viewport: { ...state.viewport, showCube: !state.viewport.showCube } 
  })),
}));
