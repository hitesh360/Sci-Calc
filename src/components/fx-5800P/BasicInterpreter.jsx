import { useState, useRef } from 'react';
import { runProgram } from '../../lib/casioBasic.js';
import { loadPrograms, savePrograms } from '../../lib/storage.js';
import './Fx5800P.css';

const STARTER = `Lbl 1
Input "N=",N
For I=1 To N
Disp I
Next
Stop`;

export default function BasicInterpreter({ addToHistory }) {
  const [code, setCode]       = useState(() => {
    const progs = loadPrograms();
    return progs['main'] || STARTER;
  });
  const [output, setOutput]   = useState('');
  const [running, setRunning] = useState(false);
  const inputResolve = useRef(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const [inputVal, setInputVal]       = useState('');

  const saveCode = (c) => {
    setCode(c);
    const progs = loadPrograms();
    savePrograms({ ...progs, main: c });
  };

  const onOutput = (msg) => {
    if (msg === '\x0C') { setOutput(''); return; }
    setOutput(prev => prev + msg + '\n');
  };

  const onInput = (prompt) => {
    return new Promise(resolve => {
      setInputPrompt(prompt);
      inputResolve.current = resolve;
    });
  };

  const submitInput = () => {
    if (inputResolve.current) {
      inputResolve.current(inputVal);
      inputResolve.current = null;
      setInputPrompt('');
      setInputVal('');
    }
  };

  const runCode = async () => {
    setOutput('');
    setRunning(true);
    try {
      await runProgram(code, onOutput, onInput);
    } catch (e) {
      setOutput(prev => prev + '\nRuntime Error: ' + e.message);
    }
    setRunning(false);
  };

  const exportCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'program.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="prog-editor">
      <div className="prog-header">
        <span>PROGRAM</span>
        <div style={{display:'flex',gap:2}}>
          <button className="prog-run-btn" onClick={runCode} disabled={running}>
            {running ? '…' : '▶ RUN'}
          </button>
          <button className="prog-export-btn" onClick={exportCode}>💾 TXT</button>
        </div>
      </div>
      <textarea
        className="prog-textarea"
        value={code}
        onChange={e => saveCode(e.target.value)}
        spellCheck={false}
        rows={4}
      />
      {output && (
        <div className="prog-output">{output}</div>
      )}
      {inputPrompt && (
        <div style={{display:'flex',gap:2,padding:'2px 4px',background:'#8a9a70',borderTop:'1px solid #7a8a60'}}>
          <span style={{fontSize:9,color:'#1a2010',fontFamily:'monospace'}}>{inputPrompt}</span>
          <input
            autoFocus
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitInput()}
            style={{flex:1,fontSize:9,background:'rgba(0,0,0,.1)',border:'none',outline:'none',fontFamily:'monospace',color:'#1a2010'}}
          />
          <button className="prog-run-btn" onClick={submitInput}>OK</button>
        </div>
      )}
    </div>
  );
}
