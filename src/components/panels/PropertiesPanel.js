"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Wrench, Camera, Printer, Layers, Droplets, Globe, 
  Box, Share2, Activity, Link, Triangle, Circle, Grid, 
  Square, MousePointer 
} from 'lucide-react';

import ObjectProperties from './properties/ObjectProperties';
import MaterialProperties from './properties/MaterialProperties';
import DataProperties from './properties/DataProperties';

export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState('object');
  const activeTool = useStore(state => state.activeTool);
  
  const activeId = useStore(state => state.activeId);
  const objects = useStore(state => state.objects);
  const activeObject = objects.find(o => o.id === activeId);

  // Define tabs exactly like Blender's vertical properties sidebar
  const tabs = [
    // Context Group (White)
    { id: 'tool', icon: Wrench, title: 'Active Tool and Workspace settings', color: 'text-white' },
    { id: 'render', icon: Camera, title: 'Render Properties', color: 'text-white' },
    { id: 'output', icon: Printer, title: 'Output Properties', color: 'text-white' },
    { id: 'view_layer', icon: Layers, title: 'View Layer Properties', color: 'text-white' },
    { id: 'scene', icon: Droplets, title: 'Scene Properties', color: 'text-white' },
    { id: 'world', icon: Globe, title: 'World Properties', color: 'text-white' },
    
    // Object Group (Orange)
    { id: 'object', icon: Box, title: 'Object Properties', color: 'text-orange-400' },
    
    // Advanced Modifiers/Physics Group (Blue)
    { id: 'modifiers', icon: Wrench, title: 'Modifier Properties', color: 'text-blue-400' },
    { id: 'particles', icon: Share2, title: 'Particle Properties', color: 'text-blue-400' },
    { id: 'physics', icon: Activity, title: 'Physics Properties', color: 'text-blue-400' },
    
    // Constraints & Data Group (Green)
    { id: 'constraints', icon: Link, title: 'Object Constraint Properties', color: 'text-green-400' },
    { id: 'data', icon: Triangle, title: 'Object Data Properties', color: 'text-green-400' },
    
    // Shading Group (Red)
    { id: 'material', icon: Circle, title: 'Material Properties', color: 'text-red-400', hide: activeObject?.category !== 'mesh' && activeObject?.category !== 'cube' },
    { id: 'texture', icon: Grid, title: 'Texture Properties', color: 'text-red-400', hide: activeObject?.category !== 'mesh' && activeObject?.category !== 'cube' }
  ];

  const renderPlaceholder = (title) => (
    <div className="flex flex-col items-center justify-center h-full text-[#888] gap-2">
      <span className="font-semibold text-[#a4a4a4]">{title}</span>
      <span className="text-xs text-[#666]">(Not implemented yet)</span>
    </div>
  );

  return (
    <div className="flex h-full bg-[#282828] text-[#cccccc] text-xs font-sans border-t border-[#1d1d1d]">
      
      {/* Icon Tabs (Vertical Sidebar) */}
      <div className="w-[36px] flex flex-col items-center bg-[#282828] border-r border-[#1d1d1d] py-1 gap-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {tabs.map((tab) => {
          if (tab.hide) return null;
          
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                p-1.5 rounded cursor-pointer transition-colors w-[28px] h-[28px] flex items-center justify-center
                ${isActive ? 'bg-[#4772b3] ' + tab.color : 'text-[#a4a4a4] hover:bg-[#383838]'}
              `}
              title={tab.title}
            >
              <Icon size={16} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-3 bg-[#2d2d2d]">
        
        {/* TOOL TAB */}
        {activeTab === 'tool' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 font-semibold text-[13px] border-b border-[#1d1d1d] pb-2">
              <span className="flex items-center gap-2">
                {activeTool === 'box-select' ? <Square size={16} className="text-[#a4a4a4]" /> : <MousePointer size={16} className="text-[#a4a4a4]" />}
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

        {/* EMPTY STATE IF NO OBJECT FOR OBJECT TABS */}
        {['object', 'data', 'material', 'texture', 'modifiers', 'particles', 'physics', 'constraints'].includes(activeTab) && !activeObject && (
          <div className="flex items-center justify-center h-full text-[#888]">
            No object selected
          </div>
        )}

        {/* ACTIVE OBJECT TABS */}
        {activeObject && (
          <>
            {activeTab === 'object' && <ObjectProperties activeObject={activeObject} />}
            {activeTab === 'data' && <DataProperties activeObject={activeObject} />}
            {activeTab === 'material' && <MaterialProperties activeObject={activeObject} />}
            
            {/* PLACEHOLDERS */}
            {activeTab === 'modifiers' && renderPlaceholder('Modifier Properties')}
            {activeTab === 'particles' && renderPlaceholder('Particle Properties')}
            {activeTab === 'physics' && renderPlaceholder('Physics Properties')}
            {activeTab === 'constraints' && renderPlaceholder('Object Constraint Properties')}
            {activeTab === 'texture' && renderPlaceholder('Texture Properties')}
          </>
        )}

        {/* WORLD / SCENE PLACEHOLDERS */}
        {activeTab === 'render' && renderPlaceholder('Render Properties')}
        {activeTab === 'output' && renderPlaceholder('Output Properties')}
        {activeTab === 'view_layer' && renderPlaceholder('View Layer Properties')}
        {activeTab === 'scene' && renderPlaceholder('Scene Properties')}
        {activeTab === 'world' && renderPlaceholder('World Properties')}

      </div>
    </div>
  );
}
