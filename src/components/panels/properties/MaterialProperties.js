"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Circle } from 'lucide-react';
import { MATERIALS, MATERIAL_MAP, MATERIAL_ADDONS } from '../../../lib/drei/materialCatalog';
import { ParamList, CollapsibleFeature } from './ParamField';

export default function MaterialProperties({ activeObject }) {
  const updateObject = useStore(state => state.updateObject);
  const updateObjectAddon = useStore(state => state.updateObjectAddon);

  if (!activeObject || (activeObject.category !== 'mesh' && activeObject.category !== 'cube')) return null;

  const materialId = activeObject.materialType || 'standard';
  const entry = MATERIAL_MAP[materialId] || MATERIAL_MAP.standard;

  const setMaterialParams = (updates) =>
    updateObject(activeObject.id, {
      materialParams: { ...(activeObject.materialParams || {}), ...updates },
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-red-400">
        <Circle size={16} />
        <span>Material Properties</span>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Surface</div>
        <div className="p-3 flex flex-col gap-3">

          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Type</span>
            <select
              className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-36"
              value={materialId}
              onChange={(e) => updateObject(activeObject.id, { materialType: e.target.value })}
            >
              <optgroup label="Three.js">
                {MATERIALS.filter((m) => !m.drei).map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </optgroup>
              <optgroup label="drei">
                {MATERIALS.filter((m) => m.drei).map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Base Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeObject.color || '#ffffff'}
                onChange={(e) => updateObject(activeObject.id, { color: e.target.value })}
                className="w-14 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={activeObject.color || '#ffffff'}
                onChange={(e) => updateObject(activeObject.id, { color: e.target.value })}
                className="font-mono text-white text-[10px] uppercase w-14 bg-transparent border-0 outline-none"
              />
            </div>
          </div>

          <ParamList
            schema={entry.params}
            values={activeObject.materialParams}
            onChange={setMaterialParams}
          />
        </div>
      </div>

      <div className="text-[11px] text-[#a4a4a4] uppercase tracking-wider pt-1">Add-ons</div>
      {MATERIAL_ADDONS.map((addon) => (
        <CollapsibleFeature
          key={addon.id}
          label={addon.label}
          enabled={activeObject.materialAddons?.[addon.id]?.enabled}
          onToggle={(enabled) => updateObjectAddon(activeObject.id, addon.id, { enabled })}
          defaultOpen={false}
        >
          <ParamList
            schema={addon.params}
            values={activeObject.materialAddons?.[addon.id]}
            onChange={(updates) => updateObjectAddon(activeObject.id, addon.id, updates)}
          />
        </CollapsibleFeature>
      ))}
    </div>
  );
}
