import { create } from 'zustand';

export const CANVAS_SETTINGS = {
  shadows: true,
  orthographic: false,
  flat: false,
  linear: false,
  frameloop: "always",
  dpr: [1, 2],
  camera: {
    position: [12, 8, 12],
    fov: 45,
    near: 0.1,
    far: 1000,
  },
  gl: {
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  }
};

export const GRID_SETTINGS = {
  infiniteGrid: true,
  fadeDistance: 50,
  sectionColor: "#5a5a5a",
  cellColor: "#3b3b3b",
  cellSize: 1,
  sectionSize: 10,
  position: [0, 0, 0]
};

export const FOG_SETTINGS = {
  color: "#303030", // Matches background
  near: 15,
  far: 50
};

export const AXES_SETTINGS = {
  length: FOG_SETTINGS.far * 2,
  thickness: 0.04,
  colors: {
    x: "#ff4444",
    z: "#88ff44"
  },
  opacity: 0.6
};


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
