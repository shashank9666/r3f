"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Globe } from 'lucide-react';

export default function WorldProperties() {
  const worldSettings = useStore(state => state.worldSettings);
  const updateWorldSettings = useStore(state => state.updateWorldSettings);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-red-400">
        <Globe size={16} />
        <span>World Properties</span>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Surface</div>
        <div className="p-3 flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Background</span>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={worldSettings.backgroundColor} 
                onChange={(e) => updateWorldSettings({ backgroundColor: e.target.value })}
                className="w-16 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
              />
              <span className="font-mono text-white text-[10px] uppercase w-14">{worldSettings.backgroundColor}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Environment</span>
            <select 
              className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-32"
              value={worldSettings.environment}
              onChange={(e) => updateWorldSettings({ environment: e.target.value })}
            >
              <option value="none">None</option>
              <option value="studio">Studio</option>
              <option value="city">City</option>
              <option value="sunset">Sunset</option>
              <option value="forest">Forest</option>
              <option value="apartment">Apartment</option>
              <option value="dawn">Dawn</option>
              <option value="night">Night</option>
            </select>
          </div>
          
        </div>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={worldSettings.fogEnabled} 
            onChange={(e) => updateWorldSettings({ fogEnabled: e.target.checked })}
            className="accent-[#4772b3]"
          />
          <span>Fog</span>
        </div>
        {worldSettings.fogEnabled && (
          <div className="p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Color</span>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={worldSettings.fogColor} 
                  onChange={(e) => updateWorldSettings({ fogColor: e.target.value })}
                  className="w-16 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex justify-between">
                <span className="text-[#a4a4a4]">Start</span>
                <span className="text-white text-xs">{worldSettings.fogNear.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="1"
                value={worldSettings.fogNear}
                onChange={(e) => updateWorldSettings({ fogNear: parseFloat(e.target.value) })}
                className="w-full accent-[#4772b3]"
              />
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex justify-between">
                <span className="text-[#a4a4a4]">Depth</span>
                <span className="text-white text-xs">{worldSettings.fogFar.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="10" max="500" step="1"
                value={worldSettings.fogFar}
                onChange={(e) => updateWorldSettings({ fogFar: parseFloat(e.target.value) })}
                className="w-full accent-[#4772b3]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Viewport Settings</div>
        <div className="p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Show Grid</span>
            <input 
              type="checkbox" 
              checked={worldSettings.showGrid} 
              onChange={(e) => updateWorldSettings({ showGrid: e.target.checked })}
              className="accent-[#4772b3]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
