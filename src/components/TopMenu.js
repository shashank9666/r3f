"use client";

import { useStore } from "../store/useStore";
import { USDZExporter } from "three-stdlib";

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
      <div className="flex gap-2 items-center">
        {/* Object Mode Dropdown */}
        <div className="flex items-center gap-2 bg-[#333333] hover:bg-[#3b3b3b] px-3 py-1.5 rounded cursor-default mr-2 transition-colors">
          <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
          <span>Object Mode</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* View Menu */}
        <div className="py-1.5 px-3 hover:bg-[#3b3b3b] rounded transition-colors cursor-default">View</div>
        
        {/* Select Menu */}
        <div className="py-1.5 px-3 hover:bg-[#3b3b3b] rounded transition-colors cursor-default">Select</div>
        
        {/* Add Menu */}
        <div className="py-1.5 px-3 hover:bg-[#3b3b3b] rounded transition-colors cursor-default">Add</div>
        
        {/* Object Menu */}
        <div className="py-1.5 px-3 hover:bg-[#3b3b3b] rounded transition-colors cursor-default">Object</div>
      </div>

      {/* Center menus (Global, Transform Pivot etc) */}
      <div className="flex gap-2 items-center absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1 hover:bg-[#3b3b3b] px-3 py-1.5 rounded cursor-default transition-colors">
          <span>Global</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 ml-1">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Right side (File Export for our custom use case) */}
      <div className="flex gap-2">
        <div className="relative group cursor-default">
          <span className="py-1.5 px-3 hover:bg-[#3b3b3b] rounded transition-colors block">File</span>
          <div className="absolute right-0 top-full hidden group-hover:block bg-[#333333] border border-black/30 rounded shadow-2xl min-w-[150px] py-1 mt-1 z-50">
            <div 
              className="px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white cursor-pointer transition-colors"
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
