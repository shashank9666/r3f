"use client";

import React from 'react';
import { useStore } from '../../../store/useStore';
import { Wrench } from 'lucide-react';
import { MODIFIERS } from '../../../lib/drei/modifierCatalog';
import { ParamList, CollapsibleFeature } from './ParamField';

export default function ModifierProperties({ activeObject }) {
  const updateObjectModifier = useStore(state => state.updateObjectModifier);

  if (!activeObject) return null;

  const active = MODIFIERS.filter((m) => activeObject.modifiers?.[m.id]?.enabled).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2 border-b border-[#1d1d1d] pb-2">
        <div className="flex items-center gap-2 font-semibold text-[13px] text-blue-400">
          <Wrench size={16} />
          <span>Modifiers</span>
        </div>
        <span className="text-[10px] text-[#777]">{active} active</span>
      </div>

      <div className="text-[10px] text-[#7a7a7a] leading-snug">
        Modifiers wrap the object with a drei component. They stack top to bottom,
        outermost first.
      </div>

      {MODIFIERS.map((modifier) => (
        <CollapsibleFeature
          key={modifier.id}
          label={modifier.label}
          enabled={activeObject.modifiers?.[modifier.id]?.enabled}
          onToggle={(enabled) => updateObjectModifier(activeObject.id, modifier.id, { enabled })}
          defaultOpen={false}
        >
          <ParamList
            schema={modifier.params}
            values={activeObject.modifiers?.[modifier.id]}
            onChange={(updates) => updateObjectModifier(activeObject.id, modifier.id, updates)}
          />
        </CollapsibleFeature>
      ))}
    </div>
  );
}
