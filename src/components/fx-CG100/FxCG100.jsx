import { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator.js';
import { useKeyboard } from '../../hooks/useKeyboard.js';
import Screen from './Screen.jsx';
import Keypad from './Keypad.jsx';
import AppMenu from './AppMenu.jsx';
import GraphEngine from './GraphEngine.jsx';
import PythonShell from './PythonShell.jsx';
import './FxCG100.css';

export default function FxCG100({ addToHistory }) {
  const [activeApp, setActiveApp] = useState('run'); // run | graph | menu | python
  const calc = useCalculator({ addToHistory });

  useKeyboard(calc.press);

  const handleMenuSelect = (app) => setActiveApp(app);
  const handleKeyPress = (key) => {
    if (key === 'MENU') { setActiveApp('menu'); return; }
    if (key === 'EXIT' || key === 'AC') {
      if (activeApp !== 'run') { setActiveApp('run'); return; }
    }
    calc.press(key);
  };

  return (
    <div className="cg100-body" role="region" aria-label="Casio fx-CG100 Calculator">
      {/* Top speaker grille */}
      <div className="cg100-speaker" />

      {/* Screen area */}
      <div className="cg100-screen-bezel">
        {activeApp === 'menu' && <AppMenu onSelect={handleMenuSelect} />}
        {activeApp === 'run'  && (
          <Screen
            input={calc.input}
            result={calc.result}
            isError={calc.isError}
            angleMode={calc.angleMode}
          />
        )}
        {activeApp === 'graph' && (
          <GraphEngine expr={calc.input} />
        )}
        {activeApp === 'python' && (
          <PythonShell />
        )}
      </div>

      {/* Status bar below screen */}
      <div className="cg100-status-bar">
        <span>{calc.angleMode}</span>
        <span>{calc.isShift ? 'S' : '\u00a0'}</span>
        <span>{calc.isAlpha ? 'A' : '\u00a0'}</span>
        <span className="cg100-model-label">fx-CG100</span>
      </div>

      {/* Keypad */}
      <Keypad
        onPress={handleKeyPress}
        isShift={calc.isShift}
        isAlpha={calc.isAlpha}
        angleMode={calc.angleMode}
        onToggleAngle={calc.toggleAngle}
      />

      {/* Bottom strip */}
      <div className="cg100-bottom-strip" />
    </div>
  );
}
