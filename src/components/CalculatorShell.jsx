import { useState } from 'react';
import FxCG100 from './fx-CG100/FxCG100.jsx';
import Fx5800P from './fx-5800P/Fx5800P.jsx';
import ThemeSelector from './shared/ThemeSelector.jsx';
import SplitScreen from './shared/SplitScreen.jsx';
import HistoryTape from './shared/HistoryTape.jsx';
import { useHistory } from '../hooks/useHistory.js';

const MODELS = [
  { id: 'cg100', label: 'fx-CG100', desc: 'Color Graphing' },
  { id: '5800p', label: 'fx-5800P', desc: 'Programmable' },
];

export default function CalculatorShell() {
  const [model, setModel]   = useState('cg100');
  const [split, setSplit]   = useState(false);
  const { history, addToHistory, clearHistory } = useHistory();

  // When a history item is clicked, we just show it (calculators handle input internally)
  const handleHistorySelect = () => {};

  const calculator = model === 'cg100'
    ? <FxCG100 addToHistory={addToHistory} />
    : <Fx5800P addToHistory={addToHistory} />;

  const historyPanel = (
    <HistoryTape
      history={history}
      onSelect={handleHistorySelect}
      onClear={clearHistory}
    />
  );

  return (
    <div className="shell">
      {/* ── Toolbar ── */}
      <div className="shell-toolbar">
        <div className="model-tabs">
          {MODELS.map(m => (
            <button
              key={m.id}
              className={`model-tab ${model === m.id ? 'active' : ''}`}
              onClick={() => setModel(m.id)}
            >
              <span className="model-tab-name">{m.label}</span>
              <span className="model-tab-desc">{m.desc}</span>
            </button>
          ))}
        </div>
        <ThemeSelector />
      </div>

      {/* ── Main ── */}
      <div className="shell-content">
        <SplitScreen
          enabled={split}
          onToggle={() => setSplit(s => !s)}
          left={calculator}
          right={historyPanel}
        />
      </div>

      {/* ── Footer ── */}
      <div className="shell-footer">
        <span>Casio Scientific Calculator Emulator • Offline Ready</span>
        <button
          className="history-toggle-btn"
          onClick={() => setSplit(s => !s)}
          title="Toggle history panel"
        >
          {split ? '📋 Hide' : '📋 History'}
        </button>
      </div>
    </div>
  );
}
