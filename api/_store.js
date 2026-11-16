// Best-effort in-memory log of recent requests (resets on cold start).
const MAX = 50;
globalThis.__nxlogs = globalThis.__nxlogs || [];

export function addLog(entry) {
  globalThis.__nxlogs.unshift(entry);
  globalThis.__nxlogs.length = Math.min(globalThis.__nxlogs.length, MAX);
}

export function getLogs() {
  return globalThis.__nxlogs;
}

export function clearLogs() {
  globalThis.__nxlogs = [];
}
