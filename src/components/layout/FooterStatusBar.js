"use client";

import React from 'react';

export default function FooterStatusBar() {
  return (
    <div className="h-6 bg-[#1d1d1d] border-t border-[#303030] flex items-center px-4 text-[#a4a4a4] text-xs font-sans gap-6 w-full select-none">
      {/* Mouse Actions */}
      <div className="flex items-center gap-4">
        
        <div className="flex items-center gap-1.5">
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="10" height="14" rx="3.5" stroke="#888" strokeWidth="1.5" fill="none" />
            <path d="M 7 2 L 5.5 2 C 3.5 2 2 3.5 2 5.5 L 2 7 L 7 7 Z" fill="#888" />
          </svg>
          <span className="text-[11px] text-[#cccccc]">Select</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="10" height="14" rx="3.5" stroke="#888" strokeWidth="1.5" fill="none" />
            <rect x="5.5" y="3" width="3" height="4" rx="1.5" fill="#888" />
          </svg>
          <span className="text-[11px] text-[#cccccc]">Rotate View</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="10" height="14" rx="3.5" stroke="#888" strokeWidth="1.5" fill="none" />
            <path d="M 7 2 L 8.5 2 C 10.5 2 12 3.5 12 5.5 L 12 7 L 7 7 Z" fill="#888" />
          </svg>
          <span className="text-[11px] text-[#cccccc]">Options</span>
        </div>
        
      </div>

      {/* Spacing */}
      <div className="flex-1"></div>

      {/* Version/Stats */}
      <div className="flex items-center gap-4 text-[#888888]">
        <span>Scene Collection</span>
        <span>|</span>
        <span>Mem: 45.2 MB</span>
        <span>|</span>
        <span>R3F Editor 4.0</span>
      </div>
    </div>
  );
}
