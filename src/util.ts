export function isNumber(val) {
  return typeof val === 'number';
}

export function isBool(val) {
  return typeof val === 'boolean';
}

export function isString(val) {
  return typeof val === 'string';
}

export function isObject(val) {
  return val !== null && typeof val === 'object';
}

export function isArray(val) {
  return Array.isArray(val);
}
