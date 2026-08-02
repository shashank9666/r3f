"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Camera } from 'lucide-react';

export default function RenderProperties() {
  const renderSettings = useStore(state => state.renderSettings);
  const updateRenderSettings = useStore(state => state.updateRenderSettings);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-white">
        <Camera size={16} />
        <span>Render Properties</span>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Renderer</div>
        <div className="p-3 flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Tone Mapping</span>
            <select 
              className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-32"
              value={renderSettings.toneMapping}
              onChange={(e) => updateRenderSettings({ toneMapping: e.target.value })}
            >
              <option value="NoToneMapping">None</option>
              <option value="LinearToneMapping">Linear</option>
              <option value="ReinhardToneMapping">Reinhard</option>
              <option value="CineonToneMapping">Cineon</option>
              <option value="ACESFilmicToneMapping">ACES Filmic</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between">
              <span className="text-[#a4a4a4]">Exposure</span>
              <span className="text-white text-xs">{renderSettings.exposure.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0.1" max="5" step="0.1"
              value={renderSettings.exposure}
              onChange={(e) => updateRenderSettings({ exposure: parseFloat(e.target.value) })}
              className="w-full accent-[#4772b3]"
            />
          </div>

        </div>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Shadows</div>
        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Enabled</span>
            <input 
              type="checkbox" 
              checked={renderSettings.shadows} 
              onChange={(e) => updateRenderSettings({ shadows: e.target.checked })}
              className="accent-[#4772b3]"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Performance</div>
        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Anti-Aliasing</span>
            <input 
              type="checkbox" 
              checked={renderSettings.antialias} 
              onChange={(e) => updateRenderSettings({ antialias: e.target.checked })}
              className="accent-[#4772b3]"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
