"use client";

import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Wand2, RotateCcw } from 'lucide-react';
import { EFFECTS } from '../../../lib/drei/effectCatalog';
import { ParamList, CollapsibleFeature } from './ParamField';
import ShaderEditor from './ShaderEditor';

export default function PostProcessingProperties() {
  const settings = useStore(state => state.postProcessingSettings);
  const updateSettings = useStore(state => state.updatePostProcessingSettings);
  const effects = useStore(state => state.effects);
  const updateEffect = useStore(state => state.updateEffect);
  const resetEffects = useStore(state => state.resetEffects);
  
  const customShaders = useStore(state => state.customShaders || []);
  const addCustomShader = useStore(state => state.addCustomShader);
  const updateCustomShader = useStore(state => state.updateCustomShader);
  const deleteCustomShader = useStore(state => state.deleteCustomShader);
  const toggleCustomShader = useStore(state => state.toggleCustomShader);

  const [filter, setFilter] = useState('');
  const [editingShader, setEditingShader] = useState(null);

  const visible = EFFECTS.filter((e) =>
    e.label.toLowerCase().includes(filter.toLowerCase())
  );
  const activeCount = EFFECTS.filter((e) => effects?.[e.id]?.enabled).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2 border-b border-[#1d1d1d] pb-2">
        <div className="flex items-center gap-2 font-semibold text-[13px] text-blue-400">
          <Wand2 size={16} />
          <span>Effects Composer</span>
        </div>
        <button
          onClick={resetEffects}
          title="Reset all effects"
          className="p-1 hover:bg-[#383838] text-[#a4a4a4] hover:text-white rounded transition-colors"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="bg-[#303030] rounded border border-[#1d1d1d]">
        <div className="p-2 font-semibold text-[#a4a4a4] bg-[#2d2d2d] border-b border-[#1d1d1d] flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateSettings({ enabled: e.target.checked })}
            className="accent-[#4772b3]"
          />
          <span className="flex-1">Enable Effects Pipeline</span>
          <span className="text-[10px] text-[#777] font-normal">{activeCount} active</span>
        </div>
        {settings.enabled && (
          <div className="p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[#a4a4a4]">Multisampling</span>
              <select
                className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-24"
                value={settings.multisampling}
                onChange={(e) => updateSettings({ multisampling: parseInt(e.target.value, 10) })}
              >
                {[0, 2, 4, 8].map((n) => <option key={n} value={n}>{n === 0 ? 'Off' : `${n}x`}</option>)}
              </select>
            </div>
            <input
              type="text"
              value={filter}
              placeholder="Filter effects…"
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs w-full"
            />
          </div>
        )}
      </div>

      {settings.enabled && visible.map((effect) => (
        <CollapsibleFeature
          key={effect.id}
          label={effect.label}
          enabled={effects?.[effect.id]?.enabled}
          onToggle={(enabled) => updateEffect(effect.id, { enabled })}
          defaultOpen={false}
        >
          <ParamList
            schema={effect.params}
            values={effects?.[effect.id]}
            onChange={(updates) => updateEffect(effect.id, updates)}
          />
        </CollapsibleFeature>
      ))}

      {settings.enabled && visible.length === 0 && (
        <div className="text-[#666] text-[11px] text-center py-4">No effects match “{filter}”.</div>
      )}
      {/* Custom Shaders Section */}
      {settings.enabled && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#a4a4a4] font-semibold text-xs">Custom Shaders</h3>
            <button
              onClick={() => setEditingShader({})} // Open editor for new shader
              className="text-[#4772b3] hover:text-[#5a8cdb] text-xs font-semibold"
            >
              + Add Shader
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            {customShaders.map((shader) => (
              <div key={shader.id} className="bg-[#2d2d2d] border border-[#1d1d1d] rounded p-2 flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shader.enabled}
                    onChange={(e) => toggleCustomShader(shader.id, e.target.checked)}
                    className="accent-[#4772b3]"
                  />
                  <span className="text-white text-xs">{shader.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingShader(shader)}
                    className="text-[#888] hover:text-white text-xs"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Delete this custom shader?')) {
                        deleteCustomShader(shader.id);
                      }
                    }}
                    className="text-[#ff4444] hover:text-[#ff6666] text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {customShaders.length === 0 && (
              <div className="text-[#666] text-[11px] text-center py-2 bg-[#2d2d2d] border border-[#1d1d1d] rounded border-dashed">
                No custom shaders yet.
              </div>
            )}
          </div>
        </div>
      )}

      {editingShader && (
        <ShaderEditor
          shader={editingShader.id ? editingShader : null}
          onClose={() => setEditingShader(null)}
          onSave={(shader) => {
            if (shader.id) {
              updateCustomShader(shader.id, shader);
            } else {
              addCustomShader(shader);
            }
            setEditingShader(null);
          }}
        />
      )}
    </div>
  );
}
