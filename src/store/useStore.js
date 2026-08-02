import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const CANVAS_SETTINGS = {
  shadows: true,
  orthographic: false,
  flat: false,
  linear: false,
  legacy: false,
  frameloop: "always",
  dpr: [1, 2],
  raycaster: {},
  resize: { scroll: true, debounce: { scroll: 50, resize: 0 } },
  eventPrefix: "offset",
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
  args: [100, 100],
  infiniteGrid: false,
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
export const useStore = create(
  persist(
    (set) => ({
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
  viewMode: 'perspective', // legacy, we'll use projection
  setViewMode: (mode) => set({ viewMode: mode }),

  navigationMode: 'orbit', // legacy, we'll use isWalking
  setNavigationMode: (mode) => set({ navigationMode: mode }),

  // --- Toolbar Navigation State ---
  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool }),
  zoomLevel: 1,
  setZoomLevel: (level) => set({ zoomLevel: level }),
  isPanning: false,
  setIsPanning: (isPanning) => set({ isPanning }),
  isWalking: false,
  setIsWalking: (isWalking) => set({ isWalking }),
  isCameraView: false,
  setIsCameraView: (isCameraView) => set({ isCameraView }),
  savedCameraState: null,
  setSavedCameraState: (state) => set({ savedCameraState: state }),
  projection: 'perspective',
  setProjection: (projection) => set({ projection }),
  movementSpeed: 5,
  setMovementSpeed: (speed) => set({ movementSpeed: speed }),
  zoomSpeed: 0.1,
  setZoomSpeed: (speed) => set({ zoomSpeed: speed }),

  // --- Interaction Engine State ---

  // Collections System
  collections: [
    { id: 'root', name: 'Scene Collection', visible: true, renderable: true, isExpanded: true, parentId: null }
  ],
  activeCollectionId: 'root',
  
  setCollections: (collections) => set({ collections }),
  addCollection: (name, parentId = 'root') => set((state) => {
    const newId = `col-${Date.now()}`;
    const newCollection = { id: newId, name, visible: true, renderable: true, isExpanded: true, parentId };
    return { collections: [...state.collections, newCollection], activeCollectionId: newId };
  }),
  updateCollection: (id, updates) => set((state) => ({
    collections: state.collections.map(col => col.id === id ? { ...col, ...updates } : col)
  })),
  deleteCollection: (id) => set((state) => {
    if (id === 'root') return state; // Cannot delete root
    // Move all children (objects and collections) to root
    const newCollections = state.collections.filter(c => c.id !== id).map(c => 
      c.parentId === id ? { ...c, parentId: 'root' } : c
    );
    const newObjects = state.objects.map(o => 
      o.collectionId === id ? { ...o, collectionId: 'root' } : o
    );
    return { 
      collections: newCollections, 
      objects: newObjects,
      activeCollectionId: state.activeCollectionId === id ? 'root' : state.activeCollectionId
    };
  }),
  setActiveCollectionId: (id) => set({ activeCollectionId: id }),

  // Scene Graph
  objects: [],
  setObjects: (objects) => set({ objects }),
  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
  })),
  addObject: (type, category, properties = {}) => set((state) => {
    const newId = `${type}-${Date.now()}`;
    const newObject = {
      id: newId,
      type,
      category,
      collectionId: state.activeCollectionId || 'root',
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#cccccc', // Slightly brighter default
      ...properties
    };
    
    // Push the previous state to history
    const historyAction = {
      type: 'ADD_OBJECT',
      previousObjects: [...state.objects],
      previousSelected: [...state.selectedIds],
      previousActive: state.activeId
    };
    
    return {
      objects: [...state.objects, newObject],
      selectedIds: [newId],
      activeId: newId,
      undoStack: [...state.undoStack, historyAction],
      redoStack: []
    };
  }),

  deleteObjects: (ids) => set((state) => {
    if (ids.length === 0) return state;
    const historyAction = {
      type: 'DELETE_OBJECT',
      previousObjects: [...state.objects],
      previousSelected: [...state.selectedIds],
      previousActive: state.activeId
    };
    return {
      objects: state.objects.filter(obj => !ids.includes(obj.id)),
      selectedIds: [],
      activeId: null,
      undoStack: [...state.undoStack, historyAction],
      redoStack: []
    };
  }),

  duplicateObjects: (ids) => set((state) => {
    if (ids.length === 0) return state;
    
    const objectsToDuplicate = state.objects.filter(obj => ids.includes(obj.id));
    const newObjects = objectsToDuplicate.map(obj => ({
      ...obj,
      id: `${obj.type}-copy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      // Add slight offset if not going into grab mode, but since Blender goes into grab mode, we don't offset yet.
    }));
    
    const newIds = newObjects.map(obj => obj.id);
    
    const historyAction = {
      type: 'DUPLICATE_OBJECT',
      previousObjects: [...state.objects],
      previousSelected: [...state.selectedIds],
      previousActive: state.activeId
    };
    
    return {
      objects: [...state.objects, ...newObjects],
      selectedIds: newIds,
      activeId: newIds[newIds.length - 1],
      undoStack: [...state.undoStack, historyAction],
      redoStack: []
    };
  }),

  clearTransforms: (type) => set((state) => {
    if (state.selectedIds.length === 0) return state;
    
    const historyAction = {
      type: 'CLEAR_TRANSFORMS',
      previousObjects: [...state.objects],
      previousSelected: [...state.selectedIds],
      previousActive: state.activeId
    };
    
    const newObjects = state.objects.map(obj => {
      if (!state.selectedIds.includes(obj.id)) return obj;
      if (type === 'location') return { ...obj, position: [0, 0, 0] };
      if (type === 'rotation') return { ...obj, rotation: [0, 0, 0] };
      if (type === 'scale') return { ...obj, scale: [1, 1, 1] };
      return obj;
    });
    
    return {
      objects: newObjects,
      undoStack: [...state.undoStack, historyAction],
      redoStack: []
    };
  }),

  applyTransforms: () => set((state) => {
    if (state.selectedIds.length === 0) return state;
    
    const historyAction = {
      type: 'APPLY_TRANSFORMS',
      previousObjects: [...state.objects],
      previousSelected: [...state.selectedIds],
      previousActive: state.activeId
    };
    
    // In a generic mesh renderer, baking transforms into geometry is complex.
    // For now, this is a simplified visual reset of the TRS values to 0/1 without
    // actually mutating the primitive's vertices (which is not possible on BoxGeometry directly).
    const newObjects = state.objects.map(obj => {
      if (!state.selectedIds.includes(obj.id)) return obj;
      return { ...obj, rotation: [0, 0, 0], scale: [1, 1, 1] }; 
    });
    
    return {
      objects: newObjects,
      undoStack: [...state.undoStack, historyAction],
      redoStack: []
    };
  }),

  // Selection
  selectedIds: [],
  activeId: null,
  setSelectedIds: (ids) => set((state) => {
    // Only reset mode if it's a gizmo transform (active is false).
    // Modal transform (active: true) handles its own lifecycle.
    const newTransformState = (!state.transformState.active && state.transformState.mode !== 'idle') 
      ? { ...state.transformState, mode: 'idle', axisConstraint: null, planeConstraint: null }
      : state.transformState;
      
    return { 
      selectedIds: ids, 
      activeId: ids.length > 0 ? ids[ids.length - 1] : null,
      transformState: newTransformState
    };
  }),

  // Modal Transform State Machine
  transformState: {
    active: false,
    mode: 'idle', // 'idle' | 'translate' | 'rotate' | 'scale'
    axisConstraint: null, // null | 'X' | 'Y' | 'Z'
    planeConstraint: null, // null | 'XY' | 'XZ' | 'YZ'
    numericBuffer: '',
    precision: false,
    snapping: false,
    originalTransforms: {}, // { id: { position, rotation, scale } }
    startPositions: {},
    mouseStart: null
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
    
    // Save current state for redo
    const redoAction = {
      ...action,
      previousObjects: [...state.objects],
      previousSelected: [...state.selectedIds],
      previousActive: state.activeId
    };

    return { 
      undoStack: newUndoStack, 
      redoStack: [...state.redoStack, redoAction],
      objects: action.previousObjects || state.objects,
      selectedIds: action.previousSelected || state.selectedIds,
      activeId: action.previousActive || state.activeId
    };
  }),
  redo: () => set((state) => {
    if (state.redoStack.length === 0) return state;
    const action = state.redoStack[state.redoStack.length - 1];
    const newRedoStack = state.redoStack.slice(0, -1);
    
    // Save current state for undo
    const undoAction = {
      ...action,
      previousObjects: [...state.objects],
      previousSelected: [...state.selectedIds],
      previousActive: state.activeId
    };

    return { 
      redoStack: newRedoStack, 
      undoStack: [...state.undoStack, undoAction],
      objects: action.previousObjects || state.objects,
      selectedIds: action.previousSelected || state.selectedIds,
      activeId: action.previousActive || state.activeId
    };
  })
}), {
  name: 'r3f-editor-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    // Only persist these state properties
    objects: state.objects,
    viewport: state.viewport,
    showSplash: state.showSplash,
    projection: state.projection,
    isCameraView: state.isCameraView,
    savedCameraState: state.savedCameraState,
    zoomLevel: state.zoomLevel,
    zoomSpeed: state.zoomSpeed,
    movementSpeed: state.movementSpeed,
  }),
}));
