"use client";

import { useStore } from "../store/useStore";
import { USDZExporter } from "three-stdlib";
import AddMenu from "./AddMenu";
import { Box, Link, Magnet, Target, Circle, Globe, Sun, Settings } from 'lucide-react';

export default function TopMenu() {
  const scene = useStore((state) => state.scene);

  const handleExportUSDZ = async () => {
    if (!scene) {
      alert("Scene not loaded yet!");
      return;
    }
    
    try {
      const exporter = new USDZExporter();
      // USDZExporter parse returns a Promise that resolves to an ArrayBuffer
      const arrayBuffer = await exporter.parse(scene);
      
      const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = "scene.usdz";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export USDZ:", error);
      alert("Failed to export scene.");
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-10 bg-[#282828] border-b border-black/30 flex items-center px-4 z-40 text-[#cccccc] text-[13px] font-sans shadow-sm select-none justify-between">
      
      {/* Left side menus */}
      <div className="flex gap-1 items-center text-[#e5e5e5]">
        {/* Fake Blender Logo */}
        <div className="px-3 hover:text-white cursor-default">
          <Box size={16} />
        </div>

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
        
        {/* Viewport Shading Icons */}
        <div className="flex items-center gap-1">
          <div className="p-1 hover:bg-[#404040] rounded opacity-50 cursor-pointer"><Circle size={16} /></div> {/* Wireframe */}
          <div className="p-1 hover:bg-[#404040] rounded opacity-100 cursor-pointer"><Circle size={16} fill="currentColor" /></div> {/* Solid */}
          <div className="p-1 hover:bg-[#404040] rounded opacity-50 cursor-pointer"><Globe size={16} /></div> {/* Material Preview */}
          <div className="p-1 hover:bg-[#404040] rounded opacity-50 cursor-pointer"><Sun size={16} /></div> {/* Rendered */}
        </div>

        {/* Options */}
        <div className="flex items-center gap-1 hover:bg-[#404040] px-2 py-1 rounded cursor-default transition-colors border-l border-[#404040] pl-3 ml-1">
          <span>Options</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* File Export (Kept for our tool) */}
        <div className="relative group cursor-default border-l border-[#404040] pl-3 ml-1">
          <span className="px-2 py-1 hover:bg-[#404040] rounded transition-colors block">File</span>
          <div className="absolute right-0 top-full hidden group-hover:block bg-[#333333] border border-black/30 rounded shadow-2xl min-w-[150px] py-1 mt-1 z-50">
            <div 
              className="px-4 py-1.5 hover:bg-[#4772b3] hover:text-white cursor-pointer transition-colors"
              onClick={handleExportUSDZ}
            >
              Export .usdz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
