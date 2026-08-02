"use client";

import { useStore } from "../../store/useStore";
import AddMenu from "../AddMenu";
import { Box, Link, Magnet, Target, Settings } from 'lucide-react';
import ViewportShadingMenu from './ViewportNavigation/ViewportShadingMenu';

export default function ViewportHeader() {
  return (
    <div className="w-full h-[32px] flex-shrink-0 bg-[#303030] border-b border-[#1d1d1d] flex items-center px-2 z-20 text-[#cccccc] text-[13px] font-sans shadow-sm select-none justify-between">
      
      {/* Left side menus */}
      <div className="flex gap-1 items-center text-[#e5e5e5]">

        {/* Object Mode Dropdown */}
        <div className="flex items-center gap-2 hover:bg-[#404040] px-2 py-1 rounded cursor-default mr-2 transition-colors">
          <div className="w-3.5 h-3.5 bg-[#404040] border border-[#505050] rounded-sm flex items-center justify-center">
             <div className="w-2 h-2 bg-orange-500 rounded-[1px]"></div>
          </div>
          <span>Object Mode</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Menus */}
        <div className="px-2 py-1 hover:bg-[#404040] rounded transition-colors cursor-default">View</div>
        <div className="px-2 py-1 hover:bg-[#404040] rounded transition-colors cursor-default">Select</div>
        <AddMenu />
        <div className="px-2 py-1 hover:bg-[#404040] rounded transition-colors cursor-default">Object</div>
      </div>

      {/* Center menus (Global, Transform Pivot etc) */}
      <div className="flex gap-4 items-center absolute left-1/2 -translate-x-1/2 text-[#e5e5e5]">
        {/* Transform Orientation */}
        <div className="flex items-center gap-1 hover:bg-[#404040] px-2 py-1 rounded cursor-default transition-colors">
          <span>Global</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Pivot Point */}
        <div className="flex items-center gap-1 hover:bg-[#404040] px-2 py-1 rounded cursor-default transition-colors">
          <Link size={14} />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Snapping */}
        <div className="flex items-center gap-1 hover:bg-[#404040] px-2 py-1 rounded cursor-default transition-colors opacity-50">
          <Magnet size={14} />
        </div>

        {/* Proportional Editing */}
        <div className="flex items-center gap-1 hover:bg-[#404040] px-2 py-1 rounded cursor-default transition-colors opacity-50">
          <Target size={14} />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Right side (Viewport Shading & File Export) */}
      <div className="flex gap-3 items-center text-[#e5e5e5]">
        
        <ViewportShadingMenu />

        {/* Options */}
        <div className="flex items-center gap-1 hover:bg-[#404040] px-2 py-1 rounded cursor-default transition-colors border-l border-[#404040] pl-3 ml-1">
          <span>Options</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

      </div>
    </div>
  );
}
