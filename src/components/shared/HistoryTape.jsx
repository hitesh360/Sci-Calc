import { useRef, useEffect } from 'react';
import './HistoryTape.css';

export default function HistoryTape({ history, onSelect, onClear }) {
  const bottomRef = useRef(null);

  // Auto-scroll to latest
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length]);

  return (
    <div className="history-tape">
      <div className="history-header">
        <span>📋 History ({history.length})</span>
        <button className="history-clear-btn" onClick={onClear} title="Clear history">✕ Clear</button>
      </div>
      <div className="history-list">
        {history.length === 0 && (
          <div className="history-empty">No calculations yet.</div>
        )}
        {[...history].reverse().map((item, i) => (
          <div
            key={item.timestamp ?? i}
            className="history-item"
            onClick={() => onSelect(item)}
            title="Click to reuse expression"
          >
            <div className="history-expr">{item.expr}</div>
            <div className="history-result">= {item.result}</div>
            {item.timestamp && (
              <div className="history-time">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
