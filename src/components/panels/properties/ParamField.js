"use client";

/**
 * Generic control renderer for the drei catalogs. One `ParamField` per schema
 * field; `ParamList` renders a whole schema, and `CollapsibleFeature` is the
 * checkbox-headed card the feature panels use.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const LABEL = "text-[#a4a4a4]";
const INPUT = "bg-[#1d1d1d] text-white border border-[#404040] rounded px-2 py-1 outline-none text-xs";

function NumberField({ field, value, onChange }) {
  const parse = (raw) => (field.integer ? parseInt(raw, 10) : parseFloat(raw));
  const decimals = field.step >= 1 ? 0 : String(field.step).split('.')[1]?.length || 2;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className={LABEL}>{field.label}</span>
        <input
          type="number"
          className={`${INPUT} w-20 text-right`}
          value={value}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => {
            const parsed = parse(e.target.value);
            if (!Number.isNaN(parsed)) onChange(parsed);
          }}
        />
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(parse(e.target.value))}
        className="w-full accent-[#4772b3]"
        title={Number(value).toFixed(decimals)}
      />
    </div>
  );
}

function Vec3Field({ field, value, onChange }) {
  const vec = Array.isArray(value) ? value : [0, 0, 0];
  return (
    <div className="flex flex-col gap-1">
      <span className={LABEL}>{field.label}</span>
      <div className="flex gap-1">
        {['X', 'Y', 'Z'].map((axis, i) => (
          <input
            key={axis}
            type="number"
            step={field.step}
            className={`${INPUT} w-full text-right`}
            value={vec[i]}
            onChange={(e) => {
              const next = [...vec];
              const parsed = parseFloat(e.target.value);
              next[i] = Number.isNaN(parsed) ? 0 : parsed;
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ParamField({ field, value, onChange }) {
  switch (field.type) {
    case 'bool':
      return (
        <label className="flex items-center justify-between cursor-pointer">
          <span className={LABEL}>{field.label}</span>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="accent-[#4772b3]"
          />
        </label>
      );

    case 'color':
      return (
        <div className="flex items-center justify-between">
          <span className={LABEL}>{field.label}</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#ffffff'}
              onChange={(e) => onChange(e.target.value)}
              className="w-14 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
            />
            <span className="font-mono text-white text-[10px] uppercase w-14">{value}</span>
          </div>
        </div>
      );

    case 'select':
      return (
        <div className="flex items-center justify-between gap-2">
          <span className={LABEL}>{field.label}</span>
          <select
            className={`${INPUT} w-36`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );

    case 'text':
    case 'url':
      return (
        <div className="flex flex-col gap-1">
          <span className={LABEL}>{field.label}</span>
          <input
            type="text"
            className={`${INPUT} w-full`}
            value={value ?? ''}
            placeholder={field.type === 'url' ? 'https://…' : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case 'vec3':
      return <Vec3Field field={field} value={value} onChange={onChange} />;

    case 'number':
    default:
      return <NumberField field={field} value={value} onChange={onChange} />;
  }
}

export function ParamList({ schema, values, onChange }) {
  if (!schema?.length) {
    return <div className="text-[#666] text-[11px]">No options.</div>;
  }
  return (
    <div className="flex flex-col gap-3">
      {schema.map((field) => (
        <ParamField
          key={field.key}
          field={field}
          value={values?.[field.key] !== undefined ? values[field.key] : field.def}
          onChange={(next) => onChange({ [field.key]: next })}
        />
      ))}
    </div>
  );
}

/** Generic collapsible section (like Blender's panels) */
export function Section({ label, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col border-b border-[#1d1d1d]">
      <div 
        className="flex items-center gap-1.5 px-2 py-1.5 bg-[#303030] cursor-pointer select-none hover:bg-[#353535] transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[#888]">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span className="font-semibold text-[#dddddd] text-[11px] uppercase tracking-wide">{label}</span>
      </div>
      {open && (
        <div className="p-3 flex flex-col gap-3 bg-[#242424]">
          {children}
        </div>
      )}
    </div>
  );
}

/** Card with a checkbox in the header; body only renders when enabled. */
export function CollapsibleFeature({ label, note, enabled, onToggle, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col border-b border-[#1d1d1d]">
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#303030] hover:bg-[#353535] transition-colors select-none">
        <span
          className="text-[#888] cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <input
          type="checkbox"
          checked={Boolean(enabled)}
          onChange={(e) => onToggle(e.target.checked)}
          className="accent-[#4772b3]"
        />
        <span
          className="flex-1 font-semibold text-[#dddddd] text-[11px] uppercase tracking-wide cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          {label}
        </span>
      </div>
      {enabled && open && (
        <div className="p-3 flex flex-col gap-3 bg-[#242424]">
          {note && <div className="text-[10px] text-[#7a7a7a] leading-snug">{note}</div>}
          {children}
        </div>
      )}
    </div>
  );
}
