"use client";

/**
 * Object modifiers. `wrapWithModifiers` nests the enabled wrapper components
 * (Float, Billboard, Center, Caustics, ...) around an object's content in
 * catalog order; `ModifierChildren` renders the ones that sit inside the group.
 */

import React from 'react';
import * as THREE from 'three';
import {
  Float, Billboard, Center, Resize, BBAnchor, ScreenSpace, ScreenSizer,
  Caustics, Trail, Helper,
} from '@react-three/drei';
import { MODIFIERS } from '../../../lib/drei/modifierCatalog';
import { resolveParams } from '../../../lib/drei/params';

const HELPERS = {
  box: THREE.BoxHelper,
  axes: THREE.AxesHelper,
  grid: THREE.GridHelper,
  boxHelper: THREE.Box3Helper,
};

export function wrapWithModifiers(modifiers, content) {
  if (!modifiers) return content;

  // Innermost first, so walk the catalog backwards and keep wrapping
  return [...MODIFIERS].reverse().reduce((node, modifier) => {
    const stored = modifiers[modifier.id];
    if (!stored?.enabled || modifier.scope === 'child') return node;
    const p = resolveParams(modifier.params, stored);

    switch (modifier.id) {
      case 'float':
        return (
          <Float
            speed={p.speed}
            rotationIntensity={p.rotationIntensity}
            floatIntensity={p.floatIntensity}
            floatingRange={[p.rangeMin, p.rangeMax]}
          >
            {node}
          </Float>
        );
      case 'billboard':
        return <Billboard follow={p.follow} lockX={p.lockX} lockY={p.lockY} lockZ={p.lockZ}>{node}</Billboard>;
      case 'center':
        return (
          <Center
            top={p.top} bottom={p.bottom} left={p.left} right={p.right}
            front={p.front} back={p.back}
            disableX={p.disableX} disableY={p.disableY} disableZ={p.disableZ}
            precise={p.precise}
          >
            {node}
          </Center>
        );
      case 'resize':
        return <Resize width={p.width} height={p.height} depth={p.depth} precise={p.precise}>{node}</Resize>;
      case 'bbanchor':
        return <BBAnchor anchor={p.anchor}>{node}</BBAnchor>;
      case 'screenSpace':
        return <ScreenSpace depth={p.depth}>{node}</ScreenSpace>;
      case 'screenSizer':
        return <ScreenSizer scale={p.scale}>{node}</ScreenSizer>;
      case 'caustics':
        return (
          <Caustics
            color={p.color}
            ior={p.ior}
            backsideIOR={p.backsideIOR}
            worldRadius={p.worldRadius}
            intensity={p.intensity}
            resolution={p.resolution}
            causticsOnly={p.causticsOnly}
            backside={p.backside}
            debug={p.debug}
            lightSource={p.lightSource}
          >
            {node}
          </Caustics>
        );
      case 'trail':
        return (
          <Trail
            width={p.width}
            length={p.length}
            decay={p.decay}
            color={p.color}
            stride={p.stride}
            interval={p.interval}
            attenuation={(w) => w}
          >
            {node}
          </Trail>
        );
      default:
        return node;
    }
  }, content);
}

export function ModifierChildren({ modifiers }) {
  const stored = modifiers?.helper;
  if (!stored?.enabled) return null;
  const p = resolveParams(MODIFIERS.find((m) => m.id === 'helper').params, stored);
  const HelperClass = HELPERS[p.helperType] || THREE.BoxHelper;

  // Box3Helper takes a Box3, the rest take size/color style args
  if (p.helperType === 'boxHelper') {
    return <Helper type={THREE.Box3Helper} args={[new THREE.Box3(new THREE.Vector3(-p.size, -p.size, -p.size), new THREE.Vector3(p.size, p.size, p.size)), p.color]} />;
  }
  if (p.helperType === 'axes') return <Helper type={THREE.AxesHelper} args={[p.size]} />;
  if (p.helperType === 'grid') return <Helper type={THREE.GridHelper} args={[p.size * 2, 10, p.color, p.color]} />;
  return <Helper type={HelperClass} args={[p.color]} />;
}
