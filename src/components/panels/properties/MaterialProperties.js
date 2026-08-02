"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Circle } from 'lucide-react';

export default function MaterialProperties({ activeObject }) {
  const updateObject = useStore(state => state.updateObject);

  if (!activeObject || activeObject.category !== 'mesh' && activeObject.category !== 'cube') return null;

  const handleMaterialChange = (key, value) => {
    updateObject(activeObject.id, { [key]: value });
  };

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
              className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-32"
              value={activeObject.materialType || 'standard'}
              onChange={(e) => handleMaterialChange('materialType', e.target.value)}
            >
              <option value="basic">Basic (Unlit)</option>
              <option value="lambert">Lambert</option>
              <option value="phong">Phong</option>
              <option value="standard">Standard</option>
              <option value="physical">Physical</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#a4a4a4]">Base Color</span>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={activeObject.color || '#ffffff'} 
                onChange={(e) => handleMaterialChange('color', e.target.value)}
                className="w-16 h-6 p-0 border-0 rounded cursor-pointer"
              />
              <span className="font-mono text-white text-[10px] uppercase w-14">{activeObject.color || '#ffffff'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
