import { useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../../lib/storage.js';
import './ThemeSelector.css';

const THEMES = [
  { id:'default',       label:'Default',       icon:'🌙' },
  { id:'dark',          label:'Dark',           icon:'⬛' },
  { id:'high-contrast', label:'High Contrast',  icon:'🔆' },
  { id:'light',         label:'Light',          icon:'☀️' },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState(() => loadSettings().theme ?? 'default');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const settings = loadSettings();
    saveSettings({ ...settings, theme });
  }, [theme]);

  return (
    <div className="theme-selector">
      {THEMES.map(t => (
        <button
          key={t.id}
          className={`theme-btn ${theme === t.id ? 'active' : ''}`}
          onClick={() => setTheme(t.id)}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
