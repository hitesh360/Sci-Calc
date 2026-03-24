/* fx-5800P keypad – white keys on dark purple body */
const ROWS = [
  // Row 0: SHIFT, ALPHA, MODE, CALC, PROG, AC
  [
    { label:'SHIFT', key:'SHIFT', cls:'k-shift', top:'', alpha:'' },
    { label:'ALPHA', key:'ALPHA', cls:'k-alpha', top:'', alpha:'' },
    { label:'MODE',  key:'MODE',  cls:'k-dgray', top:'', alpha:'' },
    { label:'CALC',  key:'CALC',  cls:'k-prog',  top:'', alpha:'' },
    { label:'PROG',  key:'PROG',  cls:'k-prog',  top:'', alpha:'' },
    { label:'AC',    key:'AC',    cls:'k-ac',    top:'', alpha:'' },
  ],
  // Row 1: x², ^, (-)neg, (, ), DEL
  [
    { label:'x²',    key:'^2',   cls:'k-white', top:'√',    alpha:'A' },
    { label:'xⁿ',    key:'^',    cls:'k-white', top:'∛',    alpha:'B' },
    { label:'log',   key:'log(', cls:'k-white', top:'10ˣ',  alpha:'C' },
    { label:'ln',    key:'ln(',  cls:'k-white', top:'eˣ',   alpha:'D' },
    { label:'(',     key:'(',    cls:'k-lgray', top:'',     alpha:'E' },
    { label:'DEL',   key:'DEL',  cls:'k-del',   top:'INS',  alpha:'' },
  ],
  // Row 2: sin, cos, tan, S↔D, ANS, EXE
  [
    { label:'sin',   key:'sin(', cls:'k-white', top:'sin⁻¹', alpha:'F' },
    { label:'cos',   key:'cos(', cls:'k-white', top:'cos⁻¹', alpha:'G' },
    { label:'tan',   key:'tan(', cls:'k-white', top:'tan⁻¹', alpha:'H' },
    { label:'S⇔D',  key:'S⇔D', cls:'k-lgray', top:'',      alpha:'I' },
    { label:')',     key:')',    cls:'k-lgray', top:'',      alpha:'J' },
    { label:'EXE',   key:'EXE',  cls:'k-exe',   top:'',      alpha:'' },
  ],
  // Row 3: 7, 8, 9, ×, ÷
  [
    { label:'7', key:'7', cls:'k-num', top:'', alpha:'x' },
    { label:'8', key:'8', cls:'k-num', top:'', alpha:'y' },
    { label:'9', key:'9', cls:'k-num', top:'', alpha:'z' },
    { label:'×', key:'×', cls:'k-op', top:'', alpha:'' },
    { label:'÷', key:'÷', cls:'k-op', top:'', alpha:'' },
    { label:'%', key:'%', cls:'k-lgray', top:'', alpha:'' },
  ],
  // Row 4: 4, 5, 6, +, -
  [
    { label:'4', key:'4', cls:'k-num', top:'', alpha:'L' },
    { label:'5', key:'5', cls:'k-num', top:'', alpha:'M' },
    { label:'6', key:'6', cls:'k-num', top:'', alpha:'N' },
    { label:'+', key:'+', cls:'k-op',  top:'', alpha:'' },
    { label:'-', key:'-', cls:'k-op',  top:'', alpha:'' },
    { label:'π', key:'π', cls:'k-lgray', top:'', alpha:'' },
  ],
  // Row 5: 1, 2, 3, ans, =
  [
    { label:'1',   key:'1',   cls:'k-num',   top:'', alpha:'P' },
    { label:'2',   key:'2',   cls:'k-num',   top:'', alpha:'Q' },
    { label:'3',   key:'3',   cls:'k-num',   top:'', alpha:'R' },
    { label:'Ans', key:'Ans', cls:'k-lgray', top:'', alpha:'' },
    { label:'←',  key:'←',  cls:'k-dgray', top:'', alpha:'' },
    { label:'→',  key:'→',  cls:'k-dgray', top:'', alpha:'' },
  ],
  // Row 6: 0 (wide), ., +/-, EXE
  [
    { label:'0',   key:'0',   cls:'k-num k-zero', top:'', alpha:'' },
    { label:'.',   key:'.',   cls:'k-num',  top:'', alpha:'' },
    { label:'(-)', key:'-',   cls:'k-lgray',top:'', alpha:'' },
    { label:'EXE', key:'EXE', cls:'k-exe',  top:'', alpha:'' },
  ],
];

export default function Keypad({ onPress, isShift, isAlpha, angleMode, onToggleAngle }) {
  return (
    <div className="fx5800-keypad">
      {/* Angle mode badge */}
      <div className="fx5800-key-row">
        <button
          className="fx5800-key k-dgray"
          style={{ flex:'1', maxWidth:'100%', fontSize:'9px', height:'20px' }}
          onClick={onToggleAngle}
        >
          [{angleMode}] – tap to change angle mode
        </button>
      </div>

      {ROWS.map((row, ri) => (
        <div key={ri} className="fx5800-key-row">
          {row.map((k, ki) => {
            const label = isAlpha && k.alpha ? k.alpha
                        : isShift && k.top   ? k.top
                        : k.label;
            const effectiveKey = isAlpha && k.alpha ? k.alpha
                               : isShift && k.top   ? shiftKey(k)
                               : k.key;
            return (
              <button
                key={ki}
                className={`fx5800-key ${k.cls}`}
                onClick={() => onPress(effectiveKey)}
                title={k.label}
              >
                {k.top   && <span className="k-top">{k.top}</span>}
                {k.alpha && <span className="k-alph">{k.alpha}</span>}
                {!k.top && !k.alpha && <span style={{height:9}} />}
                <span className="k-main">{label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function shiftKey(k) {
  const m = {
    'sin(': 'asin(', 'cos(': 'acos(', 'tan(': 'atan(',
    'log(': '10^(', 'ln(': 'exp(',
    '^2': 'sqrt(', '^': 'cbrt(',
  };
  return m[k.key] || k.top || k.key;
}
