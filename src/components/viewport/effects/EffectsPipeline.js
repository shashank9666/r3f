"use client";

/**
 * The post-processing composer. Passes render in `EFFECTS` order; each one is
 * driven by `state.effects[id]` from the store.
 *
 * Outline and SelectiveBloom read the current selection from the `Selection`
 * provider that wraps the scene in `Viewport`.
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  EffectComposer, Bloom, SelectiveBloom, Outline, DepthOfField, TiltShift2,
  ChromaticAberration, Glitch, ShockWave, LensFlare, GodRays, BrightnessContrast,
  HueSaturation, ColorAverage, ColorDepth, Sepia, DotScreen, Grid, Scanline,
  Noise, ASCII, Pixelation, Depth, Vignette, ToneMapping, SMAA, FXAA, SSAO, N8AO,
} from '@react-three/postprocessing';
import { GlitchMode, BlendFunction, ToneMappingMode, KernelSize } from 'postprocessing';
import { EFFECTS } from '../../../lib/drei/effectCatalog';
import { resolveParams } from '../../../lib/drei/params';
import { useStore } from '../../../store/useStore';

const TONE_MAPPING_MODES = [
  ToneMappingMode.LINEAR,
  ToneMappingMode.REINHARD,
  ToneMappingMode.REINHARD2,
  ToneMappingMode.REINHARD2_ADAPTIVE,
  ToneMappingMode.UNCHARTED2,
  ToneMappingMode.OPTIMIZED_CINEON,
  ToneMappingMode.ACES_FILMIC,
  ToneMappingMode.AGX,
  ToneMappingMode.NEUTRAL,
];

const GLITCH_MODES = [GlitchMode.DISABLED, GlitchMode.SPORADIC, GlitchMode.CONSTANT_MILD, GlitchMode.CONSTANT_WILD];

/** God rays need a real light-source mesh in the scene to sample against. */
function GodRaysPass({ p }) {
  const sunRef = useRef();
  const [sun, setSun] = React.useState(null);
  return (
    <>
      <mesh ref={(el) => { sunRef.current = el; if (el && el !== sun) setSun(el); }} position={p.sunPosition}>
        <sphereGeometry args={[p.sunRadius, 32, 32]} />
        <meshBasicMaterial color={p.sunColor} toneMapped={false} />
      </mesh>
      {sun && (
        <GodRays
          sun={sun}
          density={p.density}
          decay={p.decay}
          weight={p.weight}
          exposure={p.exposure}
          clampMax={p.clampMax}
          samples={p.samples}
          blendFunction={BlendFunction.SCREEN}
          kernelSize={KernelSize.SMALL}
        />
      )}
    </>
  );
}

function Pass({ id, p }) {
  switch (id) {
    case 'ssao':
      return (
        <SSAO
          samples={p.samples}
          rings={p.rings}
          radius={p.radius}
          intensity={p.intensity}
          luminanceInfluence={p.luminanceInfluence}
          bias={p.bias}
          distanceThreshold={p.distanceThreshold}
          distanceFalloff={p.distanceFalloff}
        />
      );
    case 'n8ao':
      return (
        <N8AO
          aoRadius={p.aoRadius}
          intensity={p.intensity}
          distanceFalloff={p.distanceFalloff}
          quality={p.quality}
          color={p.color}
          halfRes={p.halfRes}
          screenSpaceRadius={p.screenSpaceRadius}
        />
      );
    case 'bloom':
      return (
        <Bloom
          intensity={p.intensity}
          luminanceThreshold={p.luminanceThreshold}
          luminanceSmoothing={p.luminanceSmoothing}
          mipmapBlur={p.mipmapBlur}
          radius={p.radius}
          levels={p.levels}
        />
      );
    case 'selectiveBloom':
      return (
        <SelectiveBloom
          intensity={p.intensity}
          luminanceThreshold={p.luminanceThreshold}
          luminanceSmoothing={p.luminanceSmoothing}
          mipmapBlur={p.mipmapBlur}
          inverted={p.inverted}
          ignoreBackground={p.ignoreBackground}
        />
      );
    case 'outline':
      return (
        <Outline
          edgeStrength={p.edgeStrength}
          pulseSpeed={p.pulseSpeed}
          visibleEdgeColor={new THREE.Color(p.visibleEdgeColor).getHex()}
          hiddenEdgeColor={new THREE.Color(p.hiddenEdgeColor).getHex()}
          blur={p.blur}
          xRay={p.xRay}
        />
      );
    case 'dof':
      return <DepthOfField focusDistance={p.focusDistance} focalLength={p.focalLength} bokehScale={p.bokehScale} />;
    case 'tiltShift':
      return (
        <TiltShift2
          blur={p.blur}
          taper={p.taper}
          start={[p.startX, p.startY]}
          end={[p.endX, p.endY]}
          samples={p.samples}
        />
      );
    case 'chromaticAberration':
      return (
        <ChromaticAberration
          offset={[p.offsetX, p.offsetY]}
          radialModulation={p.radialModulation}
          modulationOffset={p.modulationOffset}
        />
      );
    case 'glitch':
      return (
        <Glitch
          active={p.active}
          mode={GLITCH_MODES[Number(p.mode)] ?? GlitchMode.SPORADIC}
          delay={[p.delayMin, p.delayMax]}
          duration={[p.durationMin, p.durationMax]}
          strength={[p.strengthMin, p.strengthMax]}
          ratio={p.ratio}
        />
      );
    case 'shockWave':
      return (
        <ShockWave
          position={new THREE.Vector3(...p.position)}
          speed={p.speed}
          maxRadius={p.maxRadius}
          waveSize={p.waveSize}
          amplitude={p.amplitude}
        />
      );
    case 'lensFlare':
      return (
        <LensFlare
          position={new THREE.Vector3(...p.lensPosition)}
          glareSize={p.glareSize}
          flareSize={p.flareSize}
          flareSpeed={p.flareSpeed}
          haloScale={p.haloScale}
          starPoints={p.starPoints}
          colorGain={new THREE.Color(p.colorGain)}
          animated={p.animated}
          anamorphic={p.anamorphic}
          secondaryGhosts={p.secondaryGhosts}
          starBurst={p.starBurst}
          opacity={p.opacity}
        />
      );
    case 'godRays':
      return <GodRaysPass p={p} />;
    case 'brightnessContrast':
      return <BrightnessContrast brightness={p.brightness} contrast={p.contrast} />;
    case 'hueSaturation':
      return <HueSaturation hue={p.hue} saturation={p.saturation} />;
    case 'colorAverage':
      return <ColorAverage blendFunction={BlendFunction.NORMAL} opacity={p.opacity} />;
    case 'colorDepth':
      return <ColorDepth bits={p.bits} />;
    case 'sepia':
      return <Sepia intensity={p.intensity} />;
    case 'dotScreen':
      return <DotScreen angle={p.angle} scale={p.scale} />;
    case 'grid':
      return <Grid scale={p.scale} lineWidth={p.lineWidth} />;
    case 'scanline':
      return <Scanline density={p.density} opacity={p.opacity} />;
    case 'noise':
      return <Noise opacity={p.opacity} premultiply={p.premultiply} />;
    case 'ascii':
      return <ASCII characters={p.characters} fontSize={p.fontSize} cellSize={p.cellSize} color={p.color} invert={p.invert} />;
    case 'pixelation':
      return <Pixelation granularity={p.granularity} />;
    case 'depth':
      return <Depth inverted={p.inverted} />;
    case 'vignette':
      return <Vignette offset={p.offset} darkness={p.darkness} eskil={p.eskil} />;
    case 'toneMapping':
      return (
        <ToneMapping
          mode={TONE_MAPPING_MODES[Number(p.mode)] ?? ToneMappingMode.ACES_FILMIC}
          resolution={p.resolution}
          middleGrey={p.middleGrey}
          maxLuminance={p.maxLuminance}
          averageLuminance={p.averageLuminance}
          adaptationRate={p.adaptationRate}
        />
      );
    case 'smaa':
      return <SMAA />;
    case 'fxaa':
      return <FXAA />;
    default:
      return null;
  }
}

export default function EffectsPipeline() {
  const enabled = useStore((state) => state.postProcessingSettings.enabled);
  const multisampling = useStore((state) => state.postProcessingSettings.multisampling);
  const effects = useStore((state) => state.effects);

  const active = useMemo(
    () => EFFECTS.filter((e) => effects?.[e.id]?.enabled),
    [effects]
  );

  if (!enabled || active.length === 0) return null;

  return (
    // Keyed on the active set: swapping passes needs a fresh composer
    <EffectComposer
      key={active.map((e) => e.id).join('|')}
      multisampling={multisampling || 0}
      enableNormalPass={active.some((e) => e.id === 'ssao')}
    >
      {active.map((effect) => (
        <Pass key={effect.id} id={effect.id} p={resolveParams(effect.params, effects[effect.id])} />
      ))}
    </EffectComposer>
  );
}
