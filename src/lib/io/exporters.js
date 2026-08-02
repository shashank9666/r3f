/**
 * File ▸ Export. Runs the three-stdlib exporters against the live scene.
 * Loaders are imported on demand so they stay out of the initial bundle.
 */

export const EXPORT_FORMATS = [
  { id: 'gltf', label: 'glTF (.gltf)', extension: 'gltf' },
  { id: 'glb', label: 'glTF Binary (.glb)', extension: 'glb' },
  { id: 'obj', label: 'Wavefront (.obj)', extension: 'obj' },
  { id: 'ply', label: 'Stanford (.ply)', extension: 'ply' },
  { id: 'stl', label: 'Stereolithography (.stl)', extension: 'stl' },
  { id: 'usdz', label: 'USDZ (.usdz)', extension: 'usdz' },
  { id: 'dae', label: 'Collada (.dae)', extension: 'dae' },
];

function download(data, filename, mime) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportScene(scene, formatId, baseName = 'scene') {
  if (!scene) throw new Error('Scene is not ready yet.');
  const stdlib = await import('three-stdlib');

  switch (formatId) {
    case 'gltf':
    case 'glb': {
      const binary = formatId === 'glb';
      const result = await new Promise((resolve, reject) => {
        new stdlib.GLTFExporter().parse(scene, resolve, reject, { binary });
      });
      download(
        binary ? result : JSON.stringify(result, null, 2),
        `${baseName}.${binary ? 'glb' : 'gltf'}`,
        binary ? 'model/gltf-binary' : 'model/gltf+json'
      );
      break;
    }
    case 'obj':
      download(new stdlib.OBJExporter().parse(scene), `${baseName}.obj`, 'text/plain');
      break;
    case 'ply':
      download(new stdlib.PLYExporter().parse(scene, () => {}, {}), `${baseName}.ply`, 'text/plain');
      break;
    case 'stl':
      download(new stdlib.STLExporter().parse(scene), `${baseName}.stl`, 'text/plain');
      break;
    case 'usdz':
      download(
        new Blob([await new stdlib.USDZExporter().parse(scene)], { type: 'application/octet-stream' }),
        `${baseName}.usdz`
      );
      break;
    case 'dae':
      download(new stdlib.ColladaExporter().parse(scene).data, `${baseName}.dae`, 'application/xml');
      break;
    default:
      throw new Error(`Unknown export format: ${formatId}`);
  }
}
