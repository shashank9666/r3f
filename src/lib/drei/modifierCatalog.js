/**
 * Modifiers are drei components that wrap an object's transform group.
 * They stack in the order listed here (outermost first) and are toggled per
 * object from the Modifier Properties tab.
 */

import { num, int, bool, color, select, vec3 } from './params';

export const MODIFIERS = [
  {
    id: 'float',
    label: 'Float',
    params: [
      num('speed', 'Speed', 1, 0, 10, 0.05),
      num('rotationIntensity', 'Rotation Intensity', 1, 0, 10, 0.05),
      num('floatIntensity', 'Float Intensity', 1, 0, 10, 0.05),
      num('rangeMin', 'Range Min', -0.1, -5, 5, 0.01),
      num('rangeMax', 'Range Max', 0.1, -5, 5, 0.01),
    ],
  },
  {
    id: 'billboard',
    label: 'Billboard',
    params: [
      bool('follow', 'Follow', true),
      bool('lockX', 'Lock X', false),
      bool('lockY', 'Lock Y', false),
      bool('lockZ', 'Lock Z', false),
    ],
  },
  {
    id: 'center',
    label: 'Center',
    params: [
      bool('top', 'Top', false),
      bool('bottom', 'Bottom', false),
      bool('left', 'Left', false),
      bool('right', 'Right', false),
      bool('front', 'Front', false),
      bool('back', 'Back', false),
      bool('disableX', 'Disable X', false),
      bool('disableY', 'Disable Y', false),
      bool('disableZ', 'Disable Z', false),
      bool('precise', 'Precise', true),
    ],
  },
  {
    id: 'resize',
    label: 'Resize (fit 1 unit)',
    params: [
      bool('width', 'By Width', false),
      bool('height', 'By Height', false),
      bool('depth', 'By Depth', false),
      bool('precise', 'Precise', true),
    ],
  },
  {
    id: 'bbanchor',
    label: 'BB Anchor',
    params: [vec3('anchor', 'Anchor', [0, 1, 0], 0.1)],
  },
  {
    id: 'screenSpace',
    label: 'Screen Space',
    params: [num('depth', 'Depth', 1, 0.05, 50, 0.05)],
  },
  {
    id: 'screenSizer',
    label: 'Screen Sizer',
    params: [num('scale', 'Pixel Scale', 1, 0.01, 20, 0.01)],
  },
  {
    id: 'caustics',
    label: 'Caustics',
    params: [
      color('color', 'Color', '#ffffff'),
      num('ior', 'IOR', 1.1, 0.1, 3, 0.01),
      num('backsideIOR', 'Backside IOR', 1.1, 0.1, 3, 0.01),
      num('worldRadius', 'World Radius', 0.3, 0.01, 5, 0.005),
      num('intensity', 'Intensity', 0.05, 0, 2, 0.005),
      int('resolution', 'Resolution', 1024, 128, 2048, 128),
      bool('causticsOnly', 'Caustics Only', false),
      bool('backside', 'Backside', false),
      bool('debug', 'Debug', false),
      vec3('lightSource', 'Light Source', [5, 5, -10]),
    ],
  },
  {
    id: 'trail',
    label: 'Trail',
    params: [
      num('width', 'Width', 0.5, 0.01, 10, 0.01),
      int('length', 'Length', 8, 1, 60),
      num('decay', 'Decay', 1, 0.1, 5, 0.05),
      color('color', 'Color', '#ffffff'),
      int('stride', 'Stride', 0, 0, 10),
      int('interval', 'Interval', 1, 1, 10),
    ],
  },
  {
    id: 'maskConsumer',
    label: 'Masked By Stencil',
    params: [
      int('maskId', 'Mask ID', 1, 1, 16),
      bool('invert', 'Invert', false),
    ],
  },
  {
    id: 'helper',
    label: 'Helper',
    params: [
      select('helperType', 'Type', 'box', ['box', 'axes', 'boxOriented', 'grid']),
      color('color', 'Color', '#ffff00'),
      num('size', 'Size', 1, 0.1, 20, 0.1),
    ],
  },
  {
    id: 'detailedCull',
    label: 'Fast Raycast (meshBounds)',
    params: [],
  },
];

export const MODIFIER_MAP = Object.fromEntries(MODIFIERS.map((m) => [m.id, m]));
