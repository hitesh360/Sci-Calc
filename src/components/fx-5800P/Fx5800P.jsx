import { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator.js';
import { useKeyboard } from '../../hooks/useKeyboard.js';
import Screen from './Screen.jsx';
import Keypad from './Keypad.jsx';
import FormulaLibrary from './FormulaLibrary.jsx';
import BasicInterpreter from './BasicInterpreter.jsx';
import './Fx5800P.css';

export default function Fx5800P({ addToHistory }) {
  const [mode, setMode]     = useState('run'); // run | formula | prog
  const [coverOpen, setCoverOpen] = useState(true);
  const calc = useCalculator({ addToHistory });

  useKeyboard(calc.press);

  const handleKey = (key) => {
    if (key === 'PROG') { setMode('prog'); return; }
    if (key === 'CALC') { setMode('formula'); return; }
    if (key === 'AC') {
      if (mode !== 'run') { setMode('run'); return; }
    }
    calc.press(key);
  };

  return (
    <div className={`fx5800-body ${coverOpen ? 'cover-open' : 'cover-closed'}`}
         role="region" aria-label="Casio fx-5800P Calculator">

      {/* Cover toggle */}
      <button
        className="cover-toggle"
        onClick={() => setCoverOpen(o => !o)}
        title="Toggle flip cover"
      >
        {coverOpen ? '🔓 Close Cover' : '🔒 Open Cover'}
      </button>

      {coverOpen && (
        <>
          {/* Model badge */}
          <div className="fx5800-model-badge">
            <span className="fx5800-model-name">fx-5800P</span>
            <span className="fx5800-model-sub">SCIENTIFIC CALCULATOR</span>
          </div>

          {/* Screen bezel */}
          <div className="fx5800-screen-bezel">
            {mode === 'run' && (
              <Screen
                input={calc.input}
                result={calc.result}
                isError={calc.isError}
                angleMode={calc.angleMode}
                isShift={calc.isShift}
                isAlpha={calc.isAlpha}
              />
            )}
            {mode === 'formula' && (
              <FormulaLibrary onUseFormula={(expr) => {
                calc.setInputDirect(expr);
                setMode('run');
              }} />
            )}
            {mode === 'prog' && (
              <BasicInterpreter addToHistory={addToHistory} />
            )}
          </div>

          {/* Keypad */}
          <Keypad
            onPress={handleKey}
            isShift={calc.isShift}
            isAlpha={calc.isAlpha}
            angleMode={calc.angleMode}
            onToggleAngle={calc.toggleAngle}
          />

          {/* Bottom label */}
          <div className="fx5800-bottom">
            <span>CASIO</span>
          </div>
        </>
      )}
    </div>
  );
}
