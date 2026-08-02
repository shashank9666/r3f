/**
 * Post-processing catalog. Array order *is* the composer pass order, so
 * anti-aliasing and tone mapping sit at the end. `EffectsPipeline` renders the
 * enabled entries and `PostProcessingProperties` builds its UI from `params`.
 */

import { num, int, bool, color, select, vec3 } from './params';

export const EFFECTS = [
  {
    id: 'ssao',
    label: 'SSAO',
    params: [
      int('samples', 'Samples', 30, 1, 64),
      int('rings', 'Rings', 4, 1, 16),
      num('radius', 'Radius', 0.1, 0.001, 2, 0.001),
      num('intensity', 'Intensity', 1, 0, 10, 0.05),
      num('luminanceInfluence', 'Luminance Influence', 0.9, 0, 1, 0.01),
      num('bias', 'Bias', 0.025, 0, 1, 0.005),
      num('distanceThreshold', 'Distance Threshold', 0.97, 0, 1, 0.005),
      num('distanceFalloff', 'Distance Falloff', 0.03, 0, 1, 0.005),
    ],
  },
  {
    id: 'n8ao',
    label: 'N8AO (ambient occlusion)',
    params: [
      num('aoRadius', 'AO Radius', 2, 0.05, 20, 0.05),
      num('intensity', 'Intensity', 2, 0, 20, 0.05),
      num('distanceFalloff', 'Distance Falloff', 1, 0, 5, 0.05),
      select('quality', 'Quality', 'medium', ['performance', 'low', 'medium', 'high', 'ultra']),
      color('color', 'Color', '#000000'),
      bool('halfRes', 'Half Resolution', false),
      bool('screenSpaceRadius', 'Screen Space Radius', false),
    ],
  },
  {
    id: 'bloom',
    label: 'Bloom',
    params: [
      num('intensity', 'Intensity', 1.5, 0, 10, 0.05),
      num('luminanceThreshold', 'Luminance Threshold', 0.9, 0, 1, 0.01),
      num('luminanceSmoothing', 'Smoothing', 0.025, 0, 1, 0.005),
      bool('mipmapBlur', 'Mipmap Blur', true),
      num('radius', 'Radius', 0.85, 0, 1, 0.01),
      int('levels', 'Levels', 8, 1, 12),
    ],
  },
  {
    id: 'selectiveBloom',
    label: 'Selective Bloom (selected objects)',
    params: [
      num('intensity', 'Intensity', 2, 0, 20, 0.05),
      num('luminanceThreshold', 'Luminance Threshold', 0.1, 0, 1, 0.01),
      num('luminanceSmoothing', 'Smoothing', 0.2, 0, 1, 0.005),
      bool('mipmapBlur', 'Mipmap Blur', true),
      bool('inverted', 'Inverted', false),
      bool('ignoreBackground', 'Ignore Background', false),
    ],
  },
  {
    id: 'outline',
    label: 'Outline (selected objects)',
    params: [
      num('edgeStrength', 'Edge Strength', 5, 0, 50, 0.1),
      num('pulseSpeed', 'Pulse Speed', 0, 0, 2, 0.01),
      color('visibleEdgeColor', 'Visible Edge', '#ffaa00'),
      color('hiddenEdgeColor', 'Hidden Edge', '#884400'),
      bool('blur', 'Blur', false),
      bool('xRay', 'X-Ray', true),
    ],
  },
  {
    id: 'dof',
    label: 'Depth of Field',
    params: [
      num('focusDistance', 'Focus Distance', 0, 0, 1, 0.001),
      num('focalLength', 'Focal Length', 0.02, 0, 1, 0.001),
      num('bokehScale', 'Bokeh Scale', 2, 0, 20, 0.1),
    ],
  },
  {
    id: 'tiltShift',
    label: 'Tilt Shift',
    params: [
      num('blur', 'Blur', 0.15, 0, 2, 0.01),
      num('taper', 'Taper', 0.5, 0, 2, 0.01),
      num('startX', 'Start X', 0.5, 0, 1, 0.01),
      num('startY', 'Start Y', 0, 0, 1, 0.01),
      num('endX', 'End X', 0.5, 0, 1, 0.01),
      num('endY', 'End Y', 1, 0, 1, 0.01),
      int('samples', 'Samples', 10, 1, 40),
    ],
  },
  {
    id: 'chromaticAberration',
    label: 'Chromatic Aberration',
    params: [
      num('offsetX', 'Offset X', 0.005, -0.05, 0.05, 0.0005),
      num('offsetY', 'Offset Y', 0.005, -0.05, 0.05, 0.0005),
      bool('radialModulation', 'Radial Modulation', false),
      num('modulationOffset', 'Modulation Offset', 0.15, 0, 2, 0.01),
    ],
  },
  {
    id: 'glitch',
    label: 'Glitch',
    params: [
      bool('active', 'Force Active', false),
      select('mode', 'Mode', '1', [
        { value: '0', label: 'Disabled' },
        { value: '1', label: 'Sporadic' },
        { value: '2', label: 'Constant Mild' },
        { value: '3', label: 'Constant Wild' },
      ]),
      num('delayMin', 'Delay Min', 1.5, 0, 20, 0.1),
      num('delayMax', 'Delay Max', 3.5, 0, 20, 0.1),
      num('durationMin', 'Duration Min', 0.6, 0, 10, 0.05),
      num('durationMax', 'Duration Max', 1, 0, 10, 0.05),
      num('strengthMin', 'Strength Min', 0.3, 0, 5, 0.01),
      num('strengthMax', 'Strength Max', 1, 0, 5, 0.01),
      num('ratio', 'Ratio', 0.85, 0, 1, 0.01),
    ],
  },
  {
    id: 'shockWave',
    label: 'Shock Wave',
    params: [
      vec3('position', 'Position', [0, 0, 0]),
      num('speed', 'Speed', 2, 0.1, 20, 0.1),
      num('maxRadius', 'Max Radius', 1, 0.1, 20, 0.1),
      num('waveSize', 'Wave Size', 0.2, 0.01, 5, 0.01),
      num('amplitude', 'Amplitude', 0.05, 0, 2, 0.005),
    ],
  },
  {
    id: 'lensFlare',
    label: 'Lens Flare',
    params: [
      vec3('lensPosition', 'Lens Position', [10, 10, 10]),
      num('glareSize', 'Glare Size', 0.35, 0, 2, 0.01),
      num('flareSize', 'Flare Size', 0.004, 0, 0.05, 0.0005),
      num('flareSpeed', 'Flare Speed', 0.4, 0, 5, 0.01),
      num('haloScale', 'Halo Scale', 0.5, 0, 5, 0.01),
      int('starPoints', 'Star Points', 6, 2, 16),
      color('colorGain', 'Color Gain', '#3c2200'),
      bool('animated', 'Animated', true),
      bool('anamorphic', 'Anamorphic', false),
      bool('secondaryGhosts', 'Secondary Ghosts', true),
      bool('starBurst', 'Star Burst', true),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
    ],
  },
  {
    id: 'godRays',
    label: 'God Rays (from sun position)',
    params: [
      vec3('sunPosition', 'Sun Position', [0, 20, -40]),
      num('sunRadius', 'Sun Radius', 3, 0.1, 30, 0.1),
      color('sunColor', 'Sun Color', '#fff5cc'),
      num('density', 'Density', 0.96, 0, 1, 0.005),
      num('decay', 'Decay', 0.92, 0, 1, 0.005),
      num('weight', 'Weight', 0.4, 0, 2, 0.01),
      num('exposure', 'Exposure', 0.6, 0, 2, 0.01),
      num('clampMax', 'Clamp Max', 1, 0, 1, 0.01),
      int('samples', 'Samples', 60, 8, 200),
    ],
  },
  {
    id: 'brightnessContrast',
    label: 'Brightness / Contrast',
    params: [
      num('brightness', 'Brightness', 0, -1, 1, 0.01),
      num('contrast', 'Contrast', 0, -1, 1, 0.01),
    ],
  },
  {
    id: 'hueSaturation',
    label: 'Hue / Saturation',
    params: [
      num('hue', 'Hue', 0, -3.14, 3.14, 0.01),
      num('saturation', 'Saturation', 0, -1, 1, 0.01),
    ],
  },
  {
    id: 'colorAverage',
    label: 'Color Average (grayscale)',
    params: [num('opacity', 'Opacity', 1, 0, 1, 0.01)],
  },
  {
    id: 'colorDepth',
    label: 'Color Depth',
    params: [int('bits', 'Bits', 16, 1, 32)],
  },
  { id: 'sepia', label: 'Sepia', params: [num('intensity', 'Intensity', 1, 0, 1, 0.01)] },
  {
    id: 'dotScreen',
    label: 'Dot Screen',
    params: [
      num('angle', 'Angle', 1.57, 0, 6.28, 0.01),
      num('scale', 'Scale', 1, 0.1, 10, 0.05),
    ],
  },
  {
    id: 'grid',
    label: 'Grid Overlay',
    params: [
      num('scale', 'Scale', 1, 0.05, 10, 0.05),
      num('lineWidth', 'Line Width', 0, 0, 5, 0.05),
    ],
  },
  {
    id: 'scanline',
    label: 'Scanline',
    params: [
      num('density', 'Density', 1.25, 0.1, 10, 0.05),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
    ],
  },
  {
    id: 'noise',
    label: 'Noise',
    params: [
      num('opacity', 'Opacity', 0.35, 0, 1, 0.01),
      bool('premultiply', 'Premultiply', false),
    ],
  },
  {
    id: 'ascii',
    label: 'ASCII',
    params: [
      { key: 'characters', label: 'Characters', type: 'text', def: ' .:,\'-^*!~=<>+?/[]{}1()|\\_0#$%&@' },
      int('fontSize', 'Font Size', 54, 8, 200),
      int('cellSize', 'Cell Size', 16, 2, 64),
      color('color', 'Color', '#ffffff'),
      bool('invert', 'Invert', false),
    ],
  },
  {
    id: 'pixelation',
    label: 'Pixelation',
    params: [num('granularity', 'Granularity', 5, 1, 60, 1)],
  },
  {
    id: 'depth',
    label: 'Depth Buffer View',
    params: [bool('inverted', 'Inverted', false)],
  },
  {
    id: 'vignette',
    label: 'Vignette',
    params: [
      num('offset', 'Offset', 0.5, 0, 1, 0.01),
      num('darkness', 'Darkness', 0.5, 0, 1, 0.01),
      bool('eskil', 'Eskil', false),
    ],
  },
  {
    id: 'toneMapping',
    label: 'Tone Mapping',
    params: [
      select('mode', 'Mode', '4', [
        { value: '0', label: 'Linear' },
        { value: '1', label: 'Reinhard' },
        { value: '2', label: 'Reinhard 2' },
        { value: '3', label: 'Reinhard 2 Adaptive' },
        { value: '4', label: 'Uncharted 2' },
        { value: '5', label: 'Optimized Cineon' },
        { value: '6', label: 'ACES Filmic' },
        { value: '7', label: 'AgX' },
        { value: '8', label: 'Neutral' },
      ]),
      num('resolution', 'Resolution', 256, 64, 1024, 64),
      num('middleGrey', 'Middle Grey', 0.6, 0, 2, 0.01),
      num('maxLuminance', 'Max Luminance', 16, 1, 64, 0.5),
      num('averageLuminance', 'Average Luminance', 1, 0.01, 10, 0.01),
      num('adaptationRate', 'Adaptation Rate', 1, 0.01, 10, 0.01),
    ],
  },
  { id: 'smaa', label: 'SMAA', params: [] },
  { id: 'fxaa', label: 'FXAA', params: [] },
];

export const EFFECT_MAP = Object.fromEntries(EFFECTS.map((e) => [e.id, e]));
