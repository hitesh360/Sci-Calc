import { useState, useRef } from 'react';
import './PythonShell.css';

const WELCOME = `Python 3.x (Stub)
Type help() for help.
>>> `;

export default function PythonShell() {
  const [output, setOutput] = useState(WELCOME);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const run = () => {
    const line = input.trim();
    if (!line) return;

    let result = '';
    try {
      // Basic Python-like evaluations via JS
      const sanitized = line
        .replace(/print\s*\((.*)\)/s, (_, args) => {
          // eslint-disable-next-line no-new-func
          const val = Function('"use strict"; return (' + args + ')')();
          result = String(val);
          return '';
        });

      if (!result && sanitized.trim()) {
        // eslint-disable-next-line no-new-func
        result = String(Function('"use strict"; return (' + sanitized + ')')());
      }
    } catch (e) {
      result = `Error: ${e.message}`;
    }

    setOutput(prev =>
      prev + line + '\n' + (result ? result + '\n' : '') + '>>> '
    );
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="python-shell">
      <div className="python-output">
        <pre>{output}</pre>
        <div ref={bottomRef} />
      </div>
      <div className="python-input-row">
        <span className="python-prompt">{'>>> '}</span>
        <input
          className="python-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="type expression..."
          spellCheck={false}
          autoFocus
        />
        <button className="python-run-btn" onClick={run}>▶</button>
      </div>
    </div>
  );
}
