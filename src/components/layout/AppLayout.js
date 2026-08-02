"use client";

import React, { useState, useRef, useEffect } from 'react';
import Outliner from '../panels/Outliner';
import PropertiesPanel from '../panels/PropertiesPanel';
import ToastContainer from './ToastContainer';

export default function AppLayout({ children }) {
  // --- Resizing State ---
  // Sidebar width in pixels
  const [sidebarWidth, setSidebarWidth] = useState(320); 
  const [outlinerHeight, setOutlinerHeight] = useState(300);

  useEffect(() => {
    setOutlinerHeight(window.innerHeight * 0.3);
  }, []);

  const containerRef = useRef(null);

  // Dragging states
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingOutliner, setIsDraggingOutliner] = useState(false);

  // --- Handlers for dragging ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      if (isDraggingSidebar) {
        // Calculate new width based on window width and mouse X
        const newWidth = window.innerWidth - e.clientX;
        // Enforce min and max widths
        if (newWidth > 200 && newWidth < 800) {
          setSidebarWidth(newWidth);
        }
      }

      if (isDraggingOutliner) {
        // We calculate height relative to the top of the sidebar (which is e.clientY - top menu height)
        // For simplicity, just use clientY offset by the top menu (approx 48px)
        const topOffset = 48;
        const newHeight = e.clientY - topOffset;
        if (newHeight > 100 && newHeight < window.innerHeight - 200) {
          setOutlinerHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
      setIsDraggingOutliner(false);
    };

    if (isDraggingSidebar || isDraggingOutliner) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      // Optional: Add a class to body to prevent text selection and keep cursor during drag
      document.body.style.cursor = isDraggingSidebar ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebar, isDraggingOutliner]);

  return (
    <div 
      ref={containerRef}
      className="flex w-full h-screen overflow-hidden bg-[#1e1e1e] text-[#cccccc] font-sans pt-12 p-1 gap-1"
    >
      {/* 3D Viewport Area */}
      <div className="flex-1 relative rounded-xl overflow-hidden shadow-inner border border-[#333333]">
        {children}
        <ToastContainer />
      </div>

      {/* Vertical Splitter for Sidebar */}
      <div 
        className="w-1 cursor-col-resize hover:bg-[#4772b3] transition-colors flex-shrink-0"
        onMouseDown={() => setIsDraggingSidebar(true)}
      />

      {/* Right Sidebar */}
      <div 
        className="flex flex-col flex-shrink-0 h-full gap-1" 
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Top Half: Outliner (Scene Collection) */}
        <div 
          className="flex flex-col overflow-hidden bg-[#282828] rounded-xl border border-[#333333] shadow-md"
          style={{ height: `${outlinerHeight}px`, flexShrink: 0 }}
        >
          <Outliner />
        </div>
        
        {/* Horizontal Splitter for Panels */}
        <div 
          className="h-1 w-full cursor-row-resize hover:bg-[#4772b3] transition-colors flex-shrink-0"
          onMouseDown={() => setIsDraggingOutliner(true)}
        />

        {/* Bottom Half: Properties */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#282828] rounded-xl border border-[#333333] shadow-md">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
