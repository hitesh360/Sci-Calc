import { useState, useCallback, useRef } from 'react';
import { evaluate, setAngleMode, getAngleMode, setVar } from '../lib/mathEngine.js';
import { saveVars, loadVars } from '../lib/storage.js';

export function useCalculator({ addToHistory }) {
  const [input, _setInput]        = useState('');
  const [result, setResult]       = useState('');
  const [isError, setIsError]     = useState(false);
  const [angleMode, _setAM]       = useState('DEG');
  const [isShift, setIsShift]     = useState(false);
  const [isAlpha, setIsAlpha]     = useState(false);
  const [vars, setVars]           = useState(() => loadVars());

  // Keep a ref always in sync with the latest input so the EXE handler can
  // read the current value without relying on state-inside-updater side effects.
  const inputRef = useRef('');
  const setInput = useCallback((newVal) => {
    const val = typeof newVal === 'function' ? newVal(inputRef.current) : newVal;
    inputRef.current = val;
    _setInput(val);
  }, []);

  const toggleAngle = useCallback(() => {
    const modes = ['DEG','RAD','GRAD'];
    const next = modes[(modes.indexOf(getAngleMode()) + 1) % 3];
    setAngleMode(next);
    _setAM(next);
  }, []);

  const press = useCallback((key) => {
    // SHIFT / ALPHA toggle themselves; all other keys clear both flags
    if (key === 'SHIFT') { setIsShift(s => !s); return; }
    if (key === 'ALPHA') { setIsAlpha(s => !s); return; }
    setIsShift(false);
    setIsAlpha(false);

    switch (key) {
      case 'AC':
        setInput('');
        setResult('');
        setIsError(false);
        return;

      case 'DEL':
        setInput(prev => prev.slice(0, -1));
        return;

      // ← behaves like DEL (backspace) on fx-5800P
      case '←':
        setInput(prev => prev.slice(0, -1));
        return;

      // Keys that have no expression effect in emulator
      case 'S⇔D':
      case 'M+':
      case '→':
      case 'F1': case 'F2': case 'F3': case 'F4': case 'F5': case 'F6':
      case 'OPTN': case 'VARS': case 'SETUP': case 'PRGM':
      case '▲': case '▼': case '◀': case '▶':
        return;

      case 'EXE': {
        // Read current input from ref to avoid side effects inside an updater
        const expr = inputRef.current;
        const { value, display, isError: err } = evaluate(expr);
        setResult(display);
        setIsError(err);
        if (!err) {
          addToHistory({ expr, result: display, value, timestamp: Date.now() });
          const updatedVars = { ...loadVars(), Ans: value };
          saveVars(updatedVars);
          setVars(updatedVars);
        }
        return;
      }

      case 'ANS':
        setInput(prev => prev + 'Ans');
        return;

      default:
        setInput(prev => prev + key);
    }
  }, [addToHistory, setInput]);

  const setVariable = useCallback((name, value) => {
    setVar(name, value);
    const updated = { ...vars, [name]: value };
    setVars(updated);
    saveVars(updated);
  }, [vars]);

  const clearInput = () => { setInput(''); setResult(''); setIsError(false); };
  const setInputDirect = (v) => setInput(v);

  return {
    input, result, isError, angleMode,
    isShift, isAlpha, vars,
    press, toggleAngle, setVariable, clearInput, setInputDirect,
  };
}
