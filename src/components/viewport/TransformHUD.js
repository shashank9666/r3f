"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';

export default function TransformHUD() {
  const transformState = useStore((state) => state.transformState);
  
  if (!transformState.active) return null;
  
  const modeName = transformState.mode === 'translate' ? 'Grab' : 
                   transformState.mode === 'rotate' ? 'Rotate' : 'Scale';
                   
  let constraintText = '';
  if (transformState.axisConstraint) {
    constraintText = ` along global ${transformState.axisConstraint}`;
  } else if (transformState.planeConstraint) {
    constraintText = ` locking global ${transformState.planeConstraint.replace('X','X').replace('Y','Y').replace('Z','Z')} plane`;
  }
  
  const modifiers = [];
  if (transformState.precision) modifiers.push('Precision (Shift)');
  if (transformState.snapping) modifiers.push('Snap (Ctrl)');
  
  return (
    <div className="absolute top-2 left-4 pointer-events-none z-50">
      <div className="bg-[#1e1e1e]/90 text-[#cccccc] text-sm font-sans px-3 py-1.5 rounded flex items-center gap-3">
        {/* We will still show the mode and constraints if they exist, but style them minimally */}
        {modeName && <span className="font-semibold text-white">{modeName}</span>}
        
        {constraintText && (
          <span className="text-[#ffaa00]">{constraintText}</span>
        )}
        
        {transformState.numericBuffer && (
          <span className="text-[#88ff44]"> Value: {transformState.numericBuffer}</span>
        )}

        {/* This will be updated imperatively for performance */}
        <span id="transform-hud-delta" className="text-white tracking-wide">
          {/* Default state before first frame */}
          Dx: 0.0000 m  Dy: 0.0000 m  Dz: 0.0000 m (0.0000 m)
        </span>
        
        {modifiers.length > 0 && (
          <span className="text-[#888888] ml-2">| {modifiers.join(', ')}</span>
        )}
      </div>
    </div>
  );
}
