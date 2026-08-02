"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Globe, RotateCcw } from 'lucide-react';
import { WORLD_FEATURES } from '../../../lib/drei/featureCatalog';
import { ParamList, CollapsibleFeature, Section } from './ParamField';

export default function WorldProperties() {
  const worldSettings = useStore(state => state.worldSettings);
  const updateWorldSettings = useStore(state => state.updateWorldSettings);
  const resetWorldSettings = useStore(state => state.resetWorldSettings);
  const worldFeatures = useStore(state => state.worldFeatures);
  const updateWorldFeature = useStore(state => state.updateWorldFeature);

  return (
    <div className="flex flex-col h-full bg-[#242424]">
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-[#1d1d1d]">
        <div className="flex items-center gap-2 font-semibold text-[13px] text-red-400">
          <Globe size={16} />
          <span>World</span>
        </div>
        <button 
          onClick={resetWorldSettings}
          title="Reset to Default"
          className="p-1 hover:bg-[#383838] text-[#a4a4a4] hover:text-white rounded transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        <Section label="Surface">
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Surface</span>
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
                <input 
                  type="text" 
                  value={worldSettings.backgroundColor} 
                  onChange={(e) => updateWorldSettings({ backgroundColor: e.target.value })}
                  className="font-mono text-white text-[10px] uppercase w-14 bg-transparent border-0 outline-none"
                />
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
              {[
                { label: 'Turbidity',   key: 'skyTurbidity',       min: 0,   max: 20,     step: 0.1,    dec: 1 },
                { label: 'Rayleigh',    key: 'skyRayleigh',        min: 0,   max: 4,      step: 0.01,   dec: 2 },
                { label: 'Mie Coeff',   key: 'skyMieCoefficient',  min: 0,   max: 0.1,    step: 0.001,  dec: 3 },
                { label: 'Mie Dir G',   key: 'skyMieDirectionalG', min: 0,   max: 1,      step: 0.01,   dec: 2 },
                { label: 'Azimuth',     key: 'skyAzimuth',         min: 0,   max: 1,      step: 0.01,   dec: 2 },
                { label: 'Inclination', key: 'skyInclination',     min: 0,   max: 0.5,    step: 0.005,  dec: 3 },
                { label: 'Distance',    key: 'skyDistance',        min: 1000, max: 900000, step: 1000,  dec: 0 },
              ].map(({ label, key, min, max, step, dec }) => (
                <div key={key} className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between">
                    <span className="text-[#a4a4a4]">{label}</span>
                    <span className="text-white text-xs">{Number(worldSettings[key]).toFixed(dec)}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step}
                    value={worldSettings[key]}
                    onChange={(e) => updateWorldSettings({ [key]: parseFloat(e.target.value) })}
                    className="w-full accent-[#4772b3]" />
                </div>
              ))}
            </>
          )}
        </Section>

        <Section label="Render Stage Floor" defaultOpen={false}>
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Color</span>
            <div className="flex items-center gap-2">
              <input type="color" value={worldSettings.stageFloorColor}
                onChange={(e) => updateWorldSettings({ stageFloorColor: e.target.value })}
                className="w-16 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" />
              <input 
                type="text" 
                value={worldSettings.stageFloorColor} 
                onChange={(e) => updateWorldSettings({ stageFloorColor: e.target.value })}
                className="font-mono text-white text-[10px] uppercase w-14 bg-transparent border-0 outline-none" 
              />
            </div>
          </div>
          {[
            { label: 'Size',       key: 'stageFloorSize',      min: 10,  max: 500,  step: 10,   dec: 0 },
            { label: 'Roughness',  key: 'stageFloorRoughness', min: 0,   max: 1,    step: 0.01, dec: 2 },
            { label: 'Metalness',  key: 'stageFloorMetalness', min: 0,   max: 1,    step: 0.01, dec: 2 },
            { label: 'Fog Near',   key: 'stageFogNear',        min: 1,   max: 80,   step: 0.5,  dec: 1 },
            { label: 'Fog Far',    key: 'stageFogFar',         min: 5,   max: 200,  step: 1,    dec: 0 },
          ].map(({ label, key, min, max, step, dec }) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[#a4a4a4]">{label}</span>
                <span className="text-white text-xs">{Number(worldSettings[key]).toFixed(dec)}</span>
              </div>
              <input type="range" min={min} max={max} step={step}
                value={worldSettings[key]}
                onChange={(e) => updateWorldSettings({ [key]: parseFloat(e.target.value) })}
                className="w-full accent-[#4772b3]" />
            </div>
          ))}
        </Section>

        <CollapsibleFeature 
          label="Fog"
          enabled={worldSettings.fogEnabled} 
          onToggle={(enabled) => updateWorldSettings({ fogEnabled: enabled })}
          defaultOpen={false}
        >
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
        </CollapsibleFeature>

        <Section label="Viewport Display" defaultOpen={false}>
          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Show Grid</span>
            <input 
              type="checkbox" 
              checked={worldSettings.showGrid} 
              onChange={(e) => updateWorldSettings({ showGrid: e.target.checked })}
              className="accent-[#4772b3]"
            />
          </div>
        </Section>

        {/* ── STAGING ───────────────────────────────────────── */}
        <Section label="Staging (drei)" defaultOpen={false}>
          {/* Contact Shadows */}
          <CollapsibleFeature 
            label="Contact Shadows"
            enabled={worldSettings.contactShadowsEnabled}
            onToggle={(enabled) => updateWorldSettings({ contactShadowsEnabled: enabled })}
            defaultOpen={false}
          >
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
          </CollapsibleFeature>

          {/* Accumulative Shadows */}
          <CollapsibleFeature 
            label="Accumulative Shadows"
            enabled={worldSettings.accumulativeShadowsEnabled}
            onToggle={(enabled) => updateWorldSettings({ accumulativeShadowsEnabled: enabled })}
            defaultOpen={false}
          >
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
          </CollapsibleFeature>

          {/* Backdrop */}
          <CollapsibleFeature 
            label="Backdrop"
            enabled={worldSettings.backdropEnabled}
            onToggle={(enabled) => updateWorldSettings({ backdropEnabled: enabled })}
            defaultOpen={false}
          >
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
          </CollapsibleFeature>
        </Section>

        {/* ── CAMERA CONTROLS ─────────────────────────────── */}
        <Section label="Camera Controls" defaultOpen={false}>
          <div className="mb-2 font-semibold text-[#a4a4a4]">Orbit Controls</div>
          <div className="flex flex-col gap-3 mb-4">
            {[
              { label: 'Min Distance',  key: 'orbitMinDistance', min: 0.1, max: 10,  step: 0.1, dec: 1 },
              { label: 'Max Distance',  key: 'orbitMaxDistance', min: 10,  max: 1000, step: 5,  dec: 0 },
              { label: 'Zoom Speed',    key: 'orbitZoomSpeed',   min: 0.1, max: 5,   step: 0.1, dec: 1 },
            ].map(({ label, key, min, max, step, dec }) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[#a4a4a4]">{label}</span>
                  <span className="text-white text-xs">{Number(worldSettings[key]).toFixed(dec)}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={worldSettings[key]}
                  onChange={(e) => updateWorldSettings({ [key]: parseFloat(e.target.value) })}
                  className="w-full accent-[#4772b3]" />
              </div>
            ))}
          </div>

          <div className="mb-2 font-semibold text-[#a4a4a4]">Fly Controls</div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-[#a4a4a4]">Roll Speed</span>
                <span className="text-white text-xs">{Number(worldSettings.flyRollSpeed).toFixed(2)}</span>
              </div>
              <input type="range" min={0.01} max={2} step={0.01}
                value={worldSettings.flyRollSpeed}
                onChange={(e) => updateWorldSettings({ flyRollSpeed: parseFloat(e.target.value) })}
                className="w-full accent-[#4772b3]" />
            </div>
          </div>
        </Section>

        {/* Scene-wide drei staging */}
        {WORLD_FEATURES.map((feature) => (
          <CollapsibleFeature
            key={feature.id}
            label={feature.label}
            note={feature.note}
            enabled={worldFeatures?.[feature.id]?.enabled}
            onToggle={(enabled) => updateWorldFeature(feature.id, { enabled })}
            defaultOpen={false}
          >
            <ParamList
              schema={feature.params}
              values={worldFeatures?.[feature.id]}
              onChange={(updates) => updateWorldFeature(feature.id, updates)}
            />
          </CollapsibleFeature>
        ))}
      </div>
    </div>
  );
}
