"use client";

import React from 'react';
import { ZoomIn, Hand, Video, Grid3X3 } from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useZoomTool } from './ZoomTool';
import { usePanTool } from './PanTool';
import { useCameraViewToggle } from './CameraViewToggle';
import { useProjectionToggle } from './ProjectionToggle';
import { useStore } from '../../../store/useStore';

export default function NavigationToolbar() {
  const activeTool = useStore((state) => state.activeTool);
  const setActiveTool = useStore((state) => state.setActiveTool);
  const { toggleCameraView, isCameraView } = useCameraViewToggle();
  const { toggleProjection, projection } = useProjectionToggle();

  return (
    <div className="absolute right-4 top-40 flex flex-col items-center z-40 select-none">
      <ToolbarButton 
        icon={ZoomIn} 
        title="Zoom Mode" 
        isActive={activeTool === 'zoom'}
        onClick={() => setActiveTool(activeTool === 'zoom' ? 'select' : 'zoom')}
      />
      <ToolbarButton 
        icon={Hand} 
        title="Pan Mode" 
        isActive={activeTool === 'pan'}
        onClick={() => setActiveTool(activeTool === 'pan' ? 'select' : 'pan')}
      />
      <ToolbarButton 
        icon={Video} 
        title="Toggle Camera View (Numpad 0)" 
        onClick={toggleCameraView} 
        isActive={isCameraView}
      />
      <ToolbarButton 
        icon={Grid3X3} 
        title="Switch Perspective/Orthographic" 
        onClick={toggleProjection}
        isActive={projection === 'orthographic'}
      />
    </div>
  );
}
