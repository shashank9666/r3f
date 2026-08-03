"use client";

/**
 * Renders one drei catalog object. Every `id` in `lib/drei/objectCatalog` has a
 * case here; params arrive already merged with catalog defaults.
 *
 * Anything that suspends (fonts, textures, models) is fine — `SceneObjects`
 * wraps each object in its own Suspense + error boundary.
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  Text, Text3D, Cloud, Clouds, Stars, Sparkles, Trail, SpriteAnimator,
  MarchingCubes, MarchingCube, Splat, Example, RoundedBox, ScreenQuad,
  Line, CatmullRomLine, CubicBezierLine, QuadraticBezierLine, Facemesh,
  Image as DreiImage, Svg, Decal, Billboard, Html, PositionalAudio,
  ScreenSpace, ScreenSizer, Lightformer, SpotLight, Shadow, Backdrop, Stage,
  Instances, Instance, Points, Point, PointMaterial, Segments, Segment,
  Detailed, Sampler, CurveModifier, MeshPortalMaterial, RenderTexture,
  RenderCubeTexture, Mask, useMask, Hud, PerspectiveCamera,
  useGLTF, useFBX, useTexture, useKTX2, useVideoTexture, useCubeTexture,
  useTrailTexture, useAnimations, useDepthBuffer,
} from '@react-three/drei';
import { DREI_OBJECT_MAP } from '../../../lib/drei/objectCatalog';
import { resolveParams } from '../../../lib/drei/params';

export const DEFAULT_FONT_URL =
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

const SIDES = { front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide };

// ---------------------------------------------------------------- helpers ----

/** Deterministic PRNG so point clouds / samplers stay stable across renders. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shapePoints(shape, segments, radius) {
  const pts = [];
  if (shape === 'circle') {
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(t) * radius, 0, Math.sin(t) * radius]);
    }
  } else if (shape === 'helix') {
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 6;
      pts.push([Math.cos(t) * radius, (i / segments) * radius * 2 - radius, Math.sin(t) * radius]);
    }
  } else if (shape === 'square') {
    const r = radius;
    pts.push([-r, 0, -r], [r, 0, -r], [r, 0, r], [-r, 0, r], [-r, 0, -r]);
  } else {
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * radius * 2 - radius;
      pts.push([x, i % 2 === 0 ? -radius / 3 : radius / 3, 0]);
    }
  }
  return pts;
}

function geometryFor(kind) {
  switch (kind) {
    case 'sphere': return <sphereGeometry args={[0.5, 24, 24]} />;
    case 'cone': return <coneGeometry args={[0.5, 1, 20]} />;
    case 'torus': return <torusGeometry args={[0.4, 0.16, 12, 32]} />;
    default: return <boxGeometry args={[1, 1, 1]} />;
  }
}

function surfaceGeometry(kind) {
  switch (kind) {
    case 'sphere': return <sphereGeometry args={[1.5, 32, 32]} />;
    case 'torus': return <torusGeometry args={[1.4, 0.5, 24, 64]} />;
    case 'box': return <boxGeometry args={[2, 2, 2]} />;
    default: return <torusKnotGeometry args={[1.2, 0.35, 128, 24]} />;
  }
}

// -------------------------------------------------------------- sub-bodies ----

function TrailBody({ p }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * p.orbitSpeed;
    if (ref.current) {
      ref.current.position.set(Math.sin(t) * p.orbitRadius, Math.cos(t) * p.orbitRadius * 0.4, Math.cos(t) * p.orbitRadius);
    }
  });
  return (
    <Trail width={p.width} length={p.length} decay={p.decay} color={p.color} stride={p.stride} interval={p.interval} attenuation={(w) => w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={p.color} toneMapped={false} />
      </mesh>
    </Trail>
  );
}

function MarchingCubesBody({ p }) {
  const balls = useMemo(() => {
    const rand = mulberry32(7);
    return Array.from({ length: p.ballCount }, () => [rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1, rand() * 6]);
  }, [p.ballCount]);
  const refs = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime * p.speed;
    balls.forEach((b, i) => {
      const node = refs.current[i];
      if (!node) return;
      node.position.set(
        Math.sin(t + b[3]) * 0.28 * (1 + b[0]),
        Math.cos(t * 1.1 + b[3]) * 0.28 * (1 + b[1]),
        Math.sin(t * 0.9 + b[3]) * 0.28 * (1 + b[2])
      );
    });
  });
  return (
    <MarchingCubes resolution={p.resolution} maxPolyCount={p.maxPolyCount} enableUvs={false} enableColors>
      <meshStandardMaterial vertexColors roughness={p.roughness} metalness={p.metalness} />
      {balls.map((_, i) => (
        <MarchingCube key={i} ref={(el) => { refs.current[i] = el; }} strength={p.strength} subtract={p.subtract} color={new THREE.Color(p.color)} />
      ))}
    </MarchingCubes>
  );
}

function InstancesBody({ p }) {
  const items = useMemo(() => {
    const out = [];
    const offsetX = ((p.countX - 1) * p.spacing) / 2;
    const offsetZ = ((p.countZ - 1) * p.spacing) / 2;
    for (let x = 0; x < p.countX; x++) {
      for (let z = 0; z < p.countZ; z++) {
        out.push({
          position: [x * p.spacing - offsetX, 0, z * p.spacing - offsetZ],
          color: p.rainbow
            ? `hsl(${Math.round(((x / p.countX) * 0.6 + (z / p.countZ) * 0.4) * 360)}, 70%, 60%)`
            : p.color,
        });
      }
    }
    return out;
  }, [p.countX, p.countZ, p.spacing, p.rainbow, p.color]);

  return (
    <Instances limit={Math.max(items.length, 1)} range={items.length}>
      {geometryFor(p.geometry)}
      <meshStandardMaterial roughness={p.roughness} metalness={p.metalness} />
      {items.map((item, i) => (
        <Instance key={i} position={item.position} color={item.color} scale={p.itemScale} />
      ))}
    </Instances>
  );
}

function PointsBody({ p }) {
  const positions = useMemo(() => {
    const rand = mulberry32(11);
    const arr = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      arr[i * 3] = (rand() - 0.5) * p.spread;
      arr[i * 3 + 1] = (rand() - 0.5) * p.spread;
      arr[i * 3 + 2] = (rand() - 0.5) * p.spread;
    }
    return arr;
  }, [p.count, p.spread]);

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial
        transparent={p.transparent}
        opacity={p.opacity}
        color={p.color}
        size={p.size}
        sizeAttenuation={p.sizeAttenuation}
        depthWrite={false}
      />
    </Points>
  );
}

function SegmentsBody({ p }) {
  const items = useMemo(() => {
    const rand = mulberry32(23);
    return Array.from({ length: p.count }, (_, i) => {
      const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
      return {
        start: [0, 0, 0],
        end: dir.multiplyScalar(p.radius * (0.4 + rand() * 0.6)).toArray(),
        color: p.rainbow ? `hsl(${Math.round((i / p.count) * 360)}, 80%, 60%)` : p.colorEnd,
      };
    });
  }, [p.count, p.radius, p.rainbow, p.colorEnd]);

  return (
    <Segments limit={Math.max(items.length, 1)} lineWidth={p.lineWidth}>
      {items.map((s, i) => (
        <Segment key={i} start={s.start} end={s.end} color={s.color} />
      ))}
    </Segments>
  );
}

function DetailedBody({ p }) {
  const levels = [
    { detail: 32, color: p.showLevel ? '#66ddaa' : p.color },
    { detail: 12, color: p.showLevel ? '#ddaa44' : p.color },
    { detail: 5, color: p.showLevel ? '#dd4444' : p.color },
  ];
  return (
    <Detailed distances={[p.d0, p.d1, p.d2]} hysteresis={p.hysteresis}>
      {levels.map((lvl, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, lvl.detail, lvl.detail]} />
          <meshStandardMaterial color={lvl.color} flatShading />
        </mesh>
      ))}
    </Detailed>
  );
}

function SamplerBody({ p }) {
  const meshRef = useRef();
  const instancesRef = useRef();
  return (
    <Sampler count={p.count} mesh={meshRef} instances={instancesRef}>
      <mesh ref={meshRef} visible={p.showSurface}>
        {surfaceGeometry(p.surface)}
        <meshStandardMaterial color="#444444" wireframe />
      </mesh>
      <instancedMesh ref={instancesRef} args={[undefined, undefined, p.count]}>
        <sphereGeometry args={[p.itemScale, 8, 8]} />
        <meshStandardMaterial color={p.color} />
      </instancedMesh>
    </Sampler>
  );
}

function CurveModifierBody({ p }) {
  const flowRef = useRef();
  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * p.radius, Math.sin(t * 2) * p.radius * 0.2, Math.sin(t) * p.radius));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, [p.radius]);

  useFrame(() => flowRef.current?.moveAlongCurve(p.speed));

  return (
    <CurveModifier ref={flowRef} curve={curve}>
      <Text3D font={p.font || DEFAULT_FONT_URL} size={p.size} height={p.size * 0.2}>
        {p.content}
        <meshStandardMaterial color={p.color} />
      </Text3D>
    </CurveModifier>
  );
}

function MaskBody({ p }) {
  const stencil = useMask(p.maskId, p.invert);
  return (
    <>
      <Mask id={p.maskId} position={[0, 0, 0.01]}>
        <ringGeometry args={[p.innerRadius, p.outerRadius, 64]} />
      </Mask>
      <mesh>
        <torusKnotGeometry args={[0.8, 0.25, 128, 24]} />
        <meshStandardMaterial color={p.color} {...stencil} />
      </mesh>
    </>
  );
}

function RenderTextureBody({ p }) {
  const spinRef = useRef();
  useFrame((state, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * p.spin;
  });
  return (
    <mesh>
      <planeGeometry args={[p.width, p.height]} />
      <meshBasicMaterial toneMapped={false}>
        <RenderTexture attach="map" width={p.resolution} height={p.resolution} anisotropy={16}>
          <color attach="background" args={[p.background]} />
          <PerspectiveCamera makeDefault manual aspect={1} position={[0, 0, 5]} />
          <ambientLight intensity={1.5} />
          <group ref={spinRef}>
            <Text fontSize={1.4} color={p.color} anchorX="center" anchorY="middle">
              {p.content}
            </Text>
          </group>
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
}

function RenderCubeTextureBody({ p }) {
  return (
    <mesh>
      <sphereGeometry args={[p.radius, 48, 48]} />
      <meshStandardMaterial roughness={p.roughness} metalness={p.metalness}>
        <RenderCubeTexture attach="envMap" resolution={p.resolution}>
          <color attach="background" args={[p.background]} />
          <ambientLight intensity={1} />
          <mesh position={[0, 0, -3]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshBasicMaterial color={p.innerColor} />
          </mesh>
        </RenderCubeTexture>
      </meshStandardMaterial>
    </mesh>
  );
}

function PortalBody({ p }) {
  return (
    <RoundedBox args={[p.width, p.height, 0.05]} radius={p.radius} smoothness={4}>
      <MeshPortalMaterial blend={p.blend} blur={p.blur} resolution={p.resolution}>
        <color attach="background" args={[p.background]} />
        <ambientLight intensity={1} />
        <directionalLight position={[3, 5, 2]} intensity={1.5} />
        <mesh>
          <torusKnotGeometry args={[0.6, 0.22, 128, 24]} />
          <meshStandardMaterial color={p.innerColor} />
        </mesh>
      </MeshPortalMaterial>
    </RoundedBox>
  );
}

function VolumetricSpotLightBody({ p }) {
  // A real depth buffer is what makes drei's volumetric cone soft-clip on geometry
  const depthBuffer = useDepthBuffer({ frames: 1 });
  return (
    <SpotLight
      depthBuffer={depthBuffer}
      color={p.color}
      intensity={p.intensity}
      distance={p.distance}
      angle={p.angle}
      attenuation={p.attenuation}
      anglePower={p.anglePower}
      radiusTop={p.radiusTop}
      radiusBottom={p.radiusBottom}
      volumetric={p.volumetric}
      opacity={p.opacity}
      castShadow
    />
  );
}

function StageBody({ p }) {
  return (
    <Stage
      preset={p.preset}
      intensity={p.intensity}
      shadows={p.shadowType === 'off' ? false : p.shadowType}
      environment={p.environment === 'none' ? null : p.environment}
      adjustCamera={p.adjustCamera}
    >
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[0.7, 0.25, 128, 24]} />
        <meshStandardMaterial color={p.color} roughness={0.2} metalness={0.6} />
      </mesh>
    </Stage>
  );
}

function DecalBody({ p }) {
  const map = useTexture(p.map);
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={p.color} />
      <Decal
        debug={p.debug}
        position={p.decalPosition}
        rotation={p.decalRotation}
        scale={p.decalScale}
        map={map}
      />
    </mesh>
  );
}

function ImageBody({ p }) {
  return (
    <DreiImage
      url={p.url}
      scale={[p.width, p.height]}
      zoom={p.zoom}
      radius={p.radius}
      grayscale={p.grayscale}
      opacity={p.opacity}
      transparent={p.transparent}
      color={p.color}
      segments={p.segments}
      side={THREE.DoubleSide}
    />
  );
}

function PositionalAudioBody({ p }) {
  return (
    <>
      {p.showHelper && (
        <mesh>
          <coneGeometry args={[0.3, 0.6, 16]} />
          <meshBasicMaterial color="#66ccff" wireframe />
        </mesh>
      )}
      <PositionalAudio url={p.url} distance={p.distance} loop={p.loop} autoplay />
    </>
  );
}

function GltfBody({ p, onPointerDown }) {
  const { scene, animations } = useGLTF(p.src);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const { actions, names } = useAnimations(animations, cloned);

  React.useEffect(() => {
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = p.castShadow;
        child.receiveShadow = p.receiveShadow;
      }
    });
  }, [cloned, p.castShadow, p.receiveShadow]);

  React.useEffect(() => {
    if (!p.playAnimation || !names.length) return undefined;
    const name = names[Math.min(p.animationIndex, names.length - 1)];
    actions[name]?.reset().fadeIn(0.2).play();
    return () => { actions[name]?.fadeOut(0.2).stop(); };
  }, [actions, names, p.playAnimation, p.animationIndex]);

  return <primitive object={cloned} scale={p.modelScale} onPointerDown={onPointerDown} />;
}

function FbxBody({ p, onPointerDown }) {
  const fbx = useFBX(p.src);
  const cloned = useMemo(() => fbx.clone(true), [fbx]);
  const { actions, names } = useAnimations(fbx.animations, cloned);

  React.useEffect(() => {
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = p.castShadow;
        child.receiveShadow = p.receiveShadow;
      }
    });
  }, [cloned, p.castShadow, p.receiveShadow]);

  React.useEffect(() => {
    if (!p.playAnimation || !names.length) return undefined;
    const name = names[Math.min(p.animationIndex, names.length - 1)];
    actions[name]?.reset().fadeIn(0.2).play();
    return () => { actions[name]?.fadeOut(0.2).stop(); };
  }, [actions, names, p.playAnimation, p.animationIndex]);

  return <primitive object={cloned} scale={p.modelScale} onPointerDown={onPointerDown} />;
}

function ObjBody({ p, onPointerDown }) {
  const [object, setObject] = React.useState(null);
  const { src, modelScale: scale, color } = p;
  React.useEffect(() => {
    let cancelled = false;
    import('three-stdlib').then(({ OBJLoader }) => {
      new OBJLoader().load(src, (obj) => {
        if (cancelled) return;
        obj.traverse((child) => {
          if (child.isMesh) child.material = new THREE.MeshStandardMaterial({ color });
        });
        setObject(obj);
      });
    });
    return () => { cancelled = true; };
  }, [src, color]);
  return object ? <primitive object={object} scale={scale} onPointerDown={onPointerDown} /> : null;
}

function TexturePlaneBody({ p }) {
  const texture = useTexture(p.src);
  // Keep the source aspect ratio, driving height from the requested width
  const imgW = texture.image?.width || 1;
  const imgH = texture.image?.height || 1;
  const scale = p.useAspect ? [p.width, (p.width * imgH) / imgW, 1] : [p.width, p.height, 1];
  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent={p.transparent} opacity={p.opacity} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function Ktx2PlaneBody({ p }) {
  const texture = useKTX2(p.src);
  return (
    <mesh>
      <planeGeometry args={[p.width, p.height]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function VideoPlaneBody({ p }) {
  const texture = useVideoTexture(p.src, { loop: p.loop, muted: p.muted, start: p.playing });
  return (
    <mesh>
      <planeGeometry args={[p.width, p.height]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function MediaStreamPlane({ p, kind }) {
  const [stream, setStream] = React.useState(null);
  React.useEffect(() => {
    let active = true;
    let current = null;
    const request = kind === 'webcam'
      ? navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      : navigator.mediaDevices?.getDisplayMedia({ video: true, audio: false });
    request?.then((s) => {
      current = s;
      if (active) setStream(s); else s.getTracks().forEach((t) => t.stop());
    }).catch(() => {});
    return () => {
      active = false;
      current?.getTracks().forEach((t) => t.stop());
    };
  }, [kind]);

  const video = useMemo(() => {
    if (!stream) return null;
    const el = document.createElement('video');
    el.srcObject = stream;
    el.muted = true;
    el.playsInline = true;
    el.play().catch(() => {});
    return el;
  }, [stream]);

  const texture = useMemo(() => (video ? new THREE.VideoTexture(video) : null), [video]);

  return (
    <mesh>
      <planeGeometry args={[p.width, p.height]} />
      <meshBasicMaterial map={texture || undefined} color={texture ? '#ffffff' : '#333333'} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function CubeTextureBoxBody({ p }) {
  const files = p.files.split(',').map((f) => f.trim()).filter(Boolean);
  const texture = useCubeTexture(files, { path: p.path });
  return (
    <mesh>
      <boxGeometry args={[p.boxSize, p.boxSize, p.boxSize]} />
      {p.asEnvMap
        ? <meshStandardMaterial envMap={texture} roughness={0} metalness={1} />
        : <meshBasicMaterial envMap={texture} />}
    </mesh>
  );
}

function TrailTexturePlaneBody({ p }) {
  const [texture, onMove] = useTrailTexture({
    size: p.size,
    radius: p.radius,
    maxAge: p.maxAge,
    interpolate: p.interpolate,
  });
  return (
    <mesh onPointerMove={onMove}>
      <planeGeometry args={[p.width, p.height]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// ------------------------------------------------------------------- body ----

function Body({ type, p }) {
  switch (type) {
    // Text
    case 'Text': {
      const node = (
        <Text
          fontSize={p.fontSize}
          color={p.color}
          anchorX={p.anchorX}
          anchorY={p.anchorY}
          maxWidth={p.maxWidth || undefined}
          letterSpacing={p.letterSpacing}
          lineHeight={p.lineHeight}
          outlineWidth={p.outlineWidth}
          outlineColor={p.outlineColor}
        >
          {p.content}
        </Text>
      );
      return p.billboard ? <Billboard>{node}</Billboard> : node;
    }
    case 'Text3D':
      return (
        <Text3D
          font={p.font || DEFAULT_FONT_URL}
          size={p.size}
          height={p.height}
          curveSegments={p.curveSegments}
          bevelEnabled={p.bevelEnabled}
          bevelThickness={p.bevelThickness}
          bevelSize={p.bevelSize}
          bevelSegments={p.bevelSegments}
        >
          {p.content}
          <meshStandardMaterial color={p.color} />
        </Text3D>
      );

    // Effects
    case 'Cloud':
      return (
        <Clouds material={THREE.MeshLambertMaterial} limit={p.limit} range={p.range}>
          <Cloud
            seed={p.seed}
            segments={p.segments}
            bounds={p.bounds}
            volume={p.volume}
            opacity={p.opacity}
            speed={p.speed}
            growth={p.growth}
            fade={p.fade}
            color={p.color}
            concentrate={p.concentrate}
          />
        </Clouds>
      );
    case 'Stars':
      return <Stars radius={p.radius} depth={p.depth} count={p.count} factor={p.factor} saturation={p.saturation} fade={p.fade} speed={p.speed} />;
    case 'Sparkles':
      return <Sparkles count={p.count} speed={p.speed} opacity={p.opacity} color={p.color} size={p.size} scale={p.scaleUniform} noise={p.noise} />;
    case 'Trail':
      return <TrailBody p={p} />;
    case 'SpriteAnimator':
      return (
        <SpriteAnimator
          textureImageURL={p.textureImageURL || undefined}
          textureDataURL={p.textureDataURL || undefined}
          numberOfFrames={p.numberOfFrames}
          fps={p.fps}
          startFrame={p.startFrame}
          endFrame={p.endFrame || undefined}
          loop={p.loop}
          autoPlay={p.autoPlay}
          asSprite={p.asSprite}
          flipX={p.flipX}
          alphaTest={p.alphaTest}
        />
      );
    case 'MarchingCubes':
      return <MarchingCubesBody p={p} />;
    case 'Splat':
      return <Splat src={p.src} alphaTest={p.alphaTest} alphaHash={p.alphaHash} toneMapped={p.toneMapped} chunkSize={p.chunkSize} />;
    case 'Example':
      return <Example font={DEFAULT_FONT_URL} color={p.color} bevelSize={p.bevelSize} />;

    // Shapes
    case 'RoundedBox':
      return (
        <RoundedBox
          args={[p.width, p.height, p.depth]}
          radius={Math.min(p.radius, Math.min(p.width, p.height, p.depth) / 2 - 0.001)}
          smoothness={p.smoothness}
          bevelSegments={p.bevelSegments}
          creaseAngle={p.creaseAngle}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={p.color} />
        </RoundedBox>
      );
    case 'ScreenQuad':
      return (
        <ScreenQuad>
          <meshBasicMaterial color={p.color} depthWrite={false} />
        </ScreenQuad>
      );
    case 'Line':
      return (
        <Line
          points={shapePoints(p.shape, p.segments, p.radius)}
          color={p.color}
          lineWidth={p.lineWidth}
          dashed={p.dashed}
          dashSize={p.dashSize}
          gapSize={p.gapSize}
        />
      );
    case 'CatmullRomLine':
      return (
        <CatmullRomLine
          points={shapePoints('zigzag', 8, 3)}
          closed={p.closed}
          curveType={p.curveType}
          tension={p.tension}
          segments={p.segments}
          color={p.color}
          lineWidth={p.lineWidth}
          dashed={p.dashed}
          dashSize={p.dashSize}
          gapSize={p.gapSize}
        />
      );
    case 'CubicBezierLine':
      return (
        <CubicBezierLine
          start={p.start}
          midA={p.midA}
          midB={p.midB}
          end={p.end}
          segments={p.segments}
          color={p.color}
          lineWidth={p.lineWidth}
          dashed={p.dashed}
          dashSize={p.dashSize}
          gapSize={p.gapSize}
        />
      );
    case 'QuadraticBezierLine':
      return (
        <QuadraticBezierLine
          start={p.start}
          mid={p.mid}
          end={p.end}
          segments={p.segments}
          color={p.color}
          lineWidth={p.lineWidth}
          dashed={p.dashed}
          dashSize={p.dashSize}
          gapSize={p.gapSize}
        />
      );
    case 'Facemesh':
      return (
        <Facemesh depth={p.depth} debug={p.debug}>
          <meshStandardMaterial color={p.color} wireframe={p.wireframe} side={THREE.DoubleSide} />
        </Facemesh>
      );

    // Abstractions
    case 'Image':
      return p.url ? <ImageBody p={p} /> : <Placeholder label="Set an image URL" />;
    case 'Svg':
      return p.src ? <Svg src={p.src} scale={p.scaleFactor} skipFill={p.skipFill} skipStrokes={p.skipStrokes} fillMaterial={{ side: p.doubleSided ? THREE.DoubleSide : THREE.FrontSide }} /> : <Placeholder label="Set an SVG URL" />;
    case 'Decal':
      return p.map ? <DecalBody p={p} /> : <Placeholder label="Set a decal texture URL" />;
    case 'Billboard':
      return (
        <Billboard follow={p.follow} lockX={p.lockX} lockY={p.lockY} lockZ={p.lockZ}>
          <Text fontSize={p.fontSize} color={p.color} anchorX="center" anchorY="middle">
            {p.content}
          </Text>
        </Billboard>
      );
    case 'Html':
      return (
        <Html transform={p.transform} occlude={p.occlude} center={p.center} distanceFactor={p.transform ? p.distanceFactor : undefined}>
          <div
            style={{
              padding: '4px 10px', borderRadius: 4, whiteSpace: 'nowrap',
              background: p.background, color: p.color, fontSize: 13, fontFamily: 'sans-serif',
              border: '1px solid rgba(255,255,255,0.15)', pointerEvents: 'none', userSelect: 'none',
            }}
          >
            {p.content}
          </div>
        </Html>
      );
    case 'PositionalAudio':
      return p.url ? <PositionalAudioBody p={p} /> : <Placeholder label="Set an audio URL" />;
    case 'ScreenSpace':
      return (
        <ScreenSpace depth={p.depth}>
          <Text fontSize={0.1} color={p.color} anchorX="center" anchorY="middle">{p.content}</Text>
        </ScreenSpace>
      );
    case 'ScreenSizer':
      return (
        <ScreenSizer scale={p.scaleFactor}>
          <mesh>
            <boxGeometry args={[50, 50, 50]} />
            <meshBasicMaterial color={p.color} wireframe />
          </mesh>
        </ScreenSizer>
      );

    // Staging
    case 'Lightformer':
      return (
        <Lightformer
          form={p.form}
          intensity={p.intensity}
          color={p.color}
          scale={p.formScale}
          target={p.target ? [0, 0, 0] : false}
          toneMapped={p.toneMapped}
        />
      );
    case 'SpotLightVolume':
      return <VolumetricSpotLightBody p={p} />;
    case 'Shadow':
      return <Shadow color={p.color} colorStop={p.colorStop} opacity={p.opacity} fog={p.fog} scale={p.shadowScale} rotation={[-Math.PI / 2, 0, 0]} />;
    case 'Backdrop':
      return (
        <Backdrop floor={p.floor} segments={p.segments} scale={p.backdropScale} receiveShadow={p.receiveShadow}>
          <meshStandardMaterial color={p.color} />
        </Backdrop>
      );
    case 'Stage':
      return <StageBody p={p} />;

    // Performance
    case 'Instances': return <InstancesBody p={p} />;
    case 'Points': return <PointsBody p={p} />;
    case 'Segments': return <SegmentsBody p={p} />;
    case 'Detailed': return <DetailedBody p={p} />;
    case 'Sampler': return <SamplerBody p={p} />;
    case 'CurveModifier': return <CurveModifierBody p={p} />;

    // Portals
    case 'MeshPortalMaterial': return <PortalBody p={p} />;
    case 'RenderTexture': return <RenderTextureBody p={p} />;
    case 'RenderCubeTexture': return <RenderCubeTextureBody p={p} />;
    case 'Mask': return <MaskBody p={p} />;
    case 'Hud':
      return (
        <Hud renderPriority={p.renderPriority}>
          <ambientLight intensity={1.5} />
          <group position={p.hudPosition}>
            <Text fontSize={p.size} color={p.color} anchorX="center" anchorY="middle">{p.content}</Text>
          </group>
        </Hud>
      );

    // Loaders
    case 'GLTF': return p.src ? <GltfBody p={p} onPointerDown={onPointerDown} /> : <Placeholder label="No model source" />;
    case 'FBX': return p.src ? <FbxBody p={p} onPointerDown={onPointerDown} /> : <Placeholder label="No model source" />;
    case 'OBJ': return p.src ? <ObjBody p={p} onPointerDown={onPointerDown} /> : <Placeholder label="No model source" />;
    case 'TexturePlane': return p.src ? <TexturePlaneBody p={p} /> : <Placeholder label="No texture source" />;
    case 'KTX2Plane': return p.src ? <Ktx2PlaneBody p={p} /> : <Placeholder label="No KTX2 source" />;
    case 'VideoPlane': return p.src ? <VideoPlaneBody p={p} /> : <Placeholder label="No video source" />;
    case 'WebcamPlane': return <MediaStreamPlane p={p} kind="webcam" />;
    case 'ScreenSharePlane': return <MediaStreamPlane p={p} kind="screen" />;
    case 'CubeTextureBox': return p.path ? <CubeTextureBoxBody p={p} /> : <Placeholder label="No cube texture path" />;
    case 'TrailTexturePlane': return <TrailTexturePlaneBody p={p} />;

    default:
      return <Placeholder label={type} />;
  }
}

function Placeholder({ label }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#666666" wireframe />
      </mesh>
      <Html center distanceFactor={12}>
        <div style={{ color: '#aaa', fontSize: 11, fontFamily: 'sans-serif', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

/** Selection highlight that works for objects with no single mesh of their own. */
function SelectionHalo({ visible }) {
  if (!visible) return null;
  return (
    <mesh raycast={() => null}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshBasicMaterial color="#ffaa00" wireframe transparent opacity={0.35} depthTest={false} />
    </mesh>
  );
}

export default function DreiObject({ obj, isSelected, onPointerDown }) {
  const entry = DREI_OBJECT_MAP[obj.type];
  const p = useMemo(() => resolveParams(entry?.params, obj.params), [entry, obj.params]);

  if (!entry) return null;

  return (
    <group onPointerDown={onPointerDown}>
      <Body type={obj.type} p={p} onPointerDown={onPointerDown} />
      <SelectionHalo visible={isSelected} />
    </group>
  );
}

export { SIDES };
