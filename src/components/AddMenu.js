"use client";

import React, { useRef, useState } from 'react';
import { useStore } from "../store/useStore";
import { dreiMenuGroups } from "../lib/drei/objectCatalog";

const MESH_TYPES = [
  'Cube', 'Plane', 'Circle', 'Sphere', 'Cylinder', 'Cone', 'Torus', 'TorusKnot', 'Ring', 'Tube', 'Lathe', 'Extrude', 'Icosahedron', 'Octahedron', 'Dodecahedron', 'Tetrahedron', 'Polyhedron'
];

const LIGHT_TYPES = [
  'AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight', 'HemisphereLight', 'RectAreaLight'
];

const CAMERA_TYPES = [
  'PerspectiveCamera', 'OrthographicCamera', 'CubeCamera'
];

const MATERIAL_TYPES = ['Standard', 'Basic', 'Physical', 'Phong', 'Lambert'];

const ROW = "px-4 py-1.5 text-[#cccccc] hover:bg-[#2d4b73] hover:text-white cursor-pointer";
const PANEL = "bg-[#333333] border border-black/30 rounded shadow-2xl py-1";

export default function AddMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredMesh, setHoveredMesh] = useState(null);
  // Offset of the material flyout, measured against the scrolling mesh list
  const [materialTop, setMaterialTop] = useState(0);
  const meshListRef = useRef(null);
  const addObject = useStore((state) => state.addObject);

  const close = () => {
    setIsOpen(false);
    setHoveredCategory(null);
    setHoveredMesh(null);
  };

  const handleAdd = (type, category, materialType) => {
    addObject(type, category, materialType ? { materialType: materialType.toLowerCase() } : {});
    close();
  };

  // The mesh list scrolls, so its own overflow clips any nested flyout. Track the
  // hovered row's offset and render the material flyout as a sibling of the list.
  const handleMeshHover = (e, type) => {
    const list = meshListRef.current;
    setMaterialTop(list ? e.currentTarget.offsetTop - list.scrollTop : 0);
    setHoveredMesh(type);
  };

  /** A top-level row that opens a simple flyout list. */
  const Submenu = ({ id, label, children, width = 'min-w-[170px]' }) => (
    <div
      className="relative px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white flex justify-between items-center cursor-default"
      onMouseEnter={() => { setHoveredCategory(id); setHoveredMesh(null); }}
    >
      <span>{label}</span>
      <span className="text-[10px] opacity-70">▶</span>
      {hoveredCategory === id && (
        <div className={`absolute left-full top-0 ${PANEL} ${width} max-h-[70vh] overflow-y-auto custom-scrollbar`}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="relative group cursor-default"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={close}
    >
      <div className={`py-1.5 px-3 rounded transition-colors ${isOpen ? 'bg-[#3b3b3b]' : 'hover:bg-[#3b3b3b]'}`}>
        Add
      </div>

      {isOpen && (
        <div className={`absolute left-0 top-full ${PANEL} min-w-[180px] z-50`}>

          {/* MESH — nested flyout for the material choice */}
          <div
            className="relative px-4 py-1.5 hover:bg-[#2d4b73] hover:text-white flex justify-between items-center cursor-default"
            onMouseEnter={() => setHoveredCategory('mesh')}
          >
            <span>Mesh</span>
            <span className="text-[10px] opacity-70">▶</span>
            {hoveredCategory === 'mesh' && (
              <div className="absolute left-full top-0 min-w-[150px]">
                <div
                  ref={meshListRef}
                  onScroll={() => setHoveredMesh(null)}
                  className={`${PANEL} max-h-[70vh] overflow-y-auto custom-scrollbar`}
                >
                  {MESH_TYPES.map(type => (
                    <div
                      key={type}
                      className={`px-4 py-1.5 flex justify-between items-center cursor-pointer ${hoveredMesh === type ? 'bg-[#2d4b73] text-white' : 'text-[#cccccc] hover:bg-[#2d4b73] hover:text-white'}`}
                      onMouseEnter={(e) => handleMeshHover(e, type)}
                      onClick={() => handleAdd(type, 'mesh', 'Standard')}
                    >
                      <span>{type}</span>
                      <span className="text-[10px] opacity-70">▶</span>
                    </div>
                  ))}
                </div>

                {hoveredMesh && (
                  <div
                    className={`absolute left-full ${PANEL} min-w-[150px] cursor-default`}
                    style={{ top: materialTop }}
                  >
                    {MATERIAL_TYPES.map(mat => (
                      <div
                        key={mat}
                        className={ROW}
                        onClick={(e) => { e.stopPropagation(); handleAdd(hoveredMesh, 'mesh', mat); }}
                      >
                        {mat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Submenu id="light" label="Light">
            {LIGHT_TYPES.map(type => (
              <div key={type} className={ROW} onClick={() => handleAdd(type, 'light')}>
                {type.replace('Light', ' Light')}
              </div>
            ))}
          </Submenu>

          <Submenu id="camera" label="Camera">
            {CAMERA_TYPES.map(type => (
              <div key={type} className={ROW} onClick={() => handleAdd(type, 'camera')}>
                {type.replace('Camera', ' Camera')}
              </div>
            ))}
          </Submenu>

          <div className="my-1 border-t border-black/40" />

          {/* Everything from the drei catalog, grouped as declared there */}
          {dreiMenuGroups().map(({ group, items }) => (
            <Submenu key={group} id={`drei-${group}`} label={group} width="min-w-[210px]">
              {items.map(item => (
                <div key={item.id} className={ROW} onClick={() => handleAdd(item.id, item.category || 'drei')}>
                  {item.label}
                </div>
              ))}
            </Submenu>
          ))}

          <div className="my-1 border-t border-black/40" />

          <div className={ROW} onMouseEnter={() => setHoveredCategory(null)} onClick={() => handleAdd('Empty', 'empty')}>
            Empty
          </div>
        </div>
      )}
    </div>
  );
}
