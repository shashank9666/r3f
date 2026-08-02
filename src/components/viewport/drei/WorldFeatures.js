"use client";

/**
 * Scene-wide drei staging driven by `state.worldFeatures`: Environment (with an
 * optional Lightformer rig), Stars, Clouds, Sparkles and CameraShake.
 */

import React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  Environment, Lightformer, Stars, Cloud, Clouds, Sparkles, CameraShake,
} from '@react-three/drei';
import { WORLD_FEATURE_MAP } from '../../../lib/drei/featureCatalog';
import { resolveParams } from '../../../lib/drei/params';
import { useStore } from '../../../store/useStore';

const useFeature = (id) => {
  const stored = useStore((state) => state.worldFeatures?.[id]);
  if (!stored?.enabled) return null;
  return resolveParams(WORLD_FEATURE_MAP[id].params, stored);
};

function LightformerRig({ p }) {
  const ref = React.useRef();
  useFrame((state, delta) => {
    if (p.rotate && ref.current) ref.current.rotation.y += delta * 0.1;
  });
  return (
    <group ref={ref}>
      <Lightformer form="rect" intensity={p.keyIntensity} color={p.keyColor} scale={[10, 10, 1]} position={[0, 5, -9]} target={[0, 0, 0]} />
      <Lightformer form="circle" intensity={p.fillIntensity} color={p.fillColor} scale={[8, 8, 1]} position={[-10, 2, 0]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={p.rimIntensity} color={p.rimColor} scale={[6, 6, 1]} position={[10, 4, 4]} target={[0, 0, 0]} />
    </group>
  );
}

export default function WorldFeatures() {
  const environment = useFeature('environment');
  const lightformers = useFeature('lightformers');
  const stars = useFeature('stars');
  const clouds = useFeature('clouds');
  const sparkles = useFeature('sparkles');
  const shake = useFeature('cameraShake');

  return (
    <>
      {environment && (
        <Environment
          // A custom HDR/EXR wins over the preset when one is supplied
          {...(environment.files ? { files: environment.files } : { preset: environment.preset })}
          background={environment.background === 'off' ? false : environment.background === 'only' ? 'only' : true}
          blur={environment.blur}
          environmentIntensity={environment.environmentIntensity}
          backgroundIntensity={environment.backgroundIntensity}
          environmentRotation={new THREE.Euler(0, environment.environmentRotationY, 0)}
          backgroundRotation={new THREE.Euler(0, environment.environmentRotationY, 0)}
          ground={environment.ground ? {
            radius: environment.groundRadius,
            height: environment.groundHeight,
            scale: environment.groundScale,
          } : false}
        >
          {lightformers && <LightformerRig p={lightformers} />}
        </Environment>
      )}

      {/* Without an Environment the rig still works as plain emissive geometry */}
      {!environment && lightformers && <LightformerRig p={lightformers} />}

      {stars && (
        <Stars
          radius={stars.radius}
          depth={stars.depth}
          count={stars.count}
          factor={stars.factor}
          saturation={stars.saturation}
          fade={stars.fade}
          speed={stars.speed}
        />
      )}

      {clouds && (
        <Clouds material={THREE.MeshLambertMaterial} limit={400} position={[0, clouds.height, 0]}>
          <Cloud
            seed={clouds.seed}
            segments={clouds.segments}
            bounds={clouds.bounds}
            volume={clouds.volume}
            opacity={clouds.opacity}
            speed={clouds.speed}
            growth={clouds.growth}
            fade={clouds.fade}
            color={clouds.color}
          />
        </Clouds>
      )}

      {sparkles && (
        <Sparkles
          count={sparkles.count}
          speed={sparkles.speed}
          opacity={sparkles.opacity}
          color={sparkles.color}
          size={sparkles.size}
          scale={sparkles.scaleUniform}
          noise={sparkles.noise}
        />
      )}

      {shake && (
        <CameraShake
          intensity={shake.intensity}
          maxYaw={shake.maxYaw}
          maxPitch={shake.maxPitch}
          maxRoll={shake.maxRoll}
          yawFrequency={shake.yawFrequency}
          pitchFrequency={shake.pitchFrequency}
          rollFrequency={shake.rollFrequency}
          decay={shake.decay}
          decayRate={shake.decayRate}
        />
      )}
    </>
  );
}
