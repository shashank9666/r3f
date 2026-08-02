/**
 * Scene-wide drei features. These are singletons rather than scene objects, so
 * they live in `renderFeatures` / `worldFeatures` in the store instead of the
 * object list. Both panels and `Viewport` are driven by these arrays.
 */

import { num, int, bool, color, select, url, vec3 } from './params';

export const ENV_PRESETS = [
  'none', 'apartment', 'city', 'dawn', 'forest', 'lobby',
  'night', 'park', 'studio', 'sunset', 'warehouse',
];

export const RENDER_FEATURES = [
  {
    id: 'caustics',
    label: 'Caustics',
    note: 'Projects light caustics from every scene mesh onto the floor.',
    params: [
      color('color', 'Color', '#ffffff'),
      num('ior', 'IOR', 1.1, 0.1, 3, 0.01),
      num('backsideIOR', 'Backside IOR', 1.1, 0.1, 3, 0.01),
      num('worldRadius', 'World Radius', 0.3, 0.005, 5, 0.005),
      num('intensity', 'Intensity', 0.05, 0, 2, 0.005),
      int('resolution', 'Resolution', 1024, 128, 2048, 128),
      bool('causticsOnly', 'Caustics Only', false),
      bool('backside', 'Backside', false),
      bool('debug', 'Debug', false),
      vec3('lightSource', 'Light Source', [5, 5, -10]),
    ],
  },
  {
    id: 'softShadows',
    label: 'Soft Shadows (PCSS)',
    note: 'Patches global shader chunks — Lambert materials may look different.',
    params: [
      num('size', 'Size', 25, 0, 100, 0.5),
      int('samples', 'Samples', 10, 1, 40),
      num('focus', 'Focus', 0, 0, 2, 0.01),
    ],
  },
  { id: 'bakeShadows', label: 'Bake Shadows', note: 'Renders shadow maps once instead of every frame.', params: [] },
  {
    id: 'bvh',
    label: 'BVH Raycasting',
    note: 'Builds a bounding volume hierarchy for much faster picking.',
    params: [
      bool('firstHitOnly', 'First Hit Only', true),
      int('maxDepth', 'Max Depth', 40, 4, 80),
    ],
  },
  {
    id: 'adaptiveDpr',
    label: 'Adaptive DPR',
    params: [bool('pixelated', 'Pixelated', false)],
  },
  { id: 'adaptiveEvents', label: 'Adaptive Events', params: [] },
  {
    id: 'performanceMonitor',
    label: 'Performance Monitor',
    note: 'Scales resolution automatically when the framerate drops.',
    params: [
      num('minDpr', 'Min DPR', 0.5, 0.25, 2, 0.05),
      num('maxDpr', 'Max DPR', 2, 0.5, 3, 0.05),
      num('step', 'Step', 0.1, 0.01, 1, 0.01),
      num('factor', 'Start Factor', 1, 0, 1, 0.05),
    ],
  },
  { id: 'preload', label: 'Preload All', note: 'Compiles every material up front to avoid first-frame hitches.', params: [] },
  {
    id: 'stats',
    label: 'Stats (r3f)',
    params: [select('corner', 'Corner', 'top-left', ['top-left', 'top-right', 'bottom-left', 'bottom-right'])],
  },
  {
    id: 'statsGl',
    label: 'Stats GL',
    params: [
      int('trackedCalls', 'Tracked Panels', 1, 0, 3),
      select('corner', 'Corner', 'top-right', ['top-left', 'top-right', 'bottom-left', 'bottom-right']),
    ],
  },
  {
    id: 'fisheye',
    label: 'Fisheye',
    note: 'Renders the scene through a cube camera onto a fisheye lens.',
    params: [
      num('zoom', 'Zoom', 1, 0.1, 5, 0.05),
      int('resolution', 'Resolution', 896, 128, 2048, 128),
      int('segments', 'Segments', 64, 8, 256),
    ],
  },
  {
    id: 'asciiRenderer',
    label: 'ASCII Renderer',
    note: 'drei DOM ASCII renderer — replaces the canvas output with text.',
    params: [
      color('fgColor', 'Foreground', '#ffffff'),
      color('bgColor', 'Background', '#000000'),
      { key: 'characters', label: 'Characters', type: 'text', def: ' .:-+*=%@#' },
      num('resolution', 'Resolution', 0.15, 0.05, 1, 0.01),
      bool('invert', 'Invert', true),
    ],
  },
];

export const RENDER_FEATURE_MAP = Object.fromEntries(RENDER_FEATURES.map((f) => [f.id, f]));

export const WORLD_FEATURES = [
  {
    id: 'environment',
    label: 'Environment',
    params: [
      select('preset', 'Preset', 'city', ENV_PRESETS.filter((p) => p !== 'none')),
      url('files', 'Custom HDR/EXR URL', ''),
      select('background', 'Background', 'off', [
        { value: 'off', label: 'Lighting only' },
        { value: 'on', label: 'Show as background' },
        { value: 'only', label: 'Background only' },
      ]),
      num('blur', 'Blur', 0, 0, 1, 0.01),
      num('environmentIntensity', 'Environment Intensity', 1, 0, 5, 0.01),
      num('backgroundIntensity', 'Background Intensity', 1, 0, 5, 0.01),
      num('environmentRotationY', 'Rotation Y', 0, 0, 6.28, 0.01),
      bool('ground', 'Ground Projection', false),
      num('groundRadius', 'Ground Radius', 60, 1, 500, 1),
      num('groundHeight', 'Ground Height', 10, 0.1, 200, 0.5),
      num('groundScale', 'Ground Scale', 100, 1, 1000, 1),
    ],
  },
  {
    id: 'lightformers',
    label: 'Lightformer Rig',
    note: 'Adds a studio rig of drei Lightformers inside the environment.',
    params: [
      num('keyIntensity', 'Key Intensity', 3, 0, 30, 0.1),
      color('keyColor', 'Key Color', '#ffffff'),
      num('fillIntensity', 'Fill Intensity', 1, 0, 30, 0.1),
      color('fillColor', 'Fill Color', '#88ccff'),
      num('rimIntensity', 'Rim Intensity', 2, 0, 30, 0.1),
      color('rimColor', 'Rim Color', '#ffaa66'),
      bool('rotate', 'Rotate Rig', false),
    ],
  },
  {
    id: 'stars',
    label: 'Stars',
    params: [
      num('radius', 'Radius', 100, 1, 1000, 1),
      num('depth', 'Depth', 50, 1, 500, 1),
      int('count', 'Count', 5000, 100, 50000, 100),
      num('factor', 'Factor', 4, 0.1, 20, 0.1),
      num('saturation', 'Saturation', 0, 0, 1, 0.01),
      bool('fade', 'Fade', true),
      num('speed', 'Speed', 1, 0, 10, 0.1),
    ],
  },
  {
    id: 'clouds',
    label: 'Clouds',
    params: [
      int('seed', 'Seed', 1, 0, 999),
      int('segments', 'Segments', 40, 1, 120),
      vec3('bounds', 'Bounds', [20, 2, 20]),
      num('volume', 'Volume', 20, 0.1, 100, 0.5),
      num('opacity', 'Opacity', 0.4, 0, 1, 0.01),
      num('speed', 'Speed', 0.1, 0, 2, 0.01),
      num('growth', 'Growth', 4, 0, 20, 0.1),
      num('fade', 'Fade', 30, 0, 200, 1),
      color('color', 'Color', '#ffffff'),
      num('height', 'Height', 12, -20, 100, 0.5),
    ],
  },
  {
    id: 'sparkles',
    label: 'Sparkles',
    params: [
      int('count', 'Count', 200, 1, 5000),
      num('speed', 'Speed', 0.3, 0, 5, 0.01),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
      color('color', 'Color', '#ffffff'),
      num('size', 'Size', 3, 0.1, 30, 0.1),
      num('scaleUniform', 'Scale', 20, 0.5, 200, 0.5),
      num('noise', 'Noise', 1, 0, 10, 0.1),
    ],
  },
  {
    id: 'cameraShake',
    label: 'Camera Shake',
    params: [
      num('intensity', 'Intensity', 0.5, 0, 2, 0.01),
      num('maxYaw', 'Max Yaw', 0.05, 0, 1, 0.005),
      num('maxPitch', 'Max Pitch', 0.05, 0, 1, 0.005),
      num('maxRoll', 'Max Roll', 0.05, 0, 1, 0.005),
      num('yawFrequency', 'Yaw Frequency', 0.8, 0, 10, 0.05),
      num('pitchFrequency', 'Pitch Frequency', 0.8, 0, 10, 0.05),
      num('rollFrequency', 'Roll Frequency', 0.8, 0, 10, 0.05),
      bool('decay', 'Decay', false),
      num('decayRate', 'Decay Rate', 0.65, 0, 1, 0.01),
    ],
  },
];

export const WORLD_FEATURE_MAP = Object.fromEntries(WORLD_FEATURES.map((f) => [f.id, f]));

/** `{ id: { enabled: false, ...defaults } }` for a feature array. */
export function featureDefaults(features) {
  const out = {};
  for (const feature of features) {
    const entry = { enabled: false };
    for (const field of feature.params) entry[field.key] = field.def;
    out[feature.id] = entry;
  }
  return out;
}
