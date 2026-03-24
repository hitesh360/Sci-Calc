/**
 * fx-CG100 Keypad
 * Full layout matching physical Casio fx-CG100 / fx-CG50 keypad
 */

const KEY_DEFS = [
  // Row 0 – F1–F6 function keys
  [
    { label:'F1', key:'F1', cls:'key-func', top:'', alpha:'' },
    { label:'F2', key:'F2', cls:'key-func', top:'', alpha:'' },
    { label:'F3', key:'F3', cls:'key-func', top:'', alpha:'' },
    { label:'F4', key:'F4', cls:'key-func', top:'', alpha:'' },
    { label:'F5', key:'F5', cls:'key-func', top:'', alpha:'' },
    { label:'F6', key:'F6', cls:'key-func', top:'', alpha:'' },
  ],
  // Row 1 – Shift, Optn, Vars, Menu, Left, Up, Right, Down, AC
  [
    { label:'SHIFT', key:'SHIFT', cls:'key-shift', top:'', alpha:'' },
    { label:'OPTN',  key:'OPTN',  cls:'key-dark',  top:'', alpha:'' },
    { label:'VARS',  key:'VARS',  cls:'key-dark',  top:'', alpha:'' },
    { label:'MENU',  key:'MENU',  cls:'key-dark',  top:'', alpha:'' },
    { label:'◀',    key:'◀',    cls:'key-nav',   top:'', alpha:'' },
    { label:'▲',    key:'▲',    cls:'key-nav',   top:'', alpha:'' },
    { label:'▼',    key:'▼',    cls:'key-nav',   top:'', alpha:'' },
    { label:'▶',    key:'▶',    cls:'key-nav',   top:'', alpha:'' },
    { label:'AC', key:'AC', cls:'key-ac', top:'ON', alpha:'' },
  ],
  // Row 2 – Alpha, x^2, x^, log, ln, sin, cos, tan, DEL
  [
    { label:'ALPHA', key:'ALPHA', cls:'key-alpha', top:'', alpha:'' },
    { label:'x²',   key:'^2',    cls:'key-gray',  top:'x³', alpha:'' },
    { label:'xⁿ',   key:'^',     cls:'key-gray',  top:'ⁿ√', alpha:'' },
    { label:'log',  key:'log(',  cls:'key-gray',  top:'10ˣ', alpha:'' },
    { label:'ln',   key:'ln(',   cls:'key-gray',  top:'eˣ',  alpha:'' },
    { label:'sin',  key:'sin(',  cls:'key-gray',  top:'sin⁻¹', alpha:'' },
    { label:'cos',  key:'cos(',  cls:'key-gray',  top:'cos⁻¹', alpha:'' },
    { label:'tan',  key:'tan(',  cls:'key-gray',  top:'tan⁻¹', alpha:'' },
    { label:'DEL',  key:'DEL',   cls:'key-del',   top:'INS', alpha:'' },
  ],
  // Row 3 – EXIT, PRGM, SETUP, (, ), [comma], M+, →, EXE
  [
    { label:'EXIT',  key:'EXIT',  cls:'key-dark',  top:'', alpha:'' },
    { label:'PRGM',  key:'PRGM',  cls:'key-dark',  top:'', alpha:'' },
    { label:'SETUP', key:'SETUP', cls:'key-dark',  top:'', alpha:'' },
    { label:'(',     key:'(',     cls:'key-gray',  top:'', alpha:'' },
    { label:')',     key:')',     cls:'key-gray',  top:'', alpha:'' },
    { label:'S⇔D',  key:'S⇔D',  cls:'key-gray',  top:'', alpha:'' },
    { label:'M+',    key:'M+',    cls:'key-gray',  top:'', alpha:'' },
    { label:'→',    key:'→',    cls:'key-gray',  top:'', alpha:'' },
    { label:'EXE',   key:'EXE',   cls:'key-exe',   top:'', alpha:'' },
  ],
  // Row 4 – 7, 8, 9, DEL, ×, ÷ 
  [
    { label:'7', key:'7', cls:'key-number', top:'', alpha:'x' },
    { label:'8', key:'8', cls:'key-number', top:'', alpha:'y' },
    { label:'9', key:'9', cls:'key-number', top:'', alpha:'z' },
    { label:'(',     key:'(',     cls:'key-gray',  top:'', alpha:'' },
    { label:')',     key:')',     cls:'key-gray',  top:'', alpha:'' },
    { label:'×',    key:'×',    cls:'key-op',    top:'', alpha:'' },
    { label:'÷',    key:'÷',    cls:'key-op',    top:'', alpha:'' },
  ],
  // Row 5 – 4, 5, 6, +, -
  [
    { label:'4', key:'4', cls:'key-number', top:'', alpha:'A' },
    { label:'5', key:'5', cls:'key-number', top:'', alpha:'B' },
    { label:'6', key:'6', cls:'key-number', top:'', alpha:'C' },
    { label:'sqrt', key:'sqrt(', cls:'key-gray',  top:'', alpha:'' },
    { label:'x²',   key:'^2',    cls:'key-gray',  top:'', alpha:'' },
    { label:'+', key:'+', cls:'key-op', top:'', alpha:'' },
    { label:'-', key:'-', cls:'key-op', top:'', alpha:'' },
  ],
  // Row 6 – 1, 2, 3
  [
    { label:'1', key:'1', cls:'key-number', top:'', alpha:'D' },
    { label:'2', key:'2', cls:'key-number', top:'', alpha:'E' },
    { label:'3', key:'3', cls:'key-number', top:'', alpha:'F' },
    { label:'π',  key:'π',  cls:'key-gray', top:'', alpha:'' },
    { label:'Ans', key:'Ans', cls:'key-gray', top:'', alpha:'' },
    { label:'%',  key:'%',  cls:'key-gray', top:'', alpha:'' },
    { label:'EXP', key:'E', cls:'key-gray', top:'', alpha:'' },
  ],
  // Row 7 – 0, ., +/-, EXE (wide)
  [
    { label:'0',   key:'0',   cls:'key-number key-zero', top:'', alpha:'' },
    { label:'.',   key:'.',   cls:'key-number', top:'', alpha:'' },
    { label:'(-)', key:'-',   cls:'key-gray',  top:'', alpha:'' },
    { label:'EXE', key:'EXE', cls:'key-exe',   top:'', alpha:'' },
  ],
];

export default function Keypad({ onPress, isShift, isAlpha, angleMode, onToggleAngle }) {
  return (
    <div className="cg100-keypad">
      {/* Angle mode toggle */}
      <div className="cg100-key-row">
        <button
          className="cg100-key key-dark"
          style={{ flex:'1', maxWidth:'100%', fontSize:'10px', height:'22px' }}
          onClick={onToggleAngle}
        >
          [{angleMode}] tap to cycle DEG/RAD/GRAD
        </button>
      </div>

      {KEY_DEFS.map((row, ri) => (
        <div key={ri} className="cg100-key-row">
          {row.map((k, ki) => {
            const displayLabel = isAlpha && k.alpha ? k.alpha
                               : isShift && k.top   ? k.top
                               : k.label;
            const effectiveKey = isAlpha && k.alpha ? k.alpha
                               : isShift && k.top   ? getShiftKey(k)
                               : k.key;
            return (
              <button
                key={ki}
                className={`cg100-key ${k.cls}`}
                onClick={() => onPress(effectiveKey)}
                title={k.label}
              >
                {k.top   && <span className="key-top-label">{k.top}</span>}
                {k.alpha && <span className="key-alpha-label">{k.alpha}</span>}
                {!k.top && !k.alpha && <span style={{height:10}} />}
                <span className="key-main">{displayLabel}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function getShiftKey(k) {
  const shiftMap = {
    'sin(': 'asin(', 'cos(': 'acos(', 'tan(': 'atan(',
    'log(': '10^', 'ln(': 'exp(',
    '^2': '^3', '^': 'nthroot(',
  };
  return shiftMap[k.key] || k.top || k.key;
}
