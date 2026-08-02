/**
 * Material catalog: the built-in three materials plus every drei shader material,
 * and the drei "add-ons" that render *inside* a mesh alongside its material
 * (Edges, Outlines, Wireframe, GradientTexture, matcap/normal texture, ShadowAlpha).
 */

import { num, int, bool, color, select, url } from './params';

const PBR = [
  num('roughness', 'Roughness', 0.5, 0, 1, 0.01),
  num('metalness', 'Metalness', 0, 0, 1, 0.01),
];

const COMMON = [
  bool('wireframe', 'Wireframe', false),
  bool('transparent', 'Transparent', false),
  num('opacity', 'Opacity', 1, 0, 1, 0.01),
  bool('flatShading', 'Flat Shading', false),
  select('side', 'Side', 'front', ['front', 'back', 'double']),
];

export const MATERIALS = [
  { id: 'basic', label: 'Basic (Unlit)', drei: false, params: [...COMMON] },
  { id: 'lambert', label: 'Lambert', drei: false, params: [...COMMON] },
  { id: 'phong', label: 'Phong', drei: false, params: [num('shininess', 'Shininess', 30, 0, 200, 1), ...COMMON] },
  { id: 'standard', label: 'Standard', drei: false, params: [...PBR, ...COMMON] },
  {
    id: 'physical',
    label: 'Physical',
    drei: false,
    params: [
      ...PBR,
      num('clearcoat', 'Clearcoat', 1, 0, 1, 0.01),
      num('clearcoatRoughness', 'Clearcoat Roughness', 0, 0, 1, 0.01),
      num('iridescence', 'Iridescence', 0, 0, 1, 0.01),
      num('sheen', 'Sheen', 0, 0, 1, 0.01),
      ...COMMON,
    ],
  },
  { id: 'normal', label: 'Normal', drei: false, params: [...COMMON] },
  { id: 'toon', label: 'Toon', drei: false, params: [...COMMON] },
  { id: 'matcap', label: 'Matcap', drei: false, params: [int('matcapId', 'Matcap Preset', 111, 0, 640), ...COMMON] },
  { id: 'depth', label: 'Depth', drei: false, params: [] },

  // ------------------------------------------------------ drei materials ----
  {
    id: 'distort',
    label: 'Distort (drei)',
    drei: true,
    params: [
      num('distort', 'Distort', 0.4, 0, 2, 0.01),
      num('speed', 'Speed', 1, 0, 10, 0.05),
      num('radius', 'Radius', 1, 0, 5, 0.01),
      ...PBR,
      ...COMMON,
    ],
  },
  {
    id: 'wobble',
    label: 'Wobble (drei)',
    drei: true,
    params: [
      num('factor', 'Factor', 0.6, 0, 5, 0.01),
      num('speed', 'Speed', 1, 0, 10, 0.05),
      ...PBR,
      ...COMMON,
    ],
  },
  {
    id: 'transmission',
    label: 'Transmission (drei)',
    drei: true,
    params: [
      int('samples', 'Samples', 6, 1, 32),
      int('resolution', 'Resolution', 256, 64, 2048, 64),
      num('transmission', 'Transmission', 1, 0, 1, 0.01),
      num('thickness', 'Thickness', 0.5, 0, 10, 0.01),
      num('roughness', 'Roughness', 0, 0, 1, 0.01),
      num('ior', 'IOR', 1.5, 1, 2.5, 0.01),
      num('chromaticAberration', 'Chromatic Aberration', 0.06, 0, 1, 0.005),
      num('anisotropicBlur', 'Anisotropic Blur', 0.1, 0, 5, 0.01),
      num('distortion', 'Distortion', 0, 0, 5, 0.01),
      num('distortionScale', 'Distortion Scale', 0.3, 0, 5, 0.01),
      num('temporalDistortion', 'Temporal Distortion', 0, 0, 1, 0.01),
      num('attenuationDistance', 'Attenuation Distance', 0.5, 0.01, 20, 0.01),
      color('attenuationColor', 'Attenuation Color', '#ffffff'),
      bool('backside', 'Backside', false),
    ],
  },
  {
    id: 'reflector',
    label: 'Reflector (drei)',
    drei: true,
    params: [
      int('resolution', 'Resolution', 512, 64, 2048, 64),
      num('blurX', 'Blur X', 300, 0, 2000, 10),
      num('blurY', 'Blur Y', 100, 0, 2000, 10),
      num('mixBlur', 'Mix Blur', 1, 0, 10, 0.05),
      num('mixStrength', 'Mix Strength', 20, 0, 100, 0.5),
      num('mixContrast', 'Mix Contrast', 1, 0, 5, 0.05),
      num('depthScale', 'Depth Scale', 1, 0, 10, 0.05),
      num('minDepthThreshold', 'Min Depth', 0.4, 0, 5, 0.01),
      num('maxDepthThreshold', 'Max Depth', 1.4, 0, 10, 0.01),
      num('distortion', 'Distortion', 0, 0, 5, 0.01),
      bool('mirror', 'Mirror', true),
      ...PBR,
    ],
  },
  {
    id: 'refraction',
    label: 'Refraction (drei)',
    drei: true,
    params: [
      select('envPreset', 'Environment', 'city', ['city', 'studio', 'sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'park', 'lobby']),
      int('bounces', 'Bounces', 2, 1, 8),
      num('ior', 'IOR', 2.4, 1, 4, 0.01),
      num('fresnel', 'Fresnel', 0, 0, 5, 0.01),
      num('aberrationStrength', 'Aberration', 0.01, 0, 1, 0.005),
      bool('fastChroma', 'Fast Chroma', false),
    ],
  },
  { id: 'discard', label: 'Discard (drei)', drei: true, params: [] },
  {
    id: 'gradient',
    label: 'Gradient Texture (drei)',
    drei: true,
    params: [
      select('gradientType', 'Type', 'linear', ['linear', 'radial']),
      color('colorA', 'Color A', '#ff0080'),
      color('colorB', 'Color B', '#7928ca'),
      color('colorC', 'Color C', '#00d4ff'),
      int('gradientSize', 'Texture Size', 1024, 64, 2048, 64),
      ...COMMON,
    ],
  },
];

export const MATERIAL_MAP = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));

/**
 * Extras that live *inside* the mesh next to the material. Each is an independent
 * on/off toggle in the Material panel.
 */
export const MATERIAL_ADDONS = [
  {
    id: 'edges',
    label: 'Edges',
    params: [
      color('color', 'Color', '#ffffff'),
      num('threshold', 'Angle Threshold', 15, 0, 90, 1),
      num('lineWidth', 'Line Width', 1, 0.1, 10, 0.1),
    ],
  },
  {
    id: 'outlines',
    label: 'Outlines',
    params: [
      color('color', 'Color', '#000000'),
      num('thickness', 'Thickness', 0.05, 0, 1, 0.005),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
      bool('transparent', 'Transparent', false),
      bool('screenspace', 'Screen Space', false),
      num('angle', 'Angle', 0, 0, 3.14, 0.01),
    ],
  },
  {
    id: 'wireframeOverlay',
    label: 'Wireframe Overlay',
    params: [
      color('stroke', 'Stroke', '#ffffff'),
      num('thickness', 'Thickness', 0.05, 0, 1, 0.005),
      bool('fill', 'Fill', false),
      color('fillColor', 'Fill Color', '#000000'),
      num('fillOpacity', 'Fill Opacity', 0, 0, 1, 0.01),
      bool('dash', 'Dash', false),
      num('dashRepeats', 'Dash Repeats', 4, 1, 40, 1),
      num('dashLength', 'Dash Length', 0.5, 0, 1, 0.01),
      bool('colorBackfaces', 'Color Backfaces', false),
      bool('squeeze', 'Squeeze', false),
    ],
  },
  {
    id: 'shadowAlpha',
    label: 'Shadow Alpha',
    params: [bool('alphaToCoverage', 'Alpha To Coverage', false)],
  },
  {
    id: 'normalTexture',
    label: 'Normal Texture',
    params: [
      int('normalId', 'Preset', 3, 0, 75),
      num('normalScale', 'Scale', 1, 0, 5, 0.05),
      num('repeat', 'Repeat', 4, 0.1, 40, 0.1),
    ],
  },
  {
    id: 'colorMap',
    label: 'Color Map',
    params: [
      url('map', 'Texture URL', ''),
      num('repeatX', 'Repeat X', 1, 0.1, 40, 0.1),
      num('repeatY', 'Repeat Y', 1, 0.1, 40, 0.1),
    ],
  },
];

export const MATERIAL_ADDON_MAP = Object.fromEntries(MATERIAL_ADDONS.map((a) => [a.id, a]));
