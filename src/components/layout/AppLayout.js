"use client";

import React from 'react';
import Outliner from '../panels/Outliner';
import PropertiesPanel from '../panels/PropertiesPanel';

export default function AppLayout({ children }) {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#282828] text-[#cccccc] font-sans pt-8 pb-6">
      {/* 3D Viewport Area */}
      <div className="flex-1 relative">
        {children}
      </div>

      {/* Right Sidebar */}
      <div className="w-[300px] flex flex-col border-l border-[#1d1d1d] bg-[#282828] z-50 shadow-[-5px_0_15px_rgba(0,0,0,0.2)]">
        {/* Top Half: Outliner (Scene Collection) */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-[200px]">
          <Outliner />
        </div>
        
        {/* Splitter Line */}
        <div className="h-[2px] w-full bg-[#1d1d1d] cursor-ns-resize hover:bg-[#4772b3]"></div>

        {/* Bottom Half: Properties */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-[200px]">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
