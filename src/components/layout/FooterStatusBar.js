"use client";

import React from 'react';

export default function FooterStatusBar() {
  return (
    <div className="h-6 bg-[#1d1d1d] border-t border-[#303030] flex items-center px-4 text-[#a4a4a4] text-xs font-sans gap-6 w-full select-none">
      
      {/* Mouse Actions */}
      <div className="flex items-center gap-1.5">
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="12" height="16" rx="6" stroke="#888" strokeWidth="1.5" />
          <path d="M 1 7 L 13 7" stroke="#888" strokeWidth="1.5" />
          <path d="M 7 1 L 7 7" stroke="#888" strokeWidth="1.5" />
          <path d="M 2 2 Q 7 2 7 7 L 1 7 Q 1 2 2 2" fill="#cccccc" />
        </svg>
        <span>Select</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="12" height="16" rx="6" stroke="#888" strokeWidth="1.5" />
          <path d="M 1 7 L 13 7" stroke="#888" strokeWidth="1.5" />
          <path d="M 5 2 L 9 2 L 9 6 L 5 6 Z" fill="#cccccc" />
        </svg>
        <span>Rotate View</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="12" height="16" rx="6" stroke="#888" strokeWidth="1.5" />
          <path d="M 1 7 L 13 7" stroke="#888" strokeWidth="1.5" />
          <path d="M 7 1 L 7 7" stroke="#888" strokeWidth="1.5" />
          <path d="M 12 2 Q 7 2 7 7 L 13 7 Q 13 2 12 2" fill="#cccccc" />
        </svg>
        <span>Options</span>
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
