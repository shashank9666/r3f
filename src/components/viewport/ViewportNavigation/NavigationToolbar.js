"use client";

import React from 'react';
import { ZoomIn, Hand, Video, Grid3X3 } from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useZoomTool } from './ZoomTool';
import { usePanTool } from './PanTool';
import { useCameraViewToggle } from './CameraViewToggle';
import { useProjectionToggle } from './ProjectionToggle';

export default function NavigationToolbar() {
  const { startZoomDrag, stepZoom } = useZoomTool();
  const { startPanDrag } = usePanTool();
  const { toggleCameraView, isCameraView } = useCameraViewToggle();
  const { toggleProjection, projection } = useProjectionToggle();

  return (
    <div className="absolute right-4 top-40 flex flex-col items-center z-40 select-none">
      <div onPointerDown={startZoomDrag} onClick={() => stepZoom(1)}>
        <ToolbarButton icon={ZoomIn} title="Zoom in/out (Drag)" />
      </div>
      <div onPointerDown={startPanDrag}>
        <ToolbarButton icon={Hand} title="Move the view (Drag)" />
      </div>
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
