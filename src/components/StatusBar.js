"use client";

import React from 'react';

export default function StatusBar() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-6 bg-[#2b2b2b] border-t border-[#1a1a1a] flex items-center justify-between px-3 text-[#aaaaaa] text-[11px] font-sans z-50 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 cursor-default hover:text-white transition-colors">
          <div className="bg-[#4a4a4a] text-[#dddddd] px-1.5 rounded-[3px] shadow-[0_1px_1px_rgba(0,0,0,0.3)]">L</div>
          <span>Select</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-default hover:text-white transition-colors">
          <div className="bg-[#4a4a4a] text-[#dddddd] px-1.5 rounded-[3px] shadow-[0_1px_1px_rgba(0,0,0,0.3)]">M</div>
          <span>Rotate View</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-default hover:text-white transition-colors">
          <div className="bg-[#4a4a4a] text-[#dddddd] px-1.5 rounded-[3px] shadow-[0_1px_1px_rgba(0,0,0,0.3)]">R</div>
          <span>Options</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="cursor-default hover:text-white transition-colors">0.1.0</span>
      </div>
    </div>
  );
}
