/**
 * File ▸ Import. Maps a picked file to the drei loader object that can display
 * it (see the "Loaders" group in `objectCatalog`).
 *
 * Files become `blob:` URLs, which only live as long as the page — imported
 * objects are flagged `transientAsset` so the store skips persisting them.
 */

export const IMPORT_ACCEPT =
  '.gltf,.glb,.fbx,.obj,.ktx2,.splat,.svg,.hdr,.exr,' +
  '.png,.jpg,.jpeg,.webp,.avif,.bmp,.gif,' +
  '.mp4,.webm,.ogv,.mov,' +
  '.mp3,.wav,.ogg,.m4a';

const EXTENSION_MAP = {
  gltf: 'GLTF', glb: 'GLTF',
  fbx: 'FBX',
  obj: 'OBJ',
  ktx2: 'KTX2Plane',
  splat: 'Splat',
  svg: 'Svg',
  png: 'TexturePlane', jpg: 'TexturePlane', jpeg: 'TexturePlane',
  webp: 'TexturePlane', avif: 'TexturePlane', bmp: 'TexturePlane', gif: 'TexturePlane',
  mp4: 'VideoPlane', webm: 'VideoPlane', ogv: 'VideoPlane', mov: 'VideoPlane',
  mp3: 'PositionalAudio', wav: 'PositionalAudio', ogg: 'PositionalAudio', m4a: 'PositionalAudio',
  hdr: 'environment', exr: 'environment',
};

/** The catalog param that receives the blob URL, per object type. */
const URL_PARAM = {
  GLTF: 'src', FBX: 'src', OBJ: 'src', KTX2Plane: 'src', Splat: 'src',
  TexturePlane: 'src', VideoPlane: 'src', Svg: 'src', PositionalAudio: 'url',
};

export const extensionOf = (name) => name.split('.').pop()?.toLowerCase() || '';

export function importKindFor(fileName) {
  return EXTENSION_MAP[extensionOf(fileName)] || null;
}

/**
 * Import one file. Returns a short description of what happened so the caller
 * can toast it; `null` means the extension isn't supported.
 */
export function importFile(file, { addObject, updateWorldFeature }) {
  const kind = importKindFor(file.name);
  if (!kind) return null;

  const url = URL.createObjectURL(file);
  const name = file.name.replace(/\.[^.]+$/, '');

  // HDR/EXR are lighting, not geometry — they go straight to the world environment
  if (kind === 'environment') {
    updateWorldFeature('environment', { enabled: true, files: url });
    return `Loaded ${file.name} as the scene environment`;
  }

  addObject(kind, 'drei', {
    name,
    transientAsset: true,
    params: { [URL_PARAM[kind]]: url },
  });
  return `Imported ${file.name}`;
}
