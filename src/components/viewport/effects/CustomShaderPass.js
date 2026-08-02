"use client";

import React, { forwardRef, useMemo, useEffect } from 'react';
import { Effect } from 'postprocessing';
import * as THREE from 'three';

const defaultVertex = `
void mainSupport(const in vec2 uv) {}
`;

class CustomEffectImpl extends Effect {
  constructor({ vertexShader, fragmentShader, uniforms = {} } = {}) {
    const parsedUniforms = new Map();
    
    // Parse uniforms to THREE.Uniform
    Object.entries(uniforms).forEach(([key, param]) => {
      let val = param;
      if (param && param.type === 'color') {
        val = new THREE.Color(param.value);
      } else if (param && param.value !== undefined) {
        val = param.value;
      }
      parsedUniforms.set(key, new THREE.Uniform(val));
    });

    super('CustomEffect', fragmentShader, {
      vertexShader: vertexShader || defaultVertex,
      uniforms: parsedUniforms,
    });
  }
  
  update(renderer, inputBuffer, deltaTime) {
    if (this.uniforms.has('time')) {
      this.uniforms.get('time').value += deltaTime;
    }
  }
}

export const CustomShaderPass = forwardRef(function CustomShaderPass({ vertexShader, fragmentShader, uniforms, ...props }, ref) {
  const effect = useMemo(() => {
    try {
      return new CustomEffectImpl({ vertexShader, fragmentShader, uniforms });
    } catch (e) {
      console.error("Custom Shader Compilation Error:", e);
      // Fallback pass if it crashes
      return new CustomEffectImpl({ 
        fragmentShader: `void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) { outputColor = inputColor; }`
      });
    }
  }, [vertexShader, fragmentShader]); // Only recreate when shader code changes
  
  // Update uniforms dynamically without recreating the shader
  useEffect(() => {
    if (!effect) return;
    Object.entries(uniforms || {}).forEach(([k, param]) => {
      if (effect.uniforms.has(k) && k !== 'time') { // don't override internal time
        let val = param;
        if (param && param.type === 'color') val = new THREE.Color(param.value);
        else if (param && param.value !== undefined) val = param.value;
        effect.uniforms.get(k).value = val;
      }
    });
  }, [effect, uniforms]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});
