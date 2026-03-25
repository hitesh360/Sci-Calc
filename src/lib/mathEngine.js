/**
 * mathEngine.js – math.js wrapper with DEG/RAD/GRAD support
 */
import * as math from 'mathjs';

let angleMode = 'DEG'; // DEG | RAD | GRAD

export function setAngleMode(mode) { angleMode = mode; }
export function getAngleMode() { return angleMode; }

function toRad(x) {
  if (angleMode === 'RAD')  return x;
  if (angleMode === 'GRAD') return x * Math.PI / 200;
  return x * Math.PI / 180; // DEG
}

function fromRad(x) {
  if (angleMode === 'RAD')  return x;
  if (angleMode === 'GRAD') return x * 200 / Math.PI;
  return x * 180 / Math.PI;
}

// Custom trig scope that respects angle mode
const scope = {};

/** Evaluate an expression string, returns { value, display, isError } */
export function evaluate(expr) {
  try {
    // Pre-process: replace display symbols with math.js equivalents
    let processed = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/∞/g, 'Infinity')
      // % as percentage: replace only when attached to a number, closing paren, or constant name
      .replace(/([\d)a-z])\s*%/gi, '$1/100')
      .trim();

    // Wrap trig functions to convert angles
    processed = processed
      .replace(/\bsin\s*\(/g,   `_sin(`)
      .replace(/\bcos\s*\(/g,   `_cos(`)
      .replace(/\btan\s*\(/g,   `_tan(`)
      .replace(/\basin\s*\(/g,  `_asin(`)
      .replace(/\bacos\s*\(/g,  `_acos(`)
      .replace(/\batan\s*\(/g,  `_atan(`)
      .replace(/\bsinh\s*\(/g,  `_sinh(`)
      .replace(/\bcosh\s*\(/g,  `_cosh(`)
      .replace(/\btanh\s*\(/g,  `_tanh(`)
      .replace(/\basin2\s*\(/g, `_asinh(`)
      .replace(/\bacos2\s*\(/g, `_acosh(`)
      .replace(/\batan2\s*\(/g, `_atanh(`)
      .replace(/\bAns\b/g, `_Ans`);

    // Build evaluation scope with custom trig
    const ev = {
      ...scope,
      pi: Math.PI,
      e: Math.E,
      _Ans: scope._Ans || 0,
      _sin:  (x) => Math.sin(toRad(x)),
      _cos:  (x) => Math.cos(toRad(x)),
      _tan:  (x) => Math.tan(toRad(x)),
      _asin: (x) => fromRad(Math.asin(x)),
      _acos: (x) => fromRad(Math.acos(x)),
      _atan: (x) => fromRad(Math.atan(x)),
      _sinh: (x) => Math.sinh(x),
      _cosh: (x) => Math.cosh(x),
      _tanh: (x) => Math.tanh(x),
      _asinh:(x) => Math.asinh(x),
      _acosh:(x) => Math.acosh(x),
      _atanh:(x) => Math.atanh(x),
      abs:   Math.abs,
      sqrt:  Math.sqrt,
      cbrt:  Math.cbrt,
      log:   (x, b) => b ? Math.log(x)/Math.log(b) : Math.log10(x),
      log10: Math.log10,
      ln:    Math.log,
      exp:   Math.exp,
      ceil:  Math.ceil,
      floor: Math.floor,
      round: Math.round,
      sign:  Math.sign,
      nCr:   (n, r) => factorial(n) / (factorial(r) * factorial(n - r)),
      nPr:   (n, r) => factorial(n) / factorial(n - r),
      fact:  factorial,
      mod:   (a, b) => a % b,
      gcd:   (a, b) => { while(b){ let t=b; b=a%b; a=t; } return Math.abs(a); },
      lcm:   (a, b) => Math.abs(a*b) / (function gcdInner(x,y){ while(y){ const t=y; y=x%y; x=t; } return Math.abs(x); })(a,b),
      nthroot: (n, x) => Math.pow(x, 1 / n), // n-th root: nthroot(3, 8) = ∛8 = 2
      max:   (...a) => Math.max(...a),
      min:   (...a) => Math.min(...a),
    };

    // Use math.js for full expression parsing
    const result = math.evaluate(
      processed.replace(/_sin\(/g,'__sin(').replace(/_cos\(/g,'__cos(')
               .replace(/_tan\(/g,'__tan(').replace(/_asin\(/g,'__asin(')
               .replace(/_acos\(/g,'__acos(').replace(/_atan\(/g,'__atan(')
               .replace(/_sinh\(/g,'__sinh(').replace(/_cosh\(/g,'__cosh(')
               .replace(/_tanh\(/g,'__tanh(')
               .replace(/_asinh\(/g,'__asinh(').replace(/_acosh\(/g,'__acosh(')
               .replace(/_atanh\(/g,'__atanh(').replace(/_Ans/g,'__Ans'),
      buildMathScope(ev)
    );

    const value = typeof result === 'object' && result.toNumber ? result.toNumber() : result;
    scope._Ans = value;

    return { value, display: formatResult(value), isError: false };
  } catch (err) {
    return { value: null, display: 'Syntax ERROR', isError: true };
  }
}

function buildMathScope(ev) {
  return {
    __Ans:   ev._Ans,
    __sin:   ev._sin,
    __cos:   ev._cos,
    __tan:   ev._tan,
    __asin:  ev._asin,
    __acos:  ev._acos,
    __atan:  ev._atan,
    __sinh:  ev._sinh,
    __cosh:  ev._cosh,
    __tanh:  ev._tanh,
    __asinh: ev._asinh,
    __acosh: ev._acosh,
    __atanh: ev._atanh,
    abs:     ev.abs,
    sqrt:    ev.sqrt,
    cbrt:    ev.cbrt,
    log:     ev.log,
    log10:   ev.log10,
    ln:      ev.ln,
    exp:     ev.exp,
    ceil:    ev.ceil,
    floor:   ev.floor,
    round:   ev.round,
    sign:    ev.sign,
    nCr:     ev.nCr,
    nPr:     ev.nPr,
    fact:    ev.fact,
    mod:     ev.mod,
    gcd:     ev.gcd,
    lcm:     ev.lcm,
    nthroot: ev.nthroot,
    max:     ev.max,
    min:     ev.min,
    pi:      Math.PI,
    e:       Math.E,
  };
}

function factorial(n) {
  n = Math.floor(n);
  if (n < 0) throw new Error('Negative factorial');
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function formatResult(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'string') return val;
  if (!isFinite(val)) return val > 0 ? '∞' : '-∞';
  if (isNaN(val)) return 'Math ERROR';

  // Try to show exact fractions for simple rationals
  const frac = toFraction(val);
  if (frac) return frac;

  // Tidy number display
  const abs = Math.abs(val);
  if (abs !== 0 && (abs >= 1e10 || abs < 1e-4)) {
    // Scientific notation
    return val.toExponential(6).replace(/\.?0+e/, 'e').replace('e+', '×10^').replace('e-', '×10^-');
  }

  // Round to 10 significant figures
  const s = parseFloat(val.toPrecision(10)).toString();
  return s;
}

function toFraction(x) {
  if (!Number.isFinite(x) || x === 0) return null;
  const MAX_DENOM = 1000;
  const sign = x < 0 ? '-' : '';
  x = Math.abs(x);
  const whole = Math.floor(x);
  const frac = x - whole;
  // Skip if it's essentially an integer (covers cases like tan(45°) ≈ 0.9999999…)
  if (frac < 1e-9 || frac > 1 - 1e-9) return null;

  for (let d = 2; d <= MAX_DENOM; d++) {
    const n = Math.round(frac * d);
    // Skip degenerate fractions where numerator equals denominator (= integer)
    if (n === d) continue;
    if (n === 0) continue;
    if (Math.abs(frac - n / d) < 1e-9) {
      if (whole > 0) return `${sign}${whole} ${n}/${d}`;
      return `${sign}${n}/${d}`;
    }
  }
  return null;
}

/** Store/retrieve named variables */
export function setVar(name, value) { scope[name] = value; }
export function getVar(name) { return scope[name]; }
export function getAns() { return scope._Ans || 0; }
export function getAllVars() { return { ...scope }; }
export function clearVars() { Object.keys(scope).forEach(k => delete scope[k]); }

/** Matrix helpers via math.js */
export function matrixEval(expr) {
  try {
    return math.evaluate(expr);
  } catch(e) {
    return null;
  }
}

export function complexEval(expr) {
  try {
    return math.evaluate(expr);
  } catch(e) {
    return null;
  }
}
