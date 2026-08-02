"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { dreiMenuGroups } from '../../lib/drei/objectCatalog';

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

  // Built-in primitives first, then every group from the drei catalog
  const categories = [
    { label: 'Mesh', items: ['Cube', 'Sphere', 'Plane', 'Cylinder', 'Cone', 'Torus', 'TorusKnot'].map((t) => ({ id: t, label: t, category: 'mesh' })) },
    { label: 'Light', items: ['AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight'].map((t) => ({ id: t, label: t, category: 'light' })) },
    { label: 'Camera', items: [{ id: 'PerspectiveCamera', label: 'Perspective Camera', category: 'camera' }, { id: 'OrthographicCamera', label: 'Orthographic Camera', category: 'camera' }] },
    ...dreiMenuGroups().map(({ group, items }) => ({
      label: group,
      items: items.map((i) => ({ id: i.id, label: i.label, category: i.category || 'drei' })),
    })),
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[#1d1d1d] border border-[#303030] rounded shadow-xl text-[#cccccc] font-sans text-sm min-w-[150px]"
      style={{ left: position.x, top: position.y }}
    >
      <div className="py-1">
        <div className="px-3 py-1 font-bold text-white border-b border-[#303030] mb-1">Add</div>

        {categories.map(category => (
          <div
            key={category.label}
            className="relative"
            onMouseEnter={() => setActiveCategory(category.label)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="px-4 py-1.5 hover:bg-[#2d2d2d] cursor-default flex justify-between items-center">
              <span>{category.label}</span>
              <span className="text-xs text-[#888888]">▶</span>
            </div>

            {activeCategory === category.label && (
              <div className="absolute left-full top-0 bg-[#1d1d1d] border border-[#303030] rounded shadow-xl py-1 min-w-[190px] max-h-[70vh] overflow-y-auto custom-scrollbar">
                {category.items.map(item => (
                  <div
                    key={item.id}
                    className="px-4 py-1.5 hover:bg-[#2a4b8d] hover:text-white cursor-pointer"
                    onClick={() => handleAdd(item.id, item.category)}
                  >
                    {item.label}
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
