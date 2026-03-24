import { useEffect } from 'react';

const KEY_MAP = {
  'Enter':     'EXE',
  'Backspace': 'DEL',
  'Escape':    'AC',
  '+': '+', '-': '-', '*': '×', '/': '÷',
  '.': '.', '(': '(', ')': ')',
  '^': '^',
};

const ALPHA_MAP = {
  's': 'sin(', 'c': 'cos(', 't': 'tan(',
  'l': 'log(', 'n': 'ln(',
  'e': 'e', 'p': 'π',
  'a': 'Ans',
};

export function useKeyboard(press) {
  useEffect(() => {
    function handleKey(e) {
      // Don't hijack input fields other than the calc
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      const key = e.key;

      if (key >= '0' && key <= '9') { press(key); e.preventDefault(); return; }
      if (KEY_MAP[key]) { press(KEY_MAP[key]); e.preventDefault(); return; }

      if (e.shiftKey) {
        const shifted = { '5': '%', '8': '×', '6': '^' };
        if (shifted[key]) { press(shifted[key]); e.preventDefault(); return; }
      }

      if (ALPHA_MAP[key.toLowerCase()]) {
        press(ALPHA_MAP[key.toLowerCase()]);
        e.preventDefault();
        return;
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [press]);
}
