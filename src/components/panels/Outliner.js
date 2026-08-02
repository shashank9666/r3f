"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Box, Sun, Video, Eye, EyeOff, Camera, CameraOff, Triangle, ChevronDown, ChevronRight, Archive, Check, MousePointer2 } from 'lucide-react';

export default function Outliner() {
  const objects = useStore(state => state.objects);
  const collections = useStore(state => state.collections);
  const activeCollectionId = useStore(state => state.activeCollectionId);
  const setActiveCollectionId = useStore(state => state.setActiveCollectionId);
  const selectedIds = useStore(state => state.selectedIds);
  const setSelectedIds = useStore(state => state.setSelectedIds);
  const updateObject = useStore(state => state.updateObject);
  const updateCollection = useStore(state => state.updateCollection);
  const addCollection = useStore(state => state.addCollection);
  const deleteCollection = useStore(state => state.deleteCollection);
  
  // Local state for context menu, dragging, and renaming
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleSelectObject = (e, id) => {
    e.stopPropagation();
    if (editingId) return; // Prevent selection while renaming
    if (e.shiftKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(selId => selId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  const handleSelectCollection = (e, id) => {
    e.stopPropagation();
    if (editingId) return;
    setActiveCollectionId(id);
    setSelectedIds([]); // Deselect objects when clicking a collection
  };

  const startEditing = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const commitEdit = (type, id) => {
    if (editName.trim()) {
      if (type === 'object') {
        updateObject(id, { name: editName.trim() });
      } else {
        updateCollection(id, { name: editName.trim() });
      }
    }
    setEditingId(null);
  };

  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (editingId) return;
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type // 'object' | 'collection'
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e, item, type) => {
    if (editingId) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    setDraggedItem({ item, type });
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetCollectionId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItem) return;

    if (draggedItem.type === 'object') {
      updateObject(draggedItem.item.id, { collectionId: targetCollectionId });
    } else if (draggedItem.type === 'collection') {
      // Prevent dropping a collection into itself or root into anything
      if (draggedItem.item.id !== targetCollectionId && draggedItem.item.id !== 'root') {
        // Prevent cyclic dependencies (simplified: just don't drop parent into child)
        updateCollection(draggedItem.item.id, { parentId: targetCollectionId });
      }
    }
    setDraggedItem(null);
  };

  const getIcon = (category, type) => {
    if (category === 'camera') return <Video size={14} className="text-[#a4a4a4]" />;
    if (category === 'light') return <Sun size={14} className="text-[#a4a4a4]" />;
    if (category === 'mesh') return <Triangle size={14} className="text-[#a4a4a4]" />;
    return <Box size={14} className="text-[#a4a4a4]" />;
  };

  const renderObject = (obj, indent) => {
    const isSelected = selectedIds.includes(obj.id);
    const isVisible = obj.visible !== false;
    const isRenderable = obj.renderable !== false;
    const isSelectable = obj.selectable !== false;
    const isEditing = editingId === obj.id;

    return (
      <div 
        key={obj.id}
        draggable={!isEditing}
        onDragStart={(e) => handleDragStart(e, obj, 'object')}
        onClick={(e) => handleSelectObject(e, obj.id)}
        onContextMenu={(e) => handleContextMenu(e, obj, 'object')}
        onDoubleClick={(e) => {
          e.stopPropagation();
          startEditing(obj.id, obj.name || obj.id);
        }}
        className={`flex items-center px-2 py-0.5 cursor-pointer select-none group ${isSelected ? 'bg-[#2a4b8d] text-white' : 'hover:bg-[#383838]'}`}
        style={{ paddingLeft: `${indent}px` }}
      >
        <div className="w-4 flex-shrink-0" />
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {getIcon(obj.category, obj.type)}
          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() => commitEdit('object', obj.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit('object', obj.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
              className="bg-[#1d1d1d] text-white outline-none border border-[#404040] rounded-sm px-1 py-0 w-full text-xs"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate">{obj.name || obj.id}</span>
          )}
        </div>

        {/* Toggles */}
        <div className={`px-1 flex items-center justify-center opacity-0 group-hover:opacity-100 ${!isSelectable ? 'opacity-100' : ''}`} onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { selectable: !isSelectable }); }}>
          {isSelectable ? <MousePointer2 size={13} className={isSelected ? 'text-white' : 'text-[#888]'} /> : <MousePointer2 size={13} className="text-[#ff4444]" />}
        </div>
        <div className={`px-1 flex items-center justify-center opacity-0 group-hover:opacity-100 ${!isVisible ? 'opacity-100' : ''}`} onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !isVisible }); }}>
          {isVisible ? <Eye size={13} className={isSelected ? 'text-white' : 'text-[#888]'} /> : <EyeOff size={13} className="text-[#ff4444]" />}
        </div>
        <div className={`px-1 flex items-center justify-center opacity-0 group-hover:opacity-100 ${!isRenderable ? 'opacity-100' : ''}`} onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { renderable: !isRenderable }); }}>
          {isRenderable ? <Camera size={13} className={isSelected ? 'text-white' : 'text-[#888]'} /> : <CameraOff size={13} className="text-[#ff4444]" />}
        </div>
      </div>
    );
  };

  const renderCollection = (collectionId, indent) => {
    const col = collections.find(c => c.id === collectionId);
    if (!col) return null;

    const isActive = activeCollectionId === col.id;
    const isVisible = col.visible !== false;
    const isRenderable = col.renderable !== false;
    const isSelectable = col.selectable !== false; // Using selectable as the view layer checkmark equivalent for now
    const isEditing = editingId === col.id;

    // Get children
    const childCollections = collections.filter(c => c.parentId === col.id);
    const childObjects = objects.filter(o => (o.collectionId || 'root') === col.id);

    return (
      <div key={col.id}>
        <div 
          draggable={col.id !== 'root' && !isEditing}
          onDragStart={(e) => handleDragStart(e, col, 'collection')}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
          onClick={(e) => handleSelectCollection(e, col.id)}
          onContextMenu={(e) => handleContextMenu(e, col, 'collection')}
          onDoubleClick={(e) => {
            e.stopPropagation();
            startEditing(col.id, col.name);
          }}
          className={`flex items-center px-2 py-0.5 cursor-pointer select-none group ${isActive ? 'bg-[#404040]' : 'hover:bg-[#383838]'}`}
          style={{ paddingLeft: `${indent}px` }}
        >
          {/* Expand/Collapse Chevron */}
          <div 
            className="w-4 h-4 flex items-center justify-center hover:bg-[#555] rounded-sm cursor-pointer"
            onClick={(e) => { e.stopPropagation(); updateCollection(col.id, { isExpanded: !col.isExpanded }); }}
          >
            {col.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          
          <div className="flex items-center gap-2 flex-1 overflow-hidden ml-1">
            <Archive size={14} className={isActive ? 'text-white' : 'text-[#cccccc]'} />
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => commitEdit('collection', col.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit('collection', col.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                className="bg-[#1d1d1d] text-white outline-none border border-[#404040] rounded-sm px-1 py-0 w-full text-xs font-semibold"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className={`truncate font-semibold ${isActive ? 'text-white' : ''}`}>{col.name}</span>
            )}
          </div>

          {/* Collection Toggles */}
          <div className={`px-1 flex items-center justify-center ${!isSelectable ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={(e) => { e.stopPropagation(); updateCollection(col.id, { selectable: !isSelectable }); }}>
            {isSelectable ? <Check size={13} className="text-[#888]" /> : <Check size={13} className="text-[#ff4444]" />}
          </div>
          <div className={`px-1 flex items-center justify-center ${!isVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={(e) => { e.stopPropagation(); updateCollection(col.id, { visible: !isVisible }); }}>
            {isVisible ? <Eye size={13} className="text-[#888]" /> : <EyeOff size={13} className="text-[#ff4444]" />}
          </div>
          <div className={`px-1 flex items-center justify-center ${!isRenderable ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={(e) => { e.stopPropagation(); updateCollection(col.id, { renderable: !isRenderable }); }}>
            {isRenderable ? <Camera size={13} className="text-[#888]" /> : <CameraOff size={13} className="text-[#ff4444]" />}
          </div>
        </div>

        {/* Render Children if expanded */}
        {col.isExpanded && (
          <div>
            {childCollections.map(childCol => renderCollection(childCol.id, indent + 16))}
            {childObjects.map(childObj => renderObject(childObj, indent + 16))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#282828] text-[#cccccc] text-xs font-sans relative"
      onClick={closeContextMenu}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#303030] border-b border-[#1d1d1d]">
        <div className="flex items-center gap-2 font-semibold">
          <Box size={14} />
          <span>Outliner</span>
        </div>
      </div>

      {/* List */}
      <div 
        className="flex-1 overflow-y-auto py-1"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'root')}
      >
        {renderCollection('root', 8)}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="absolute z-50 bg-[#303030] border border-[#1d1d1d] shadow-xl py-1 rounded-md min-w-[150px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.type === 'collection' && (
            <>
              <div className="px-3 py-1.5 text-[#aaaaaa] font-medium border-b border-[#1d1d1d] mb-1">
                Collection
              </div>
              <div 
                className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer"
                onClick={() => {
                  const name = window.prompt("Subcollection Name:", "New Collection");
                  if (name) addCollection(name, contextMenu.item.id);
                  closeContextMenu();
                }}
              >
                New
              </div>
              <div className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer opacity-50">Duplicate Collection</div>
              <div className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer opacity-50">Duplicate Linked</div>
              <div className="my-1 border-t border-[#1d1d1d]"></div>
              
              <div className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer flex justify-between opacity-50">
                <span>Copy</span><span className="text-[#888]">Ctrl C</span>
              </div>
              <div className="px-6 py-1 hover:bg-[#2a4b8d] cursor-pointer flex justify-between opacity-50">
                <span>Paste</span><span className="text-[#888]">Ctrl V</span>
              </div>
              <div className="my-1 border-t border-[#1d1d1d]"></div>

              {contextMenu.item.id !== 'root' && (
                <>
                  <div 
                    className="px-6 py-1 hover:bg-[#e53935] cursor-pointer flex justify-between"
                    onClick={() => {
                      if (window.confirm("Delete collection? Contents will be moved to root.")) {
                        deleteCollection(contextMenu.item.id);
                      }
                      closeContextMenu();
                    }}
                  >
                    <span>Delete</span><span className="text-[#888]">X</span>
                  </div>
                  <div 
                    className="px-6 py-1 hover:bg-[#e53935] cursor-pointer"
                    onClick={() => {
                      if (window.confirm("Delete collection AND all its contents?")) {
                        // Gather all objects inside and delete them
                        const objectsToDelete = useStore.getState().objects
                          .filter(o => o.collectionId === contextMenu.item.id)
                          .map(o => o.id);
                        if (objectsToDelete.length > 0) {
                          useStore.getState().deleteObjects(objectsToDelete);
                        }
                        deleteCollection(contextMenu.item.id);
                      }
                      closeContextMenu();
                    }}
                  >
                    Delete Hierarchy
                  </div>
                </>
              )}
            </>
          )}
          {contextMenu.type === 'object' && (
            <>
              <div 
                className="px-4 py-1 hover:bg-[#2a4b8d] cursor-pointer"
                onClick={() => {
                  const newName = window.prompt("Rename Object:", contextMenu.item.name || contextMenu.item.id);
                  if (newName) updateObject(contextMenu.item.id, { name: newName });
                  closeContextMenu();
                }}
              >
                Rename Object
              </div>
              <div 
                className="px-4 py-1 hover:bg-[#2a4b8d] cursor-pointer"
                onClick={() => {
                  // Duplicate
                  useStore.getState().duplicateObjects([contextMenu.item.id]);
                  closeContextMenu();
                }}
              >
                Copy / Duplicate
              </div>
              <div 
                className="px-4 py-1 hover:bg-[#e53935] cursor-pointer text-[#ff6b6b]"
                onClick={() => {
                  if (window.confirm("Delete object?")) {
                    useStore.getState().deleteObjects([contextMenu.item.id]);
                  }
                  closeContextMenu();
                }}
              >
                Delete Object
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
