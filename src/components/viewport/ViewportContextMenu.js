"use client";

import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';

export default function ViewportContextMenu({ x, y, onClose }) {
  const selectedIds = useStore(state => state.selectedIds);
  const activeId = useStore(state => state.activeId);
  const objects = useStore(state => state.objects);
  const deleteObjects = useStore(state => state.deleteObjects);
  const duplicateObjects = useStore(state => state.duplicateObjects);
  const collections = useStore(state => state.collections);
  const updateObject = useStore(state => state.updateObject);

  // Close context menu if clicked outside
  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [onClose]);

  if (selectedIds.length === 0) return null;

  const handleCopy = async () => {
    const selectedObjects = objects.filter(o => selectedIds.includes(o.id));
    try {
      await navigator.clipboard.writeText(JSON.stringify({
        type: 'r3f-clone-clipboard',
        objects: selectedObjects
      }));
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleMoveToCollection = () => {
    // A simple prompt for collection name. In a real app this would be a sub-menu.
    const colName = window.prompt("Enter collection name to move to:");
    if (!colName) return;
    const col = collections.find(c => c.name.toLowerCase() === colName.toLowerCase());
    if (col) {
      selectedIds.forEach(id => updateObject(id, { collectionId: col.id }));
    } else {
      alert("Collection not found!");
    }
  };

  return (
    <div 
      className="fixed z-50 bg-[#2b2b2b] border border-[#1d1d1d] shadow-2xl rounded-sm w-64 text-[#cccccc] text-xs font-sans py-1"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div className="px-3 py-1.5 text-white bg-[#303030] font-medium border-b border-[#1d1d1d] mb-1">
        Object
      </div>

      <div 
        className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer flex justify-between"
        onClick={() => { handleCopy(); onClose(); }}
      >
        <span>Copy Objects</span>
        <span className="text-[#888]">Ctrl C</span>
      </div>
      <div 
        className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer flex justify-between"
        onClick={() => { 
          // Paste relies on navigator.clipboard, easiest to just trigger native or tell user
          alert("Please use Ctrl+V to paste.");
          onClose(); 
        }}
      >
        <span>Paste Objects</span>
        <span className="text-[#888]">Ctrl V</span>
      </div>

      <div className="my-1 border-t border-[#1d1d1d]"></div>

      <div 
        className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer flex justify-between"
        onClick={() => { duplicateObjects(selectedIds); onClose(); }}
      >
        <span>Duplicate Objects</span>
        <span className="text-[#888]">Shift D</span>
      </div>

      <div className="my-1 border-t border-[#1d1d1d]"></div>

      <div 
        className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer flex justify-between"
        onClick={() => { 
          if (activeId) {
            const obj = objects.find(o => o.id === activeId);
            const newName = window.prompt("Rename Active Object:", obj?.name || activeId);
            if (newName) updateObject(activeId, { name: newName });
          }
          onClose(); 
        }}
      >
        <span>Rename Active Object...</span>
        <span className="text-[#888]">F2</span>
      </div>

      <div className="my-1 border-t border-[#1d1d1d]"></div>

      <div 
        className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer flex justify-between"
        onClick={() => { handleMoveToCollection(); onClose(); }}
      >
        <span>Move to Collection</span>
        <span className="text-[#888]">M</span>
      </div>

      <div className="my-1 border-t border-[#1d1d1d]"></div>

      <div 
        className="px-6 py-1 hover:bg-[#e53935] hover:text-white cursor-pointer flex justify-between"
        onClick={() => { deleteObjects(selectedIds); onClose(); }}
      >
        <span>Delete</span>
        <span className="text-[#888]">X</span>
      </div>
    </div>
  );
}
