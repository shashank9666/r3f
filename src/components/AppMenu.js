"use client";

import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Box } from 'lucide-react';

export default function AppMenu() {
  const [activeMenu, setActiveMenu] = useState(null);
  
  const resetStore = useStore(state => state.resetStore); // need to implement this
  const objects = useStore(state => state.objects);
  const worldSettings = useStore(state => state.worldSettings);
  const renderSettings = useStore(state => state.renderSettings);
  const postProcessingSettings = useStore(state => state.postProcessingSettings);
  
  const fileInputRef = useRef(null);
  const scene = useStore((state) => state.scene);

  const handleExportUSDZ = async () => {
    if (!scene) {
      alert("Scene not loaded yet!");
      return;
    }
    
    try {
      const { USDZExporter } = await import("three-stdlib");
      const exporter = new USDZExporter();
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
    setActiveMenu(null);
  };

  const handleNew = () => {
    if (window.confirm("Are you sure you want to create a new file? Unsaved changes will be lost.")) {
      useStore.setState({ objects: [], selectedIds: [], activeId: null });
      // In a real app we might reset settings too, but resetting scene objects is enough for now
      setActiveMenu(null);
    }
  };

  const handleSave = () => {
    const data = {
      version: 1,
      objects,
      worldSettings,
      renderSettings,
      postProcessingSettings
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "scene.r3f.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setActiveMenu(null);
  };

  const handleOpenClick = () => {
    fileInputRef.current?.click();
    setActiveMenu(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.objects) {
          useStore.setState({
            objects: json.objects,
            worldSettings: json.worldSettings || worldSettings,
            renderSettings: json.renderSettings || renderSettings,
            postProcessingSettings: json.postProcessingSettings || postProcessingSettings,
            selectedIds: [],
            activeId: null
          });
        }
      } catch (err) {
        alert("Failed to parse file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.app-menu-container')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="app-menu-container w-full h-8 bg-[#282828] border-b border-black/30 flex items-center px-4 z-50 text-[#cccccc] text-[13px] font-sans select-none relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />

      <div className="flex gap-1 items-center">
        {/* Fake Blender Logo */}
        <div className="px-3 hover:text-white cursor-default">
          <Box size={16} />
        </div>

        {/* File Menu */}
        <div className="relative">
          <div 
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeMenu === 'file' ? 'bg-[#404040]' : 'hover:bg-[#404040]'}`}
            onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
          >
            File
          </div>
          
          {activeMenu === 'file' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#282828] border border-[#1d1d1d] shadow-xl py-1 z-50 rounded-md flex flex-col">
              <div className="px-4 py-1.5 hover:bg-[#4772b3] cursor-pointer flex justify-between group" onClick={handleNew}>
                <span>New</span>
                <span className="text-[#888] group-hover:text-white/70 text-xs">Ctrl N</span>
              </div>
              <div className="px-4 py-1.5 hover:bg-[#4772b3] cursor-pointer flex justify-between group" onClick={handleOpenClick}>
                <span>Open...</span>
                <span className="text-[#888] group-hover:text-white/70 text-xs">Ctrl O</span>
              </div>
              <div className="h-[1px] bg-[#404040] my-1 mx-2"></div>
              <div className="px-4 py-1.5 hover:bg-[#4772b3] cursor-pointer flex justify-between group" onClick={handleSave}>
                <span>Save</span>
                <span className="text-[#888] group-hover:text-white/70 text-xs">Ctrl S</span>
              </div>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <div 
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeMenu === 'edit' ? 'bg-[#404040]' : 'hover:bg-[#404040]'}`}
            onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
          >
            Edit
          </div>
          {activeMenu === 'edit' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#282828] border border-[#1d1d1d] shadow-xl py-1 z-50 rounded-md flex flex-col">
              <div className="px-4 py-1.5 hover:bg-[#4772b3] cursor-pointer flex justify-between group" onClick={() => { useStore.getState().undo(); setActiveMenu(null); }}>
                <span>Undo</span>
                <span className="text-[#888] group-hover:text-white/70 text-xs">Ctrl Z</span>
              </div>
              <div className="px-4 py-1.5 hover:bg-[#4772b3] cursor-pointer flex justify-between group" onClick={() => { useStore.getState().redo(); setActiveMenu(null); }}>
                <span>Redo</span>
                <span className="text-[#888] group-hover:text-white/70 text-xs">Ctrl Y</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Render Menu */}
        <div className="px-2 py-1 hover:bg-[#404040] rounded transition-colors cursor-pointer">Render</div>
        
        {/* Window Menu */}
        <div className="px-2 py-1 hover:bg-[#404040] rounded transition-colors cursor-pointer">Window</div>
        
        {/* Help Menu */}
        <div className="px-2 py-1 hover:bg-[#404040] rounded transition-colors cursor-pointer">Help</div>
      </div>
      
      <div className="flex-1 flex justify-center text-[#888] text-xs">
        Default Scene
      </div>
    </div>
  );
}
