/**
 * storage.js – localStorage persistence helpers
 */

const PREFIX = 'scicalc_';

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch { /* quota exceeded – ignore */ }
}

export function load(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key);
}

export function clearAll() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .forEach(k => localStorage.removeItem(k));
}

// ── History ────────────────────────────────────────────────────────────────
export function loadHistory() {
  return load('history', []);
}

export function saveHistory(history) {
  save('history', history.slice(-500)); // keep last 500
}

// ── Variables ────────────────────────────────────────────────────────────────
export function loadVars() {
  return load('vars', {});
}

export function saveVars(vars) {
  save('vars', vars);
}

// ── Programs ────────────────────────────────────────────────────────────────
export function loadPrograms() {
  return load('programs', {});
}

export function savePrograms(programs) {
  save('programs', programs);
}

// ── Settings ────────────────────────────────────────────────────────────────
export function loadSettings() {
  return load('settings', { theme: 'default', angleMode: 'DEG' });
}

export function saveSettings(settings) {
  save('settings', settings);
}
