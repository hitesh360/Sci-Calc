export default function Screen({ input, result, isError, angleMode, isShift, isAlpha }) {
  // 4-line monochrome LCD display
  const lines = buildLines(input, result, isError, angleMode, isShift, isAlpha);
  return (
    <div className="fx5800-screen">
      {lines.map((line, i) => (
        <div key={i} className={`fx5800-screen-line ${line.cls}`}>
          {line.text}
          {line.cursor && <span className="fx5800-cursor" />}
        </div>
      ))}
    </div>
  );
}

function buildLines(input, result, isError, angleMode, isShift, isAlpha) {
  const statusLine = [
    angleMode,
    isShift ? 'S' : '',
    isAlpha ? 'A' : '',
    'fx-5800P',
  ].filter(Boolean).join(' ');

  return [
    { text: statusLine, cls: 'fx5800-status', cursor: false },
    { text: input ? input.slice(0, 24) : '', cls: 'line-input', cursor: !input },
    { text: input && input.length > 24 ? input.slice(24, 48) : '', cls: 'line-input', cursor: !!input },
    {
      text: result !== '' ? (isError ? result : `= ${result}`) : '',
      cls: isError ? 'line-error' : 'line-result',
      cursor: false,
    },
  ];
}
