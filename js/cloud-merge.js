// BelvaDeva cloud save foundation.
// Firebase setup is required before enabling live synchronization.
// Local game progress remains stored in the existing profiles module.
export const CLOUD_SCHEMA_VERSION = 1;
export function mergeAchievements(a = {}, b = {}) {
  const result = {...a};
  for (const [mission, value] of Object.entries(b)) {
    const previous = result[mission];
    result[mission] = previous
      ? {times: Math.max(previous.times || 0, value.times || 0),
         last: [previous.last || '', value.last || ''].sort().at(-1)}
      : structuredClone(value);
  }
  return result;
}
export function mergeEventLog(a = [], b = []) {
  const unique = new Map();
  for (const event of [...a, ...b]) {
    if (!event.id) throw Error('Cloud events require stable unique IDs');
    unique.set(event.id, event);
  }
  return [...unique.values()].sort((x,y)=>(x.timestamp||0)-(y.timestamp||0));
}
export function createEventId() {
  if (!globalThis.crypto?.randomUUID) throw Error('Secure event IDs unavailable');
  return crypto.randomUUID();
}
