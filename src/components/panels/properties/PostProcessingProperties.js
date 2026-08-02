"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Wand2, RotateCcw } from 'lucide-react';

export default function PostProcessingProperties() {
  const settings = useStore(state => state.postProcessingSettings);
  const updateSettings = useStore(state => state.updatePostProcessingSettings);
  const resetSettings = useStore(state => state.resetPostProcessingSettings);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2 border-b border-[#1d1d1d] pb-2">
        <div className="flex items-center gap-2 font-semibold text-[13px] text-blue-400">
          <Wand2 size={16} />
          <span>Post Processing</span>
        </div>
        <button 
          onClick={resetSettings}
          title="Reset to Default"
          className="p-1 hover:bg-[#383838] text-[#a4a4a4] hover:text-white rounded transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={settings.enabled} 
            onChange={(e) => updateSettings({ enabled: e.target.checked })}
            className="accent-[#4772b3]"
          />
          <span>Enable Effects Pipeline</span>
        </div>
      </div>

      {settings.enabled && (
        <>
          {/* Bloom */}
          <div className="bg-[#303030] rounded border border-[#1d1d1d]">
            <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={settings.bloomEnabled} 
                onChange={(e) => updateSettings({ bloomEnabled: e.target.checked })}
                className="accent-[#4772b3]"
              />
              <span>Bloom</span>
            </div>
            {settings.bloomEnabled && (
              <div className="p-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Intensity</span>
                    <span className="text-white text-xs">{settings.bloomIntensity.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" step="0.1"
                    value={settings.bloomIntensity}
                    onChange={(e) => updateSettings({ bloomIntensity: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
                
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Luminance Threshold</span>
                    <span className="text-white text-xs">{settings.bloomLuminanceThreshold.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05"
                    value={settings.bloomLuminanceThreshold}
                    onChange={(e) => updateSettings({ bloomLuminanceThreshold: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Smoothing</span>
                    <span className="text-white text-xs">{settings.bloomLuminanceSmoothing.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.005"
                    value={settings.bloomLuminanceSmoothing}
                    onChange={(e) => updateSettings({ bloomLuminanceSmoothing: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Vignette */}
          <div className="bg-[#303030] rounded border border-[#1d1d1d]">
            <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={settings.vignetteEnabled} 
                onChange={(e) => updateSettings({ vignetteEnabled: e.target.checked })}
                className="accent-[#4772b3]"
              />
              <span>Vignette</span>
            </div>
            {settings.vignetteEnabled && (
              <div className="p-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Offset</span>
                    <span className="text-white text-xs">{settings.vignetteOffset.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05"
                    value={settings.vignetteOffset}
                    onChange={(e) => updateSettings({ vignetteOffset: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
                
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Darkness</span>
                    <span className="text-white text-xs">{settings.vignetteDarkness.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05"
                    value={settings.vignetteDarkness}
                    onChange={(e) => updateSettings({ vignetteDarkness: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Depth of Field */}
          <div className="bg-[#303030] rounded border border-[#1d1d1d]">
            <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={settings.dofEnabled} 
                onChange={(e) => updateSettings({ dofEnabled: e.target.checked })}
                className="accent-[#4772b3]"
              />
              <span>Depth of Field</span>
            </div>
            {settings.dofEnabled && (
              <div className="p-3 flex flex-col gap-3">
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Focus Distance</span>
                    <span className="text-white text-xs">{settings.dofFocusDistance.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.001"
                    value={settings.dofFocusDistance}
                    onChange={(e) => updateSettings({ dofFocusDistance: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
                
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Focal Length</span>
                    <span className="text-white text-xs">{settings.dofFocalLength.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.001"
                    value={settings.dofFocalLength}
                    onChange={(e) => updateSettings({ dofFocalLength: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
                
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Bokeh Scale</span>
                    <span className="text-white text-xs">{settings.dofBokehScale.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="10" step="0.1"
                    value={settings.dofBokehScale}
                    onChange={(e) => updateSettings({ dofBokehScale: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
