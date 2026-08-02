/**
 * Tiny schema helpers shared by every drei catalog (objects, materials, modifiers,
 * effects, render/world features). A schema is just an array of field descriptors;
 * `ParamField` renders them and `defaultsFor` seeds new instances.
 */

export const num = (key, label, def, min = 0, max = 10, step = 0.01) => ({
  key, label, type: 'number', def, min, max, step,
});

export const int = (key, label, def, min = 0, max = 100, step = 1) => ({
  key, label, type: 'number', def, min, max, step, integer: true,
});

export const bool = (key, label, def = false) => ({ key, label, type: 'bool', def });

export const color = (key, label, def = '#ffffff') => ({ key, label, type: 'color', def });

export const select = (key, label, def, options) => ({
  key, label, type: 'select', def,
  options: options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
});

export const text = (key, label, def = '') => ({ key, label, type: 'text', def });

export const url = (key, label, def = '') => ({ key, label, type: 'url', def });

export const vec3 = (key, label, def = [0, 0, 0], step = 0.1) => ({
  key, label, type: 'vec3', def, step,
});

/** Collapse a schema into a plain `{ key: default }` object. */
export function defaultsFor(schema = []) {
  const out = {};
  for (const field of schema) out[field.key] = field.def;
  return out;
}

/** Merge stored values over schema defaults so older objects pick up new fields. */
export function resolveParams(schema = [], stored = {}) {
  const out = defaultsFor(schema);
  for (const field of schema) {
    if (stored[field.key] !== undefined) out[field.key] = stored[field.key];
  }
  return out;
}
