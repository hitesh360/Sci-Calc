import './SplitScreen.css';

export default function SplitScreen({ enabled, onToggle, left, right }) {
  return (
    <div className={`split-screen ${enabled ? 'split-active' : ''}`}>
      <div className="split-left">
        {left}
      </div>
      {enabled && (
        <div className="split-right">
          {right}
        </div>
      )}
      <button
        className="split-toggle"
        onClick={onToggle}
        title={enabled ? 'Hide panel' : 'Show history panel'}
      >
        {enabled ? '◀' : '▶'}
      </button>
    </div>
  );
}
