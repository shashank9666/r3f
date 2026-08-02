/**
 * Catalog of every drei component the editor can place in the scene.
 *
 * One entry per addable object: the Add menu builds its submenus from `group`,
 * the Object Data panel builds its controls from `params`, and `DreiObject`
 * renders the matching component. Adding a component to the editor = adding a
 * row here plus a case in `DreiObject`.
 */

import { num, int, bool, color, select, text, url, vec3 } from './params';

export const DREI_GROUPS = [
  'Text',
  'Effects',
  'Shapes',
  'Abstractions',
  'Staging',
  'Performance',
  'Portals',
  'Loaders',
];

const LINE_PARAMS = [
  color('color', 'Color', '#ffaa00'),
  num('lineWidth', 'Line Width', 2, 0.5, 20, 0.5),
  bool('dashed', 'Dashed', false),
  num('dashSize', 'Dash Size', 0.5, 0.05, 5, 0.05),
  num('gapSize', 'Gap Size', 0.2, 0.05, 5, 0.05),
];

export const DREI_OBJECTS = [
  // ---------------------------------------------------------------- Text ----
  {
    id: 'Text',
    label: 'Text (SDF)',
    group: 'Text',
    params: [
      text('content', 'Content', 'Hello'),
      num('fontSize', 'Font Size', 1, 0.05, 20, 0.05),
      color('color', 'Color', '#ffffff'),
      select('anchorX', 'Anchor X', 'center', ['left', 'center', 'right']),
      select('anchorY', 'Anchor Y', 'middle', ['top', 'top-baseline', 'middle', 'bottom-baseline', 'bottom']),
      num('maxWidth', 'Max Width', 0, 0, 50, 0.5),
      num('letterSpacing', 'Letter Spacing', 0, -0.5, 1, 0.01),
      num('lineHeight', 'Line Height', 1, 0.5, 3, 0.05),
      num('outlineWidth', 'Outline Width', 0, 0, 0.5, 0.005),
      color('outlineColor', 'Outline Color', '#000000'),
      bool('billboard', 'Face Camera', false),
    ],
  },
  {
    id: 'Text3D',
    label: 'Text 3D',
    group: 'Text',
    params: [
      text('content', 'Content', 'drei'),
      url('font', 'Typeface JSON', 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'),
      num('size', 'Size', 1, 0.05, 10, 0.05),
      num('height', 'Extrude Depth', 0.2, 0.01, 5, 0.01),
      int('curveSegments', 'Curve Segments', 8, 1, 32),
      bool('bevelEnabled', 'Bevel', true),
      num('bevelThickness', 'Bevel Thickness', 0.02, 0, 0.5, 0.005),
      num('bevelSize', 'Bevel Size', 0.02, 0, 0.5, 0.005),
      int('bevelSegments', 'Bevel Segments', 4, 1, 16),
      color('color', 'Color', '#ffaa00'),
    ],
  },

  // ------------------------------------------------------------- Effects ----
  {
    id: 'Cloud',
    label: 'Cloud',
    group: 'Effects',
    params: [
      int('seed', 'Seed', 1, 0, 999),
      int('segments', 'Segments', 20, 1, 80),
      vec3('bounds', 'Bounds', [6, 1, 1]),
      num('volume', 'Volume', 6, 0.1, 30, 0.1),
      num('opacity', 'Opacity', 0.6, 0, 1, 0.01),
      num('speed', 'Speed', 0.1, 0, 2, 0.01),
      num('growth', 'Growth', 4, 0, 20, 0.1),
      num('fade', 'Fade', 10, 0, 100, 0.5),
      color('color', 'Color', '#ffffff'),
      select('concentrate', 'Concentrate', 'inside', ['random', 'inside', 'outside']),
      int('limit', 'Instance Limit', 200, 10, 2000),
      int('range', 'Visible Range', 100, 1, 2000),
    ],
  },
  {
    id: 'Stars',
    label: 'Stars',
    group: 'Effects',
    params: [
      num('radius', 'Radius', 50, 1, 500, 1),
      num('depth', 'Depth', 50, 1, 500, 1),
      int('count', 'Count', 3000, 100, 20000, 100),
      num('factor', 'Factor', 4, 0.1, 20, 0.1),
      num('saturation', 'Saturation', 0, 0, 1, 0.01),
      bool('fade', 'Fade', true),
      num('speed', 'Speed', 1, 0, 10, 0.1),
    ],
  },
  {
    id: 'Sparkles',
    label: 'Sparkles',
    group: 'Effects',
    params: [
      int('count', 'Count', 100, 1, 2000, 1),
      num('speed', 'Speed', 0.3, 0, 5, 0.01),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
      color('color', 'Color', '#ffffff'),
      num('size', 'Size', 2, 0.1, 20, 0.1),
      num('scaleUniform', 'Scale', 4, 0.1, 50, 0.1),
      num('noise', 'Noise', 1, 0, 10, 0.1),
    ],
  },
  {
    id: 'Trail',
    label: 'Trail',
    group: 'Effects',
    params: [
      num('width', 'Width', 1, 0.05, 10, 0.05),
      int('length', 'Length', 8, 1, 60),
      num('decay', 'Decay', 1, 0.1, 5, 0.05),
      color('color', 'Color', '#ff88cc'),
      int('stride', 'Stride', 0, 0, 10),
      int('interval', 'Interval', 1, 1, 10),
      num('orbitRadius', 'Orbit Radius', 2, 0.1, 20, 0.1),
      num('orbitSpeed', 'Orbit Speed', 1, 0, 10, 0.05),
    ],
  },
  {
    id: 'SpriteAnimator',
    label: 'Sprite Animator',
    group: 'Effects',
    params: [
      url('textureImageURL', 'Sprite Sheet URL', ''),
      url('textureDataURL', 'Sprite JSON URL', ''),
      int('numberOfFrames', 'Frames', 16, 1, 512),
      int('fps', 'FPS', 12, 1, 120),
      int('startFrame', 'Start Frame', 0, 0, 512),
      int('endFrame', 'End Frame', 0, 0, 512),
      bool('loop', 'Loop', true),
      bool('autoPlay', 'Auto Play', true),
      bool('asSprite', 'As Sprite', true),
      bool('flipX', 'Flip X', false),
      num('alphaTest', 'Alpha Test', 0.01, 0, 1, 0.01),
    ],
  },
  {
    id: 'MarchingCubes',
    label: 'Marching Cubes',
    group: 'Effects',
    params: [
      int('resolution', 'Resolution', 48, 8, 128),
      int('maxPolyCount', 'Max Polys', 20000, 1000, 200000, 1000),
      int('ballCount', 'Metaballs', 6, 1, 40),
      num('strength', 'Strength', 0.5, 0.01, 3, 0.01),
      num('subtract', 'Subtract', 12, 1, 50, 0.5),
      num('speed', 'Speed', 0.5, 0, 5, 0.05),
      color('color', 'Color', '#88ccff'),
      num('roughness', 'Roughness', 0.1, 0, 1, 0.01),
      num('metalness', 'Metalness', 0.6, 0, 1, 0.01),
    ],
  },
  {
    id: 'Splat',
    label: 'Gaussian Splat',
    group: 'Effects',
    params: [
      url('src', 'Splat URL (.splat)', ''),
      num('alphaTest', 'Alpha Test', 0, 0, 1, 0.01),
      bool('alphaHash', 'Alpha Hash', false),
      bool('toneMapped', 'Tone Mapped', false),
      int('chunkSize', 'Chunk Size', 25000, 1000, 100000, 1000),
    ],
  },
  {
    id: 'Example',
    label: 'Example (drei demo)',
    group: 'Effects',
    params: [color('color', 'Color', '#cc3333'), num('bevelSize', 'Bevel Size', 0.05, 0, 0.5, 0.005)],
  },

  // -------------------------------------------------------------- Shapes ----
  {
    id: 'RoundedBox',
    label: 'Rounded Box',
    group: 'Shapes',
    params: [
      num('width', 'Width', 2, 0.05, 20, 0.05),
      num('height', 'Height', 2, 0.05, 20, 0.05),
      num('depth', 'Depth', 2, 0.05, 20, 0.05),
      num('radius', 'Corner Radius', 0.2, 0.001, 2, 0.005),
      int('smoothness', 'Smoothness', 4, 1, 16),
      int('bevelSegments', 'Bevel Segments', 4, 0, 16),
      num('creaseAngle', 'Crease Angle', 0.4, 0, 3.14, 0.01),
      color('color', 'Color', '#cccccc'),
    ],
  },
  {
    id: 'ScreenQuad',
    label: 'Screen Quad',
    group: 'Shapes',
    params: [color('color', 'Color', '#224466')],
  },
  {
    id: 'Line',
    label: 'Line',
    group: 'Shapes',
    params: [
      select('shape', 'Shape', 'zigzag', ['zigzag', 'circle', 'helix', 'square']),
      int('segments', 'Segments', 64, 3, 512),
      num('radius', 'Radius', 2, 0.1, 20, 0.1),
      ...LINE_PARAMS,
    ],
  },
  {
    id: 'CatmullRomLine',
    label: 'Catmull-Rom Line',
    group: 'Shapes',
    params: [
      bool('closed', 'Closed', false),
      select('curveType', 'Curve Type', 'centripetal', ['centripetal', 'chordal', 'catmullrom']),
      num('tension', 'Tension', 0.5, 0, 1, 0.01),
      int('segments', 'Segments', 40, 2, 400),
      ...LINE_PARAMS,
    ],
  },
  {
    id: 'CubicBezierLine',
    label: 'Cubic Bezier Line',
    group: 'Shapes',
    params: [
      vec3('start', 'Start', [-2, 0, 0]),
      vec3('midA', 'Handle A', [-1, 2, 0]),
      vec3('midB', 'Handle B', [1, -2, 0]),
      vec3('end', 'End', [2, 0, 0]),
      int('segments', 'Segments', 40, 2, 400),
      ...LINE_PARAMS,
    ],
  },
  {
    id: 'QuadraticBezierLine',
    label: 'Quadratic Bezier Line',
    group: 'Shapes',
    params: [
      vec3('start', 'Start', [-2, 0, 0]),
      vec3('mid', 'Handle', [0, 2, 0]),
      vec3('end', 'End', [2, 0, 0]),
      int('segments', 'Segments', 40, 2, 400),
      ...LINE_PARAMS,
    ],
  },
  {
    id: 'Facemesh',
    label: 'Facemesh',
    group: 'Shapes',
    params: [
      num('depth', 'Depth', 1, 0.1, 5, 0.05),
      color('color', 'Color', '#ccaa88'),
      bool('wireframe', 'Wireframe', true),
      bool('debug', 'Debug Axes', false),
    ],
  },

  // ------------------------------------------------------- Abstractions ----
  {
    id: 'Image',
    label: 'Image',
    group: 'Abstractions',
    params: [
      url('url', 'Image URL', ''),
      num('width', 'Width', 3, 0.1, 30, 0.1),
      num('height', 'Height', 2, 0.1, 30, 0.1),
      num('zoom', 'Zoom', 1, 0.1, 5, 0.01),
      num('radius', 'Corner Radius', 0, 0, 1, 0.01),
      num('grayscale', 'Grayscale', 0, 0, 1, 0.01),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
      bool('transparent', 'Transparent', true),
      color('color', 'Tint', '#ffffff'),
      int('segments', 'Segments', 1, 1, 64),
    ],
  },
  {
    id: 'Svg',
    label: 'SVG',
    group: 'Abstractions',
    params: [
      url('src', 'SVG URL or Markup', ''),
      num('scaleFactor', 'Scale', 0.01, 0.0001, 1, 0.0001),
      bool('skipFill', 'Skip Fill', false),
      bool('skipStrokes', 'Skip Strokes', false),
      bool('doubleSided', 'Double Sided', true),
    ],
  },
  {
    id: 'Decal',
    label: 'Decal on Box',
    group: 'Abstractions',
    params: [
      url('map', 'Decal Texture URL', ''),
      vec3('decalPosition', 'Decal Position', [0, 0, 1]),
      vec3('decalScale', 'Decal Scale', [1, 1, 1]),
      num('decalRotation', 'Decal Rotation', 0, -3.14, 3.14, 0.01),
      bool('debug', 'Debug Box', false),
      color('color', 'Base Color', '#8899aa'),
    ],
  },
  {
    id: 'Billboard',
    label: 'Billboard Label',
    group: 'Abstractions',
    params: [
      text('content', 'Content', 'Billboard'),
      num('fontSize', 'Font Size', 0.6, 0.05, 10, 0.05),
      color('color', 'Color', '#ffffff'),
      bool('follow', 'Follow', true),
      bool('lockX', 'Lock X', false),
      bool('lockY', 'Lock Y', false),
      bool('lockZ', 'Lock Z', false),
    ],
  },
  {
    id: 'Html',
    label: 'HTML Label',
    group: 'Abstractions',
    params: [
      text('content', 'Content', 'HTML annotation'),
      bool('transform', 'Transform (3D)', false),
      bool('occlude', 'Occlude', true),
      bool('center', 'Center', true),
      num('distanceFactor', 'Distance Factor', 10, 1, 100, 0.5),
      color('background', 'Background', '#1d1d1d'),
      color('color', 'Text Color', '#ffffff'),
    ],
  },
  {
    id: 'PositionalAudio',
    label: 'Positional Audio',
    group: 'Abstractions',
    params: [
      url('url', 'Audio URL', ''),
      num('distance', 'Ref Distance', 1, 0.1, 50, 0.1),
      bool('loop', 'Loop', true),
      bool('showHelper', 'Show Speaker', true),
    ],
  },
  {
    id: 'ScreenSpace',
    label: 'Screen Space',
    group: 'Abstractions',
    params: [
      num('depth', 'Depth', 1, 0.1, 20, 0.1),
      text('content', 'Content', 'Screen space'),
      color('color', 'Color', '#ffcc00'),
    ],
  },
  {
    id: 'ScreenSizer',
    label: 'Screen Sizer',
    group: 'Abstractions',
    params: [
      num('scaleFactor', 'Pixel Scale', 1, 0.05, 20, 0.05),
      color('color', 'Color', '#00ccff'),
    ],
  },

  // ------------------------------------------------------------ Staging ----
  {
    id: 'Lightformer',
    label: 'Lightformer',
    group: 'Staging',
    category: 'light',
    params: [
      select('form', 'Form', 'rect', ['circle', 'ring', 'rect', 'plane', 'box']),
      num('intensity', 'Intensity', 2, 0, 50, 0.1),
      color('color', 'Color', '#ffffff'),
      vec3('formScale', 'Scale', [4, 4, 1]),
      bool('target', 'Aim At Origin', true),
      bool('toneMapped', 'Tone Mapped', false),
    ],
  },
  {
    id: 'SpotLightVolume',
    label: 'Volumetric Spot Light',
    group: 'Staging',
    category: 'light',
    params: [
      color('color', 'Color', '#ffffff'),
      num('intensity', 'Intensity', 2, 0, 50, 0.1),
      num('distance', 'Distance', 12, 0.5, 100, 0.5),
      num('angle', 'Angle', 0.4, 0.05, 1.57, 0.01),
      num('attenuation', 'Attenuation', 8, 0.5, 50, 0.5),
      num('anglePower', 'Angle Power', 4, 0.5, 20, 0.1),
      num('radiusTop', 'Radius Top', 0.1, 0.01, 5, 0.01),
      num('radiusBottom', 'Radius Bottom', 4, 0.1, 30, 0.1),
      bool('volumetric', 'Volumetric', true),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
    ],
  },
  {
    id: 'Shadow',
    label: 'Blob Shadow',
    group: 'Staging',
    params: [
      color('color', 'Color', '#000000'),
      num('opacity', 'Opacity', 0.5, 0, 1, 0.01),
      num('colorStop', 'Color Stop', 0, 0, 1, 0.01),
      num('shadowScale', 'Scale', 2, 0.1, 20, 0.1),
      bool('fog', 'Affected By Fog', false),
    ],
  },
  {
    id: 'Backdrop',
    label: 'Backdrop',
    group: 'Staging',
    params: [
      num('floor', 'Floor Bend', 0.25, 0, 2, 0.01),
      int('segments', 'Segments', 20, 2, 100),
      color('color', 'Color', '#353535'),
      num('backdropScale', 'Scale', 10, 0.5, 100, 0.5),
      bool('receiveShadow', 'Receive Shadow', true),
    ],
  },
  {
    id: 'Stage',
    label: 'Stage',
    group: 'Staging',
    params: [
      select('preset', 'Preset', 'rembrandt', ['rembrandt', 'portrait', 'upfront', 'soft']),
      num('intensity', 'Intensity', 0.5, 0, 5, 0.05),
      select('shadowType', 'Shadows', 'contact', ['off', 'contact', 'accumulative']),
      select('environment', 'Environment', 'city', ['none', 'city', 'studio', 'sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'park', 'lobby']),
      bool('adjustCamera', 'Adjust Camera', false),
      color('color', 'Content Color', '#ffaa00'),
    ],
  },

  // -------------------------------------------------------- Performance ----
  {
    id: 'Instances',
    label: 'Instances Grid',
    group: 'Performance',
    params: [
      select('geometry', 'Geometry', 'box', ['box', 'sphere', 'cone', 'torus']),
      int('countX', 'Count X', 8, 1, 60),
      int('countZ', 'Count Z', 8, 1, 60),
      num('spacing', 'Spacing', 1.5, 0.1, 10, 0.1),
      num('itemScale', 'Item Scale', 0.4, 0.01, 5, 0.01),
      color('color', 'Color', '#ff8844'),
      bool('rainbow', 'Rainbow Colors', true),
      num('roughness', 'Roughness', 0.4, 0, 1, 0.01),
      num('metalness', 'Metalness', 0.1, 0, 1, 0.01),
    ],
  },
  {
    id: 'Points',
    label: 'Point Cloud',
    group: 'Performance',
    params: [
      int('count', 'Count', 4000, 10, 200000, 10),
      num('spread', 'Spread', 5, 0.1, 100, 0.1),
      num('size', 'Point Size', 0.08, 0.001, 2, 0.001),
      color('color', 'Color', '#88ccff'),
      bool('sizeAttenuation', 'Size Attenuation', true),
      bool('transparent', 'Transparent', true),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
    ],
  },
  {
    id: 'Segments',
    label: 'Segments Burst',
    group: 'Performance',
    params: [
      int('count', 'Segment Count', 60, 1, 2000),
      num('radius', 'Radius', 3, 0.1, 30, 0.1),
      num('lineWidth', 'Line Width', 1, 0.1, 20, 0.1),
      color('color', 'Color', '#ffffff'),
      color('colorEnd', 'Tip Color', '#ff4488'),
      bool('rainbow', 'Rainbow', false),
    ],
  },
  {
    id: 'Detailed',
    label: 'Detailed (LOD)',
    group: 'Performance',
    params: [
      num('d0', 'LOD 0 Distance', 0, 0, 200, 1),
      num('d1', 'LOD 1 Distance', 15, 0, 200, 1),
      num('d2', 'LOD 2 Distance', 30, 0, 400, 1),
      num('hysteresis', 'Hysteresis', 0, 0, 1, 0.01),
      color('color', 'Color', '#66ddaa'),
      bool('showLevel', 'Color Per Level', true),
    ],
  },
  {
    id: 'Sampler',
    label: 'Surface Sampler',
    group: 'Performance',
    params: [
      select('surface', 'Surface', 'torusKnot', ['torusKnot', 'sphere', 'torus', 'box']),
      int('count', 'Sample Count', 800, 1, 20000, 1),
      num('itemScale', 'Item Scale', 0.06, 0.005, 2, 0.005),
      color('color', 'Color', '#ffdd55'),
      bool('showSurface', 'Show Surface', false),
    ],
  },
  {
    id: 'CurveModifier',
    label: 'Curve Modifier',
    group: 'Performance',
    params: [
      text('content', 'Content', 'along a curve'),
      url('font', 'Typeface JSON', 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'),
      num('size', 'Size', 0.5, 0.05, 5, 0.05),
      num('radius', 'Curve Radius', 3, 0.2, 30, 0.1),
      num('speed', 'Speed', 0.001, 0, 0.05, 0.0005),
      color('color', 'Color', '#ffffff'),
    ],
  },

  // -------------------------------------------------------------- Portals ----
  {
    id: 'MeshPortalMaterial',
    label: 'Portal',
    group: 'Portals',
    params: [
      num('width', 'Width', 2, 0.1, 20, 0.1),
      num('height', 'Height', 3, 0.1, 20, 0.1),
      num('radius', 'Corner Radius', 0.15, 0.001, 2, 0.005),
      num('blend', 'Blend', 0, 0, 1, 0.01),
      num('blur', 'Blur', 0, 0, 1, 0.01),
      int('resolution', 'Resolution', 512, 64, 2048, 64),
      color('background', 'Inner Background', '#204060'),
      color('innerColor', 'Inner Object', '#ffaa00'),
    ],
  },
  {
    id: 'RenderTexture',
    label: 'Render Texture',
    group: 'Portals',
    params: [
      num('width', 'Width', 3, 0.1, 20, 0.1),
      num('height', 'Height', 2, 0.1, 20, 0.1),
      text('content', 'Content', 'render'),
      color('background', 'Background', '#3366aa'),
      color('color', 'Text Color', '#ffffff'),
      int('resolution', 'Resolution', 1024, 64, 2048, 64),
      num('spin', 'Spin Speed', 1, 0, 10, 0.05),
    ],
  },
  {
    id: 'RenderCubeTexture',
    label: 'Render Cube Texture',
    group: 'Portals',
    params: [
      num('radius', 'Radius', 1, 0.1, 10, 0.05),
      color('background', 'Background', '#332244'),
      color('innerColor', 'Inner Object', '#ff6688'),
      int('resolution', 'Resolution', 256, 32, 1024, 32),
      num('roughness', 'Roughness', 0, 0, 1, 0.01),
      num('metalness', 'Metalness', 1, 0, 1, 0.01),
    ],
  },
  {
    id: 'Mask',
    label: 'Stencil Mask',
    group: 'Portals',
    params: [
      int('maskId', 'Mask ID', 1, 1, 16),
      num('innerRadius', 'Inner Radius', 0, 0, 5, 0.05),
      num('outerRadius', 'Outer Radius', 1.5, 0.05, 10, 0.05),
      bool('invert', 'Invert', false),
      color('color', 'Masked Color', '#ff5522'),
    ],
  },
  {
    id: 'Hud',
    label: 'HUD Layer',
    group: 'Portals',
    params: [
      int('renderPriority', 'Render Priority', 1, 1, 10),
      text('content', 'Content', 'HUD'),
      color('color', 'Color', '#00ff88'),
      num('size', 'Size', 0.5, 0.05, 5, 0.05),
      vec3('hudPosition', 'HUD Position', [0, 0, 0]),
    ],
  },

  // -------------------------------------------------------------- Loaders ----
  // These are produced by File ▸ Import rather than the Add menu.
  {
    id: 'GLTF',
    label: 'glTF Model',
    group: 'Loaders',
    hidden: true,
    params: [
      url('src', 'Source URL', ''),
      num('modelScale', 'Scale', 1, 0.001, 100, 0.001),
      bool('castShadow', 'Cast Shadow', true),
      bool('receiveShadow', 'Receive Shadow', true),
      bool('playAnimation', 'Play Animation', true),
      int('animationIndex', 'Animation Index', 0, 0, 32),
    ],
  },
  {
    id: 'FBX',
    label: 'FBX Model',
    group: 'Loaders',
    hidden: true,
    params: [
      url('src', 'Source URL', ''),
      num('modelScale', 'Scale', 0.01, 0.0001, 100, 0.0001),
      bool('castShadow', 'Cast Shadow', true),
      bool('receiveShadow', 'Receive Shadow', true),
    ],
  },
  {
    id: 'OBJ',
    label: 'OBJ Model',
    group: 'Loaders',
    hidden: true,
    params: [
      url('src', 'Source URL', ''),
      num('modelScale', 'Scale', 1, 0.001, 100, 0.001),
      color('color', 'Color', '#cccccc'),
    ],
  },
  {
    id: 'TexturePlane',
    label: 'Texture Plane',
    group: 'Loaders',
    hidden: true,
    params: [
      url('src', 'Texture URL', ''),
      num('width', 'Width', 3, 0.1, 30, 0.1),
      num('height', 'Height', 3, 0.1, 30, 0.1),
      bool('transparent', 'Transparent', true),
      num('opacity', 'Opacity', 1, 0, 1, 0.01),
      bool('useAspect', 'Fit Aspect', true),
    ],
  },
  {
    id: 'KTX2Plane',
    label: 'KTX2 Texture Plane',
    group: 'Loaders',
    hidden: true,
    params: [
      url('src', 'KTX2 URL', ''),
      num('width', 'Width', 3, 0.1, 30, 0.1),
      num('height', 'Height', 3, 0.1, 30, 0.1),
    ],
  },
  {
    id: 'VideoPlane',
    label: 'Video Plane',
    group: 'Loaders',
    hidden: true,
    params: [
      url('src', 'Video URL', ''),
      num('width', 'Width', 4, 0.1, 30, 0.1),
      num('height', 'Height', 2.25, 0.1, 30, 0.1),
      bool('loop', 'Loop', true),
      bool('muted', 'Muted', true),
      bool('playing', 'Playing', true),
    ],
  },
  {
    id: 'WebcamPlane',
    label: 'Webcam Plane',
    group: 'Loaders',
    hidden: true,
    params: [
      num('width', 'Width', 4, 0.1, 30, 0.1),
      num('height', 'Height', 2.25, 0.1, 30, 0.1),
    ],
  },
  {
    id: 'ScreenSharePlane',
    label: 'Screen Share Plane',
    group: 'Loaders',
    hidden: true,
    params: [
      num('width', 'Width', 4, 0.1, 30, 0.1),
      num('height', 'Height', 2.25, 0.1, 30, 0.1),
    ],
  },
  {
    id: 'CubeTextureBox',
    label: 'Cube Texture Box',
    group: 'Loaders',
    hidden: true,
    params: [
      url('path', 'Base Path', ''),
      text('files', 'Files (comma separated)', 'px.png,nx.png,py.png,ny.png,pz.png,nz.png'),
      num('boxSize', 'Size', 2, 0.1, 50, 0.1),
      bool('asEnvMap', 'Use As Env Map', true),
    ],
  },
  {
    id: 'TrailTexturePlane',
    label: 'Trail Texture Plane',
    group: 'Loaders',
    hidden: true,
    params: [
      int('size', 'Buffer Size', 64, 16, 512, 16),
      num('radius', 'Brush Radius', 0.3, 0.01, 1, 0.01),
      num('maxAge', 'Max Age', 750, 50, 5000, 50),
      num('interpolate', 'Interpolate', 0, 0, 1, 0.01),
      num('width', 'Width', 5, 0.1, 30, 0.1),
      num('height', 'Height', 5, 0.1, 30, 0.1),
    ],
  },
];

export const DREI_OBJECT_MAP = Object.fromEntries(DREI_OBJECTS.map((o) => [o.id, o]));

export const isDreiObject = (type) => Boolean(DREI_OBJECT_MAP[type]);

/** Add-menu groups, excluding entries only reachable through File ▸ Import. */
export function dreiMenuGroups() {
  const groups = new Map();
  for (const entry of DREI_OBJECTS) {
    if (entry.hidden) continue;
    if (!groups.has(entry.group)) groups.set(entry.group, []);
    groups.get(entry.group).push(entry);
  }
  return [...groups.entries()].map(([group, items]) => ({ group, items }));
}
