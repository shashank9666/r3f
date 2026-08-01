import { create } from 'zustand';

// Store constant default values for the viewport
export const useStore = create((set) => ({
  viewport: {
    camera: {
      position: [12, 8, 12],
      fov: 45,
    },
    lighting: {
      ambientIntensity: 0.8,
      directionalIntensity: 1.0,
      directionalPosition: [5, 10, 5],
      secondaryDirectionalIntensity: 0.3,
      secondaryDirectionalPosition: [-5, 5, -5],
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
  
  showSplash: true,
  setShowSplash: (val) => set({ showSplash: val }),
  
  scene: null,
  setScene: (scene) => set({ scene }),
}));
