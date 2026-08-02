/* eslint-disable */
"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';

export default function RenameDialog({ activeId, onClose }) {
  const updateObject = useStore(state => state.updateObject);
  const objects = useStore(state => state.objects);
  
  const [name, setName] = useState('');
  
  useEffect(() => {
    const obj = objects.find(o => o.id === activeId);
    if (obj && obj.name) {
      setName(obj.name);
    } else if (obj) {
      setName(obj.id); // fallback
    }
  }, [activeId, objects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      updateObject(activeId, { name: name.trim() });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-[#1d1d1d] border border-[#303030] p-2 rounded shadow-xl pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#2d2d2d] text-white px-2 py-1 outline-none border border-[#404040] rounded text-sm w-[200px]"
            placeholder="Object Name"
          />
          <button type="submit" className="bg-[#444444] hover:bg-[#555555] text-white px-3 py-1 rounded text-sm font-semibold">
            Rename
          </button>
        </form>
      </div>
    </div>
  );
}
