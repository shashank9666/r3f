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
    <div className="absolute top-0 left-0 w-full p-2 pointer-events-none z-50 flex flex-col items-center">
      <div className="bg-[#1d1d1d]/90 text-[#cccccc] text-xs font-mono px-4 py-1.5 rounded-sm border border-[#303030] shadow-lg flex items-center gap-4">
        <span className="font-bold text-white">{modeName}</span>
        
        {constraintText && (
          <span className="text-[#ffaa00]">{constraintText}</span>
        )}
        
        {transformState.numericBuffer && (
          <span className="text-[#88ff44]"> Value: {transformState.numericBuffer}</span>
        )}
        
        {modifiers.length > 0 && (
          <span className="text-[#888888]"> | {modifiers.join(', ')}</span>
        )}
      </div>
    </div>
  );
}
