"use client";

import React, { useState } from 'react';
import { useStore } from "../../store/useStore";

const MESH_TYPES = [
  'Cube', 'Plane', 'Circle', 'Sphere', 'Cylinder', 'Cone', 'Torus', 'TorusKnot', 'Ring', 'Tube', 'Lathe', 'Extrude', 'Icosahedron', 'Octahedron', 'Dodecahedron', 'Tetrahedron', 'Polyhedron'
];

const LIGHT_TYPES = [
  'AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight', 'HemisphereLight', 'RectAreaLight'
];

const CAMERA_TYPES = [
  'PerspectiveCamera', 'OrthographicCamera', 'CubeCamera'
];

export default function AddMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const addObject = useStore((state) => state.addObject);

  const handleAdd = (type, category) => {
    addObject(type, category);
    setIsOpen(false);
    setHoveredCategory(null);
  };

  return (
    <div 
      className="relative group cursor-default"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => { setIsOpen(false); setHoveredCategory(null); }}
    >
      <div className={`py-1.5 px-3 rounded transition-colors ${isOpen ? 'bg-[#3b3b3b]' : 'hover:bg-[#3b3b3b]'}`}>
        Add
      </div>
      
      {isOpen && (
        <div className="absolute left-0 top-full bg-[#333333] border border-black/30 rounded shadow-2xl min-w-[180px] py-1 z-50">
          
          {/* MESH MENU */}
          <div 
            className="relative px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white flex justify-between items-center"
            onMouseEnter={() => setHoveredCategory('mesh')}
          >
            <span>Mesh</span>
            <span>▶</span>
            {hoveredCategory === 'mesh' && (
              <div className="absolute left-full top-0 bg-[#333333] border border-black/30 rounded shadow-2xl min-w-[150px] py-1 max-h-[300px] overflow-y-auto">
                {MESH_TYPES.map(type => (
                  <div 
                    key={type} 
                    className="px-4 py-1.5 text-[#cccccc] hover:bg-[#2d4b73] hover:text-white"
                    onClick={() => handleAdd(type, 'mesh')}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIGHT MENU */}
          <div 
            className="relative px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white flex justify-between items-center"
            onMouseEnter={() => setHoveredCategory('light')}
          >
            <span>Light</span>
            <span>▶</span>
            {hoveredCategory === 'light' && (
              <div className="absolute left-full top-0 bg-[#333333] border border-black/30 rounded shadow-2xl min-w-[150px] py-1">
                {LIGHT_TYPES.map(type => (
                  <div 
                    key={type} 
                    className="px-4 py-1.5 text-[#cccccc] hover:bg-[#2d4b73] hover:text-white"
                    onClick={() => handleAdd(type, 'light')}
                  >
                    {type.replace('Light', ' Light')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CAMERA MENU */}
          <div 
            className="relative px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white flex justify-between items-center"
            onMouseEnter={() => setHoveredCategory('camera')}
          >
            <span>Camera</span>
            <span>▶</span>
            {hoveredCategory === 'camera' && (
              <div className="absolute left-full top-0 bg-[#333333] border border-black/30 rounded shadow-2xl min-w-[160px] py-1">
                {CAMERA_TYPES.map(type => (
                  <div 
                    key={type} 
                    className="px-4 py-1.5 text-[#cccccc] hover:bg-[#2d4b73] hover:text-white"
                    onClick={() => handleAdd(type, 'camera')}
                  >
                    {type.replace('Camera', ' Camera')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EMPTY MENU */}
          <div 
            className="px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white"
            onMouseEnter={() => setHoveredCategory(null)}
            onClick={() => handleAdd('Empty', 'empty')}
          >
            Empty
          </div>

          {/* EFFECTS MENU (Placeholder) */}
          <div 
            className="px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white"
            onMouseEnter={() => setHoveredCategory(null)}
            onClick={() => handleAdd('Text', 'text')}
          >
            Text
          </div>

        </div>
      )}
    </div>
  );
}
