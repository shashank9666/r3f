"use client";

/**
 * Material renderer for mesh objects: one of the catalog materials (three
 * built-ins or drei shader materials) plus any enabled add-ons that live inside
 * the mesh next to it (Edges, Outlines, Wireframe overlay, ShadowAlpha, maps).
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  MeshDistortMaterial, MeshWobbleMaterial, MeshTransmissionMaterial,
  MeshReflectorMaterial, MeshRefractionMaterial, MeshDiscardMaterial,
  GradientTexture, GradientType, Edges, Outlines, Wireframe, ShadowAlpha,
  useMatcapTexture, useNormalTexture, useTexture, useEnvironment,
} from '@react-three/drei';
import { MATERIAL_MAP, MATERIAL_ADDONS } from '../../../lib/drei/materialCatalog';
import { resolveParams } from '../../../lib/drei/params';

const SIDES = { front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide };

/** Props shared by the three built-ins; drei materials cherry-pick from these. */
function commonProps(p) {
  return {
    wireframe: p.wireframe,
    transparent: p.transparent,
    opacity: p.opacity,
    flatShading: p.flatShading,
    side: SIDES[p.side] ?? THREE.FrontSide,
  };
}

function MatcapMaterial({ p, color }) {
  const [matcap] = useMatcapTexture(p.matcapId, 512);
  return <meshMatcapMaterial matcap={matcap} color={color} {...commonProps(p)} />;
}

function RefractionMaterial({ p }) {
  const envMap = useEnvironment({ preset: p.envPreset });
  return (
    <MeshRefractionMaterial
      envMap={envMap}
      bounces={p.bounces}
      ior={p.ior}
      fresnel={p.fresnel}
      aberrationStrength={p.aberrationStrength}
      fastChroma={p.fastChroma}
      toneMapped={false}
    />
  );
}

function GradientMaterial({ p }) {
  return (
    <meshBasicMaterial {...commonProps(p)}>
      <GradientTexture
        attach="map"
        stops={[0, 0.5, 1]}
        colors={[p.colorA, p.colorB, p.colorC]}
        size={p.gradientSize}
        type={p.gradientType === 'radial' ? GradientType.Radial : GradientType.Linear}
      />
    </meshBasicMaterial>
  );
}

function ColorMapAddon({ p, children }) {
  const map = useTexture(p.map);
  useMemo(() => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(p.repeatX, p.repeatY);
    map.needsUpdate = true;
  }, [map, p.repeatX, p.repeatY]);
  return children(map);
}

function NormalAddon({ p }) {
  const [normalMap] = useNormalTexture(p.normalId, {
    repeat: [p.repeat, p.repeat],
    anisotropy: 8,
  });
  return <primitive attach="normalMap" object={normalMap} />;
}

function Addons({ addons }) {
  return (
    <>
      {MATERIAL_ADDONS.map((addon) => {
        const stored = addons?.[addon.id];
        if (!stored?.enabled) return null;
        const p = resolveParams(addon.params, stored);

        switch (addon.id) {
          case 'edges':
            return <Edges key={addon.id} color={p.color} threshold={p.threshold} lineWidth={p.lineWidth} />;
          case 'outlines':
            return (
              <Outlines
                key={addon.id}
                color={p.color}
                thickness={p.thickness}
                opacity={p.opacity}
                transparent={p.transparent}
                screenspace={p.screenspace}
                angle={p.angle}
              />
            );
          case 'wireframeOverlay':
            return (
              <Wireframe
                key={addon.id}
                stroke={p.stroke}
                thickness={p.thickness}
                fill={p.fillColor}
                fillOpacity={p.fill ? p.fillOpacity : 0}
                dash={p.dash}
                dashRepeats={p.dashRepeats}
                dashLength={p.dashLength}
                colorBackfaces={p.colorBackfaces}
                squeeze={p.squeeze}
              />
            );
          case 'shadowAlpha':
            return <ShadowAlpha key={addon.id} alphaToCoverage={p.alphaToCoverage} />;
          case 'normalTexture':
            return <NormalAddon key={addon.id} p={p} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export default function DreiMaterial({ obj, isSelected, viewportShading }) {
  const materialId = obj.materialType || 'standard';
  const entry = MATERIAL_MAP[materialId] || MATERIAL_MAP.standard;
  const p = resolveParams(entry.params, obj.materialParams);
  const color = obj.color || '#cccccc';
  const emissive = isSelected
    ? { emissive: '#ffaa00', emissiveIntensity: 0.2 }
    : { emissive: '#000000', emissiveIntensity: 0 };

  // Solid/wireframe shading modes override the material, like Blender's viewport
  if (viewportShading === 'wireframe') return <meshBasicMaterial color={color} wireframe />;
  if (viewportShading === 'solid') return <meshLambertMaterial color="#cccccc" {...emissive} />;

  const addons = <Addons addons={obj.materialAddons} />;
  const colorMap = obj.materialAddons?.colorMap;

  const material = (() => {
    switch (materialId) {
      case 'basic':
        return <meshBasicMaterial color={color} {...commonProps(p)}>{addons}</meshBasicMaterial>;
      case 'lambert':
        return <meshLambertMaterial color={color} {...emissive} {...commonProps(p)}>{addons}</meshLambertMaterial>;
      case 'phong':
        return <meshPhongMaterial color={color} shininess={p.shininess} {...emissive} {...commonProps(p)}>{addons}</meshPhongMaterial>;
      case 'physical':
        return (
          <meshPhysicalMaterial
            color={color}
            roughness={p.roughness}
            metalness={p.metalness}
            clearcoat={p.clearcoat}
            clearcoatRoughness={p.clearcoatRoughness}
            iridescence={p.iridescence}
            sheen={p.sheen}
            {...emissive}
            {...commonProps(p)}
          >
            {addons}
          </meshPhysicalMaterial>
        );
      case 'normal':
        return <meshNormalMaterial {...commonProps(p)}>{addons}</meshNormalMaterial>;
      case 'toon':
        return <meshToonMaterial color={color} {...commonProps(p)}>{addons}</meshToonMaterial>;
      case 'matcap':
        return <MatcapMaterial p={p} color={color} />;
      case 'depth':
        return <meshDepthMaterial />;

      case 'distort':
        return (
          <MeshDistortMaterial
            color={color}
            distort={p.distort}
            speed={p.speed}
            radius={p.radius}
            roughness={p.roughness}
            metalness={p.metalness}
            {...commonProps(p)}
          >
            {addons}
          </MeshDistortMaterial>
        );
      case 'wobble':
        return (
          <MeshWobbleMaterial
            color={color}
            factor={p.factor}
            speed={p.speed}
            roughness={p.roughness}
            metalness={p.metalness}
            {...commonProps(p)}
          >
            {addons}
          </MeshWobbleMaterial>
        );
      case 'transmission':
        return (
          <MeshTransmissionMaterial
            color={color}
            samples={p.samples}
            resolution={p.resolution}
            transmission={p.transmission}
            thickness={p.thickness}
            roughness={p.roughness}
            ior={p.ior}
            chromaticAberration={p.chromaticAberration}
            anisotropicBlur={p.anisotropicBlur}
            distortion={p.distortion}
            distortionScale={p.distortionScale}
            temporalDistortion={p.temporalDistortion}
            attenuationDistance={p.attenuationDistance}
            attenuationColor={p.attenuationColor}
            backside={p.backside}
          />
        );
      case 'reflector':
        return (
          <MeshReflectorMaterial
            color={color}
            resolution={p.resolution}
            blur={[p.blurX, p.blurY]}
            mixBlur={p.mixBlur}
            mixStrength={p.mixStrength}
            mixContrast={p.mixContrast}
            depthScale={p.depthScale}
            minDepthThreshold={p.minDepthThreshold}
            maxDepthThreshold={p.maxDepthThreshold}
            distortion={p.distortion}
            mirror={p.mirror ? 1 : 0}
            roughness={p.roughness}
            metalness={p.metalness}
          />
        );
      case 'refraction':
        return <RefractionMaterial p={p} />;
      case 'discard':
        return <MeshDiscardMaterial />;
      case 'gradient':
        return <GradientMaterial p={p} />;

      case 'standard':
      default:
        return (
          <meshStandardMaterial
            color={color}
            roughness={p.roughness ?? 0.5}
            metalness={p.metalness ?? 0}
            {...emissive}
            {...commonProps(p)}
          >
            {addons}
          </meshStandardMaterial>
        );
    }
  })();

  // A color map has to be attached to the resolved material, so clone it in
  if (colorMap?.enabled && colorMap.map) {
    const mapParams = resolveParams(MATERIAL_ADDONS.find((a) => a.id === 'colorMap').params, colorMap);
    return (
      <ColorMapAddon p={mapParams}>
        {(texture) => React.cloneElement(material, { map: texture })}
      </ColorMapAddon>
    );
  }

  return material;
}
