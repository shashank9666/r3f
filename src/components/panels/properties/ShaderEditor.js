"use client";

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const DEFAULT_FRAG = `void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Simple color inversion as an example
  outputColor = vec4(1.0 - inputColor.rgb, inputColor.a);
}
`;

export default function ShaderEditor({ shader, onSave, onClose }) {
  const [name, setName] = useState(shader ? shader.name : 'Custom Effect');
  const [fragmentShader, setFragmentShader] = useState(shader ? shader.fragmentShader || DEFAULT_FRAG : DEFAULT_FRAG);
  
  const handleSave = () => {
    onSave({
      id: shader ? shader.id : undefined,
      name,
      fragmentShader,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#282828] border border-[#3e3e3e] w-[600px] h-[500px] flex flex-col rounded shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-[#3e3e3e] bg-[#1e1e1e]">
          <div className="text-white font-semibold flex items-center gap-2">
            <span className="text-blue-400">Shader Editor</span>
            <input 
              className="bg-transparent border-b border-[#555] text-white text-sm outline-none w-48 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Shader Name"
            />
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Code Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] p-4 relative">
          <div className="text-[#a4a4a4] text-xs mb-2 font-semibold">
            Fragment Shader (GLSL)
          </div>
          <div className="text-[#888] text-[11px] mb-2 leading-relaxed">
            Available parameters: <code className="text-[#ccc] bg-[#333] px-1 rounded">vec4 inputColor</code>, <code className="text-[#ccc] bg-[#333] px-1 rounded">vec2 uv</code>, <code className="text-[#ccc] bg-[#333] px-1 rounded">out vec4 outputColor</code><br/>
            Uniforms: <code className="text-[#ccc] bg-[#333] px-1 rounded">float time</code>
          </div>
          <textarea
            className="flex-1 bg-[#151515] text-[#d4d4d4] font-mono text-sm p-4 rounded border border-[#3e3e3e] outline-none resize-none focus:border-blue-500"
            value={fragmentShader}
            onChange={(e) => setFragmentShader(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#1e1e1e] border-t border-[#3e3e3e] flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded text-sm text-[#ccc] hover:bg-[#333] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded text-sm text-white bg-[#4772b3] hover:bg-[#395c91] transition-colors"
          >
            <Save size={14} />
            Save Shader
          </button>
        </div>
        
      </div>
    </div>
  );
}
