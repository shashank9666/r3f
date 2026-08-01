import { create } from 'zustand';

export const CANVAS_SETTINGS = {
  shadows: true,
  orthographic: false,
  flat: false,
  linear: false,
  frameloop: "always",
  dpr: [1, 2],
  camera: {
    position: [12, 9, 12],
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
  fadeDistance: 100,
  sectionColor: "#5a5a5a",
  cellColor: "#3b3b3b",
  cellSize: 1,
  sectionSize: 10,
  position: [0, 0, 0]
};

export const FOG_SETTINGS = {
  color: "#303030", // Matches background
  near: 30,
  far: 100
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
      position: [12, 9, 12],
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

  camera: null,
  setCamera: (camera) => set({ camera }),

  controls: null,
  setControls: (controls) => set({ controls }),

  // Navigation and View states
  viewMode: 'perspective',
  setViewMode: (mode) => set({ viewMode: mode }),

  navigationMode: 'orbit',
  setNavigationMode: (mode) => set({ navigationMode: mode }),

  // --- Interaction Engine State ---

  // Scene Graph
  objects: [
    { id: 'default-cube', type: 'cube', position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#8c8c8c' }
  ],
  setObjects: (objects) => set({ objects }),
  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
  })),

  // Selection
  selectedIds: [],
  activeId: null,
  setSelectedIds: (ids) => set({ selectedIds: ids, activeId: ids.length > 0 ? ids[ids.length - 1] : null }),

  // Modal Transform State Machine
  transformState: {
    mode: 'idle', // 'idle' | 'translate' | 'rotate' | 'scale'
    axisConstraint: null, // null | 'X' | 'Y' | 'Z' | 'XY' | 'YZ' | 'XZ'
    numericBuffer: '',
    originalTransforms: {} // stores transforms when action starts for undo/cancel
  },
  setTransformState: (updates) => set((state) => ({
    transformState: { ...state.transformState, ...updates }
  })),

  // History System (Undo/Redo)
  undoStack: [],
  redoStack: [],
  pushHistory: (action) => set((state) => ({
    undoStack: [...state.undoStack, action],
    redoStack: [] // clearing redo stack on new action
  })),
  undo: () => set((state) => {
    if (state.undoStack.length === 0) return state;
    const action = state.undoStack[state.undoStack.length - 1];
    const newUndoStack = state.undoStack.slice(0, -1);
    // Apply inverse action (handled externally or simplified here)
    // For now, we return the pop, and the caller handles the revert.
    return { undoStack: newUndoStack, redoStack: [...state.redoStack, action] };
  }),
  redo: () => set((state) => {
    if (state.redoStack.length === 0) return state;
    const action = state.redoStack[state.redoStack.length - 1];
    const newRedoStack = state.redoStack.slice(0, -1);
    return { redoStack: newRedoStack, undoStack: [...state.undoStack, action] };
  })
}));
