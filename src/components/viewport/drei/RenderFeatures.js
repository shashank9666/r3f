"use client";

/**
 * Scene-wide drei render features driven by `state.renderFeatures`.
 *
 * Some are standalone (`RenderFeatureEffects`), some have to wrap the scene
 * graph (`SceneWrappers` — Caustics, BVH, Fisheye, PerformanceMonitor).
 */

import React from 'react';
import { useThree } from '@react-three/fiber';
import {
  SoftShadows, BakeShadows, AdaptiveDpr, AdaptiveEvents, Preload,
  Stats, StatsGl, AsciiRenderer, Bvh, Fisheye, PerformanceMonitor, Caustics,
} from '@react-three/drei';
import { RENDER_FEATURE_MAP } from '../../../lib/drei/featureCatalog';
import { resolveParams } from '../../../lib/drei/params';
import { useStore } from '../../../store/useStore';

const useFeature = (id) => {
  const stored = useStore((state) => state.renderFeatures?.[id]);
  if (!stored?.enabled) return null;
  return resolveParams(RENDER_FEATURE_MAP[id].params, stored);
};

function PerformanceGovernor({ p, children }) {
  const setDpr = useThree((state) => state.setDpr);
  return (
    <PerformanceMonitor
      factor={p.factor}
      step={p.step}
      onChange={({ factor }) => setDpr(p.minDpr + (p.maxDpr - p.minDpr) * factor)}
    >
      {children}
    </PerformanceMonitor>
  );
}

export function RenderFeatureEffects() {
  const softShadows = useFeature('softShadows');
  const bakeShadows = useFeature('bakeShadows');
  const adaptiveDpr = useFeature('adaptiveDpr');
  const adaptiveEvents = useFeature('adaptiveEvents');
  const preload = useFeature('preload');
  const stats = useFeature('stats');
  const statsGl = useFeature('statsGl');
  const ascii = useFeature('asciiRenderer');

  return (
    <>
      {softShadows && <SoftShadows size={softShadows.size} samples={softShadows.samples} focus={softShadows.focus} />}
      {bakeShadows && <BakeShadows />}
      {adaptiveDpr && <AdaptiveDpr pixelated={adaptiveDpr.pixelated} />}
      {adaptiveEvents && <AdaptiveEvents />}
      {preload && <Preload all />}
      {stats && <Stats className={`r3f-stats-${stats.corner}`} />}
      {statsGl && <StatsGl trackGPU className={`r3f-statsgl-${statsGl.corner}`} />}
      {ascii && (
        <AsciiRenderer
          fgColor={ascii.fgColor}
          bgColor={ascii.bgColor}
          characters={ascii.characters}
          resolution={ascii.resolution}
          invert={ascii.invert}
        />
      )}
    </>
  );
}

/** Wraps the scene contents with the features that need to own their children. */
export function SceneWrappers({ children }) {
  const caustics = useFeature('caustics');
  const bvh = useFeature('bvh');
  const fisheye = useFeature('fisheye');
  const perf = useFeature('performanceMonitor');

  let node = children;

  if (caustics) {
    node = (
      <Caustics
        color={caustics.color}
        ior={caustics.ior}
        backsideIOR={caustics.backsideIOR}
        worldRadius={caustics.worldRadius}
        intensity={caustics.intensity}
        resolution={caustics.resolution}
        causticsOnly={caustics.causticsOnly}
        backside={caustics.backside}
        debug={caustics.debug}
        lightSource={caustics.lightSource}
      >
        {node}
      </Caustics>
    );
  }
  if (bvh) {
    node = <Bvh firstHitOnly={bvh.firstHitOnly} maxDepth={bvh.maxDepth}>{node}</Bvh>;
  }
  if (fisheye) {
    node = <Fisheye zoom={fisheye.zoom} resolution={fisheye.resolution} segments={fisheye.segments}>{node}</Fisheye>;
  }
  if (perf) {
    node = <PerformanceGovernor p={perf}>{node}</PerformanceGovernor>;
  }
  return node;
}
