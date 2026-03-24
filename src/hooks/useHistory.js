import { useState, useCallback } from 'react';
import { saveHistory, loadHistory } from '../lib/storage.js';

export function useHistory() {
  const [history, setHistory] = useState(() => loadHistory());

  const addToHistory = useCallback((entry) => {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 500);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
