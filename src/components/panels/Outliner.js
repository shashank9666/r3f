"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Box, Sun, Video, Eye, EyeOff, Camera, Triangle } from 'lucide-react';

export default function Outliner() {
  const objects = useStore(state => state.objects);
  const selectedIds = useStore(state => state.selectedIds);
  const setSelectedIds = useStore(state => state.setSelectedIds);
  const updateObject = useStore(state => state.updateObject);

  const handleSelect = (e, id) => {
    if (e.shiftKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(selId => selId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  const getIcon = (category, type) => {
    if (category === 'camera') return <Video size={14} className="text-[#a4a4a4]" />;
    if (category === 'light') return <Sun size={14} className="text-[#a4a4a4]" />;
    if (category === 'mesh') return <Triangle size={14} className="text-[#a4a4a4]" />;
    return <Box size={14} className="text-[#a4a4a4]" />;
  };

  return (
    <div className="flex flex-col h-full bg-[#282828] text-[#cccccc] text-xs font-sans">
      {/* Header */}
      <div className="flex items-center px-3 py-1.5 bg-[#303030] border-b border-[#1d1d1d]">
        <div className="flex items-center gap-2 font-semibold">
          <Box size={14} />
          <span>Scene Collection</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-1">
          {objects.map((obj) => {
            const isSelected = selectedIds.includes(obj.id);
            const isVisible = obj.visible !== false;

            return (
              <div 
                key={obj.id}
                onClick={(e) => handleSelect(e, obj.id)}
                className={`flex items-center px-3 py-1 cursor-pointer select-none group ${isSelected ? 'bg-[#2a4b8d] text-white' : 'hover:bg-[#383838]'}`}
              >
                {/* Indent for hierarchy (flattened for now) */}
                <div className="w-4"></div>
                
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                  {getIcon(obj.category, obj.type)}
                  <span className="truncate">{obj.name || obj.id}</span>
                </div>

                {/* Visibility Toggle */}
                <div 
                  className={`px-2 flex items-center justify-center opacity-0 group-hover:opacity-100 ${!isVisible ? 'opacity-100' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateObject(obj.id, { visible: !isVisible });
                  }}
                >
                  {isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-[#888]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
