"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Lightbulb, Camera, Triangle, Sparkles } from 'lucide-react';
import { DREI_OBJECT_MAP } from '../../../lib/drei/objectCatalog';
import { ParamList } from './ParamField';

export default function DataProperties({ activeObject }) {
  const updateObject = useStore(state => state.updateObject);
  const updateObjectParams = useStore(state => state.updateObjectParams);

  if (!activeObject) return null;

  // Catalog-driven controls for anything that came out of the drei Add menu
  const dreiEntry = DREI_OBJECT_MAP[activeObject.type];
  if (dreiEntry) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-green-400">
          <Sparkles size={16} />
          <span>{dreiEntry.label}</span>
        </div>

        <div className="bg-[#303030] rounded border border-[#1d1d1d]">
          <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">
            {dreiEntry.group} · drei
          </div>
          <div className="p-3">
            <ParamList
              schema={dreiEntry.params}
              values={activeObject.params}
              onChange={(updates) => updateObjectParams(activeObject.id, updates)}
            />
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (key, value) => {
    const props = activeObject.properties || {};
    updateObject(activeObject.id, { properties: { ...props, [key]: value } });
  };

  const props = activeObject.properties || {};

  // RENDER LIGHT DATA
  if (activeObject.category === 'light') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-green-400">
          <Lightbulb size={16} />
          <span>Light Data</span>
        </div>

        <div className="bg-[#303030] rounded border border-[#1d1d1d]">
          <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Settings</div>
          <div className="p-3 flex flex-col gap-3">
            
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Distance (Radius)</span>
              <input 
                type="number" 
                step="1"
                className="w-24 bg-[#1d1d1d] text-white px-2 py-1 outline-none text-xs text-right rounded" 
                value={props.distance !== undefined ? props.distance : 50}
                onChange={(e) => handlePropertyChange('distance', parseFloat(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Color</span>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={activeObject.color || '#ffffff'} 
                  onChange={(e) => updateObject(activeObject.id, { color: e.target.value })}
                  className="w-16 h-6 p-0 border-0 rounded cursor-pointer"
                />
                <input 
                  type="text" 
                  value={activeObject.color || '#ffffff'} 
                  onChange={(e) => updateObject(activeObject.id, { color: e.target.value })}
                  className="font-mono text-white text-[10px] uppercase w-14 bg-transparent border-0 outline-none" 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // RENDER CAMERA DATA
  if (activeObject.category === 'camera') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-green-400">
          <Camera size={16} />
          <span>Camera Data</span>
        </div>

        <div className="bg-[#303030] rounded border border-[#1d1d1d]">
          <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Lens</div>
          <div className="p-3 flex flex-col gap-3">
            
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">FOV</span>
              <input 
                type="number" 
                step="1"
                className="w-24 bg-[#1d1d1d] text-white px-2 py-1 outline-none text-xs text-right rounded" 
                value={props.fov !== undefined ? props.fov : 45}
                onChange={(e) => handlePropertyChange('fov', parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Clip Near</span>
              <input 
                type="number" 
                step="0.1"
                className="w-24 bg-[#1d1d1d] text-white px-2 py-1 outline-none text-xs text-right rounded" 
                value={props.near !== undefined ? props.near : 0.1}
                onChange={(e) => handlePropertyChange('near', parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Clip Far</span>
              <input 
                type="number" 
                step="10"
                className="w-24 bg-[#1d1d1d] text-white px-2 py-1 outline-none text-xs text-right rounded" 
                value={props.far !== undefined ? props.far : 1000}
                onChange={(e) => handlePropertyChange('far', parseFloat(e.target.value))}
              />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // RENDER MESH DATA
  if (activeObject.category === 'mesh' || activeObject.category === 'cube') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-green-400">
          <Triangle size={16} />
          <span>Object Data</span>
        </div>

        <div className="bg-[#303030] rounded border border-[#1d1d1d]">
          <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Geometry</div>
          <div className="p-3 flex flex-col gap-3 text-[#a4a4a4] text-xs">
            Type: {activeObject.type}
            <br />
            (Parametric editing coming soon)
          </div>
        </div>
      </div>
    );
  }

  return null;
}
