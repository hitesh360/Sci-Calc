const APPS = [
  { id:'run',    icon:'▶', label:'Run-Matrix' },
  { id:'graph',  icon:'📈', label:'Graph' },
  { id:'stats',  icon:'📊', label:'Statistics' },
  { id:'3d',     icon:'🌐', label:'3D Graph' },
  { id:'python', icon:'🐍', label:'Python' },
  { id:'spreadsheet', icon:'📋', label:'Spreadsheet' },
];

export default function AppMenu({ onSelect }) {
  return (
    <div className="app-menu">
      <div className="app-menu-title">MAIN MENU</div>
      <div className="app-menu-grid">
        {APPS.map(app => (
          <button
            key={app.id}
            className="app-menu-item"
            onClick={() => onSelect(app.id)}
          >
            <span className="app-menu-icon">{app.icon}</span>
            <span className="app-menu-label">{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
