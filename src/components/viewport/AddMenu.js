"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';

export default function AddMenu({ position, onClose }) {
  const addObject = useStore(state => state.addObject);
  const menuRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAdd = (type, category) => {
    addObject(type, category);
    onClose();
  };

  const categories = {
    Mesh: ['Cube', 'Sphere', 'Plane', 'Cylinder', 'Cone', 'Torus', 'TorusKnot'],
    Light: ['AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight'],
    Camera: ['Camera'],
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-[#1d1d1d] border border-[#303030] rounded shadow-xl text-[#cccccc] font-sans text-sm min-w-[150px]"
      style={{ left: position.x, top: position.y }}
    >
      <div className="py-1">
        <div className="px-3 py-1 font-bold text-white border-b border-[#303030] mb-1">Add</div>
        
        {Object.keys(categories).map(category => (
          <div 
            key={category}
            className="relative"
            onMouseEnter={() => setActiveCategory(category)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="px-4 py-1.5 hover:bg-[#2d2d2d] cursor-default flex justify-between items-center">
              <span>{category}</span>
              <span className="text-xs text-[#888888]">▶</span>
            </div>
            
            {activeCategory === category && (
              <div className="absolute left-full top-0 bg-[#1d1d1d] border border-[#303030] rounded shadow-xl py-1 min-w-[150px]">
                {categories[category].map(type => (
                  <div 
                    key={type}
                    className="px-4 py-1.5 hover:bg-[#2a4b8d] hover:text-white cursor-pointer"
                    onClick={() => handleAdd(type, category.toLowerCase())}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
