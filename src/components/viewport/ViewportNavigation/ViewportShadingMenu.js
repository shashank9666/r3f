"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Circle, CircleDashed, Globe2, Eclipse } from 'lucide-react';

export default function ViewportShadingMenu() {
  const viewportShading = useStore((state) => state.viewportShading);
  const setViewportShading = useStore((state) => state.setViewportShading);

  const MODES = [
    { id: 'wireframe', icon: <CircleDashed size={20} strokeWidth={1.5} />, label: 'Wireframe' },
    { id: 'solid', icon: <Circle size={20} fill="currentColor" strokeWidth={0} />, label: 'Solid' },
    { id: 'material', icon: <Eclipse size={20} strokeWidth={1.5} />, label: 'Material Preview' },
    { id: 'rendered', icon: <Globe2 size={20} strokeWidth={1.5} />, label: 'Rendered' },
  ];

  return (
    <div className="flex items-center bg-[#2d2d2d] rounded overflow-hidden">
      {MODES.map((mode) => {
        const isActive = viewportShading === mode.id;
        return (
          <div
            key={mode.id}
            onClick={() => setViewportShading(mode.id)}
            title={`Viewport Shading: ${mode.label}`}
            className={`
              p-1.5 cursor-pointer transition-colors flex items-center justify-center
              ${isActive ? 'bg-[#4772b3] text-white' : 'text-[#a4a4a4] hover:bg-[#404040] hover:text-white'}
            `}
          >
            {mode.icon}
          </div>
        );
      })}
    </div>
  );
}
