"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Globe, RotateCcw } from 'lucide-react';

export default function WorldProperties() {
  const worldSettings = useStore(state => state.worldSettings);
  const updateWorldSettings = useStore(state => state.updateWorldSettings);
  const resetWorldSettings = useStore(state => state.resetWorldSettings);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2 border-b border-[#1d1d1d] pb-2">
        <div className="flex items-center gap-2 font-semibold text-[13px] text-red-400">
          <Globe size={16} />
          <span>World Properties</span>
        </div>
        <button 
          onClick={resetWorldSettings}
          title="Reset to Default"
          className="p-1 hover:bg-[#383838] text-[#a4a4a4] hover:text-white rounded transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Surface</div>
        <div className="p-3 flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Type</span>
            <select 
              className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-32"
              value={worldSettings.backgroundType}
              onChange={(e) => updateWorldSettings({ backgroundType: e.target.value })}
            >
              <option value="color">Color</option>
              <option value="environment">Environment HDRI</option>
              <option value="sky">Procedural Sky</option>
            </select>
          </div>

          {worldSettings.backgroundType === 'color' && (
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Color</span>
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
          )}

          {worldSettings.backgroundType === 'environment' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#a4a4a4]">Preset</span>
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

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">Intensity</span>
                  <span className="text-white text-xs">{worldSettings.environmentIntensity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1"
                  value={worldSettings.environmentIntensity}
                  onChange={(e) => updateWorldSettings({ environmentIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-[#4772b3]"
                />
              </div>
              
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">Blur</span>
                  <span className="text-white text-xs">{worldSettings.environmentBlur.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01"
                  value={worldSettings.environmentBlur}
                  onChange={(e) => updateWorldSettings({ environmentBlur: parseFloat(e.target.value) })}
                  className="w-full accent-[#4772b3]"
                />
              </div>
            </>
          )}

          {worldSettings.backgroundType === 'sky' && (
            <>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">Turbidity</span>
                  <span className="text-white text-xs">{worldSettings.skyTurbidity.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0" max="20" step="0.1"
                  value={worldSettings.skyTurbidity}
                  onChange={(e) => updateWorldSettings({ skyTurbidity: parseFloat(e.target.value) })}
                  className="w-full accent-[#4772b3]"
                />
              </div>
              
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">Rayleigh</span>
                  <span className="text-white text-xs">{worldSettings.skyRayleigh.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="4" step="0.01"
                  value={worldSettings.skyRayleigh}
                  onChange={(e) => updateWorldSettings({ skyRayleigh: parseFloat(e.target.value) })}
                  className="w-full accent-[#4772b3]"
                />
              </div>
            </>
          )}
          
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
              <span className="text-[#a4a4a4]">Type</span>
              <select 
                className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-24"
                value={worldSettings.fogType}
                onChange={(e) => updateWorldSettings({ fogType: e.target.value })}
              >
                <option value="linear">Linear</option>
                <option value="exponential">Exponential</option>
              </select>
            </div>

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

            {worldSettings.fogType === 'linear' ? (
              <>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Start</span>
                    <span className="text-white text-xs">{worldSettings.fogNear.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="1"
                    value={worldSettings.fogNear}
                    onChange={(e) => updateWorldSettings({ fogNear: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">Depth</span>
                    <span className="text-white text-xs">{worldSettings.fogFar.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="10" max="500" step="1"
                    value={worldSettings.fogFar}
                    onChange={(e) => updateWorldSettings({ fogFar: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]"
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">Density</span>
                  <span className="text-white text-xs">{worldSettings.fogDensity.toFixed(3)}</span>
                </div>
                <input 
                  type="range" min="0" max="0.1" step="0.001"
                  value={worldSettings.fogDensity}
                  onChange={(e) => updateWorldSettings({ fogDensity: parseFloat(e.target.value) })}
                  className="w-full accent-[#4772b3]"
                />
              </div>
            )}
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

      {/* ── STAGING ───────────────────────────────────────── */}
      <div className="pt-1 pb-0.5 px-1 text-[10px] font-semibold text-[#666] uppercase tracking-widest">Staging (drei)</div>

      {/* Contact Shadows */}
      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
          <input type="checkbox" checked={worldSettings.contactShadowsEnabled}
            onChange={(e) => updateWorldSettings({ contactShadowsEnabled: e.target.checked })}
            className="accent-[#4772b3]" />
          <span>Contact Shadows</span>
        </div>
        {worldSettings.contactShadowsEnabled && (
          <div className="p-3 flex flex-col gap-3">
            {[
              { label: 'Opacity', key: 'contactShadowsOpacity', min: 0, max: 1, step: 0.05 },
              { label: 'Blur',    key: 'contactShadowsBlur',    min: 0, max: 10, step: 0.1 },
              { label: 'Far',     key: 'contactShadowsFar',     min: 0, max: 20, step: 0.5 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">{label}</span>
                  <span className="text-white text-xs">{Number(worldSettings[key]).toFixed(2)}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={worldSettings[key]}
                  onChange={(e) => updateWorldSettings({ [key]: parseFloat(e.target.value) })}
                  className="w-full accent-[#4772b3]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Soft Shadows — disabled: patches global ShaderChunks, breaks MeshLambertMaterial */}
      <div className="bg-[#303030] rounded border border-[#1d1d1d] opacity-50 pointer-events-none select-none">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
          <input type="checkbox" disabled className="accent-[#4772b3]" />
          <span>Soft Shadows</span>
          <span className="ml-auto text-[10px] text-yellow-500 font-normal">⚠ Incompatible</span>
        </div>
        <div className="p-2 text-[10px] text-[#888] leading-relaxed">
          SoftShadows patches Three.js global ShaderChunks — causes shader compile errors with
          MeshLambertMaterial. Use PCF Soft in Render → Shadows instead.
        </div>
      </div>

      {/* Accumulative Shadows */}
      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
          <input type="checkbox" checked={worldSettings.accumulativeShadowsEnabled}
            onChange={(e) => updateWorldSettings({ accumulativeShadowsEnabled: e.target.checked })}
            className="accent-[#4772b3]" />
          <span>Accumulative Shadows</span>
        </div>
        {worldSettings.accumulativeShadowsEnabled && (
          <div className="p-3 flex flex-col gap-3">
            {[
              { label: 'Frames', key: 'accumulativeShadowsFrames', min: 1,  max: 500, step: 1 },
              { label: 'Blend',  key: 'accumulativeShadowsBlend',  min: 1,  max: 500, step: 1 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">{label}</span>
                  <span className="text-white text-xs">{worldSettings[key]}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={worldSettings[key]}
                  onChange={(e) => updateWorldSettings({ [key]: parseInt(e.target.value) })}
                  className="w-full accent-[#4772b3]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
          <input type="checkbox" checked={worldSettings.backdropEnabled}
            onChange={(e) => updateWorldSettings({ backdropEnabled: e.target.checked })}
            className="accent-[#4772b3]" />
          <span>Backdrop</span>
        </div>
        {worldSettings.backdropEnabled && (
          <div className="p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Color</span>
              <div className="flex items-center gap-2">
                <input type="color" value={worldSettings.backdropColor}
                  onChange={(e) => updateWorldSettings({ backdropColor: e.target.value })}
                  className="w-16 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" />
                <span className="font-mono text-white text-[10px] uppercase w-14">{worldSettings.backdropColor}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[#a4a4a4]">Floor</span>
                <span className="text-white text-xs">{worldSettings.backdropFloor.toFixed(2)}</span>
              </div>
              <input type="range" min={-5} max={0} step={0.1}
                value={worldSettings.backdropFloor}
                onChange={(e) => updateWorldSettings({ backdropFloor: parseFloat(e.target.value) })}
                className="w-full accent-[#4772b3]" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[#a4a4a4]">Segments</span>
                <span className="text-white text-xs">{worldSettings.backdropSegments}</span>
              </div>
              <input type="range" min={4} max={100} step={1}
                value={worldSettings.backdropSegments}
                onChange={(e) => updateWorldSettings({ backdropSegments: parseInt(e.target.value) })}
                className="w-full accent-[#4772b3]" />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
