"use client";

import React from 'react';
import { ZoomIn, Hand, Video, Grid3X3 } from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useStore } from '../../../store/useStore';

export default function NavigationToolbar() {
  const { viewMode, setViewMode, navigationMode, setNavigationMode } = useStore();

  const handleZoom = (e) => {
    // Zoom logic handled externally via pointer events on a separate plane, 
    // or we can dispatch events to the store. For now, it's a stub to wire up.
    console.log("Zoom");
  };

  const handlePan = () => {
    setNavigationMode(navigationMode === 'pan' ? 'orbit' : 'pan');
  };

  const handleWalk = () => {
    setNavigationMode(navigationMode === 'fly' ? 'orbit' : 'fly');
  };

  const handleViewToggle = () => {
    setViewMode(viewMode === 'perspective' ? 'orthographic' : 'perspective');
  };

  return (
    <div className="absolute right-4 top-40 flex flex-col items-center z-40 select-none">
      <ToolbarButton 
        icon={ZoomIn} 
        title="Zoom in/out" 
        onPointerDown={handleZoom} 
      />
      <ToolbarButton 
        icon={Hand} 
        title="Move the view" 
        onClick={handlePan} 
      />
      <ToolbarButton 
        icon={Video} 
        title="Toggle Camera View" 
        onClick={handleWalk} 
      />
      <ToolbarButton 
        icon={Grid3X3} 
        title="Switch Perspective/Orthographic" 
        onClick={handleViewToggle} 
      />
    </div>
  );
}
