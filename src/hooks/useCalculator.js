import { useState, useCallback } from 'react';
import { evaluate, setAngleMode, getAngleMode, setVar } from '../lib/mathEngine.js';
import { saveVars, loadVars } from '../lib/storage.js';

export function useCalculator({ addToHistory }) {
  const [input, setInput]         = useState('');
  const [result, setResult]       = useState('');
  const [isError, setIsError]     = useState(false);
  const [angleMode, _setAM]       = useState('DEG');
  const [isShift, setIsShift]     = useState(false);
  const [isAlpha, setIsAlpha]     = useState(false);
  const [vars, setVars]           = useState(() => loadVars());

  const toggleAngle = useCallback(() => {
    const modes = ['DEG','RAD','GRAD'];
    const next = modes[(modes.indexOf(getAngleMode()) + 1) % 3];
    setAngleMode(next);
    _setAM(next);
  }, []);

  const press = useCallback((key) => {
    setInput(prev => {
      switch (key) {
        case 'DEL': return prev.slice(0,-1);
        case 'AC':  setResult(''); setIsError(false); return '';
        case 'EXE': return prev; // handled separately
        case 'SHIFT': setIsShift(s=>!s); return prev;
        case 'ALPHA': setIsAlpha(s=>!s); return prev;
        case 'ANS':   return prev + 'Ans';
        default:      return prev + key;
      }
    });

    if (key === 'EXE') {
      setInput(cur => {
        const expr = cur;
        const { value, display, isError: err } = evaluate(expr);
        setResult(display);
        setIsError(err);
        if (!err) {
          addToHistory({ expr, result: display, value, timestamp: Date.now() });
          // persist Ans variable
          const updatedVars = { ...loadVars(), Ans: value };
          saveVars(updatedVars);
          setVars(updatedVars);
        }
        return cur;
      });
      setIsShift(false);
      setIsAlpha(false);
    }

    if (key !== 'SHIFT') setIsShift(false);
    if (key !== 'ALPHA') setIsAlpha(false);
  }, [addToHistory]);

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
