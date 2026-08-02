"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Box } from 'lucide-react';

export default function ObjectProperties({ activeObject }) {
  const updateObject = useStore(state => state.updateObject);

  const handleTransformChange = (axis, type, value) => {
    if (!activeObject) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;

    const newArr = [...activeObject[type]];
    newArr[axis] = num;
    updateObject(activeObject.id, { [type]: newArr });
  };

  const handleNameChange = (value) => {
    updateObject(activeObject.id, { name: value });
  };

  if (!activeObject) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2 text-orange-400">
        <Box size={16} />
        <input 
          type="text"
          value={activeObject.name || activeObject.id}
          onChange={(e) => handleNameChange(e.target.value)}
          className="bg-transparent outline-none flex-1"
        />
      </div>

      {/* Transform */}
      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Transform</div>
        <div className="p-3 flex flex-col gap-3">
          {/* Location */}
          <div className="flex items-center gap-2">
            <span className="w-14 text-white">Location</span>
            <div className="flex flex-col gap-1 flex-1">
              {['X', 'Y', 'Z'].map((axis, i) => (
                <div key={axis} className="flex relative items-center rounded overflow-hidden">
                  <div className={`absolute left-0 w-1 h-full ${axis === 'X' ? 'bg-red-500' : axis === 'Y' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <span className="absolute left-2 text-[#888] font-mono">{axis}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-[#1d1d1d] text-white pl-6 pr-2 py-1 outline-none font-mono text-right hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] transition-colors" 
                    value={activeObject.position[i].toFixed(3)}
                    onChange={(e) => handleTransformChange(i, 'position', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-2">
            <span className="w-14 text-white">Rotation</span>
            <div className="flex flex-col gap-1 flex-1">
              {['X', 'Y', 'Z'].map((axis, i) => (
                <div key={axis} className="flex relative items-center rounded overflow-hidden">
                  <div className={`absolute left-0 w-1 h-full ${axis === 'X' ? 'bg-red-500' : axis === 'Y' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <span className="absolute left-2 text-[#888] font-mono">{axis}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-[#1d1d1d] text-white pl-6 pr-2 py-1 outline-none font-mono text-right hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] transition-colors" 
                    value={(activeObject.rotation[i] * (180 / Math.PI)).toFixed(1)}
                    onChange={(e) => handleTransformChange(i, 'rotation', (parseFloat(e.target.value) * (Math.PI / 180)))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div className="flex items-center gap-2">
            <span className="w-14 text-white">Scale</span>
            <div className="flex flex-col gap-1 flex-1">
              {['X', 'Y', 'Z'].map((axis, i) => (
                <div key={axis} className="flex relative items-center rounded overflow-hidden">
                  <div className={`absolute left-0 w-1 h-full ${axis === 'X' ? 'bg-red-500' : axis === 'Y' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <span className="absolute left-2 text-[#888] font-mono">{axis}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-[#1d1d1d] text-white pl-6 pr-2 py-1 outline-none font-mono text-right hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] transition-colors" 
                    value={activeObject.scale[i].toFixed(3)}
                    onChange={(e) => handleTransformChange(i, 'scale', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
