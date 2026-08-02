"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Wrench, Box, Camera, Globe, Monitor, SquareDashed, MousePointer2 } from 'lucide-react';

export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState('tool');
  const activeTool = useStore(state => state.activeTool);
  
  const activeId = useStore(state => state.activeId);
  const objects = useStore(state => state.objects);
  const updateObject = useStore(state => state.updateObject);
  const activeObject = objects.find(o => o.id === activeId);

  const tabs = [
    { id: 'tool', icon: Wrench, title: 'Active Tool and Workspace settings' },
    { id: 'object', icon: Box, title: 'Object Properties' },
    { id: 'world', icon: Globe, title: 'World Properties' }
  ];

  const handleTransformChange = (axis, type, value) => {
    if (!activeObject) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;

    const newArr = [...activeObject[type]];
    newArr[axis] = num;
    updateObject(activeId, { [type]: newArr });
  };

  return (
    <div className="flex h-full bg-[#282828] text-[#cccccc] text-xs font-sans border-t border-[#1d1d1d]">
      
      {/* Icon Tabs (Vertical) */}
      <div className="w-[40px] flex flex-col items-center bg-[#282828] border-r border-[#1d1d1d] py-2 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-1.5 rounded cursor-pointer ${isActive ? 'bg-[#4772b3] text-white' : 'text-[#a4a4a4] hover:bg-[#383838]'}`}
              title={tab.title}
            >
              <Icon size={16} />
            </div>
          );
        })}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-3">
        
        {/* TOOL TAB */}
        {activeTab === 'tool' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2">
              <span className="flex items-center gap-2">
                {activeTool === 'box-select' ? <SquareDashed size={16} className="text-[#a4a4a4]" /> : <MousePointer2 size={16} className="text-[#a4a4a4]" />}
                {activeTool === 'box-select' ? 'Select Box' : 'Select'}
              </span>
            </div>
            
            <div className="bg-[#303030] rounded p-2 border border-[#1d1d1d]">
              <div className="flex items-center gap-1 font-semibold mb-2 text-[11px] text-[#a4a4a4] uppercase tracking-wider">
                Options
              </div>
              
              <div className="ml-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-[80px]">Affect Only</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#4772b3]" />
                      <span>Origins</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#4772b3]" />
                      <span>Locations</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#4772b3]" />
                      <span>Parents</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OBJECT TAB */}
        {activeTab === 'object' && activeObject && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2">
              <Box size={16} />
              <span>{activeObject.name || activeObject.id}</span>
            </div>

            {/* Transform */}
            <div className="bg-[#303030] rounded border border-[#1d1d1d]">
              <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d]">Transform</div>
              <div className="p-3 flex flex-col gap-3">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <span className="w-14">Location</span>
                  <div className="flex flex-col gap-1 flex-1">
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis} className="flex relative items-center rounded overflow-hidden">
                        <div className={`absolute left-0 w-1 h-full ${axis === 'X' ? 'bg-red-500' : axis === 'Y' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <span className="absolute left-2 text-[#888] font-mono">{axis}</span>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full bg-[#1d1d1d] text-white pl-6 pr-2 py-1 outline-none font-mono text-right" 
                          value={activeObject.position[i].toFixed(3)}
                          onChange={(e) => handleTransformChange(i, 'position', e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rotation */}
                <div className="flex items-center gap-2">
                  <span className="w-14">Rotation</span>
                  <div className="flex flex-col gap-1 flex-1">
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis} className="flex relative items-center rounded overflow-hidden">
                        <div className={`absolute left-0 w-1 h-full ${axis === 'X' ? 'bg-red-500' : axis === 'Y' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <span className="absolute left-2 text-[#888] font-mono">{axis}</span>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full bg-[#1d1d1d] text-white pl-6 pr-2 py-1 outline-none font-mono text-right" 
                          value={(activeObject.rotation[i] * (180 / Math.PI)).toFixed(1)}
                          onChange={(e) => handleTransformChange(i, 'rotation', (parseFloat(e.target.value) * (Math.PI / 180)))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scale */}
                <div className="flex items-center gap-2">
                  <span className="w-14">Scale</span>
                  <div className="flex flex-col gap-1 flex-1">
                    {['X', 'Y', 'Z'].map((axis, i) => (
                      <div key={axis} className="flex relative items-center rounded overflow-hidden">
                        <div className={`absolute left-0 w-1 h-full ${axis === 'X' ? 'bg-red-500' : axis === 'Y' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <span className="absolute left-2 text-[#888] font-mono">{axis}</span>
                        <input 
                          type="number" 
                          step="0.1"
                          className="w-full bg-[#1d1d1d] text-white pl-6 pr-2 py-1 outline-none font-mono text-right" 
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
        )}

        {/* EMPTY STATE */}
        {activeTab === 'object' && !activeObject && (
          <div className="flex items-center justify-center h-full text-[#888]">
            No object selected
          </div>
        )}
      </div>
    </div>
  );
}
