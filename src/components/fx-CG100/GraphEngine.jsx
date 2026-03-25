import { useRef, useEffect, useState, useCallback } from 'react';
import { evaluate } from '../../lib/mathEngine.js';
import './GraphEngine.css';

export default function GraphEngine({ expr: initialExpr }) {
  const canvasRef  = useRef(null);
  const [expr, setExpr]     = useState(initialExpr || 'sin(x)');
  const [expr2, setExpr2]   = useState('');
  const [viewBox, setViewBox] = useState({ xMin:-10, xMax:10, yMin:-6, yMax:6 });
  const [traceX, setTraceX]  = useState(null);
  const [status, setStatus]  = useState('');
  const dragging = useRef(false);
  const dragStart= useRef({ x:0, y:0, box:null });

  const W = 296, H = 152;

  const toPixel = useCallback((wx, wy, box) => {
    const px = (wx - box.xMin) / (box.xMax - box.xMin) * W;
    const py = H - (wy - box.yMin) / (box.yMax - box.yMin) * H;
    return { px, py };
  }, []);

  const toWorld = useCallback((px, py, box) => {
    const wx = box.xMin + px / W * (box.xMax - box.xMin);
    const wy = box.yMin + (H - py) / H * (box.yMax - box.yMin);
    return { wx, wy };
  }, []);

  const evalY = useCallback((xVal, expression) => {
    // Use negative lookbehind/lookahead to replace standalone 'x' only (not 'exp', 'max', etc.)
    const { value, isError } = evaluate(expression.replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g, `(${xVal})`));
    return isError ? null : value;
  }, []);

  const draw = useCallback((box, tX) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#1e2a3a';
    ctx.lineWidth = 0.5;
    const xStep = (box.xMax - box.xMin) / 10;
    const yStep = (box.yMax - box.yMin) / 6;
    for (let gx = Math.ceil(box.xMin / xStep) * xStep; gx <= box.xMax; gx += xStep) {
      const { px } = toPixel(gx, 0, box);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
    for (let gy = Math.ceil(box.yMin / yStep) * yStep; gy <= box.yMax; gy += yStep) {
      const { py } = toPixel(0, gy, box);
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#3a5a8a';
    ctx.lineWidth = 1;
    const { px: ax } = toPixel(0, 0, box);
    const { py: ay } = toPixel(0, 0, box);
    ctx.beginPath(); ctx.moveTo(ax, 0); ctx.lineTo(ax, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#4a7aaa';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    // x labels
    for (let gx = Math.ceil(box.xMin); gx <= box.xMax; gx++) {
      if (gx === 0) continue;
      const { px } = toPixel(gx, 0, box);
      if (px > 10 && px < W - 10) ctx.fillText(gx, px, Math.min(Math.max(ay + 10, 10), H - 3));
    }
    ctx.textAlign = 'right';
    for (let gy = Math.ceil(box.yMin); gy <= box.yMax; gy++) {
      if (gy === 0) continue;
      const { py } = toPixel(0, gy, box);
      if (py > 5 && py < H - 5) ctx.fillText(gy, Math.max(ax - 3, 20), py + 3);
    }

    // Plot function 1
    if (expr) drawFunction(ctx, expr, box, '#4af', tX);
    // Plot function 2
    if (expr2) drawFunction(ctx, expr2, box, '#f84', tX);

    // Trace crosshair
    if (tX !== null) {
      const y = evalY(tX, expr);
      if (y !== null) {
        const { px, py } = toPixel(tX, y, box);
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff0';
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
        setStatus(`x=${tX.toFixed(4)}, y=${y.toFixed(4)}`);
      }
    }
  }, [expr, expr2, toPixel, evalY]);

  function drawFunction(ctx, expression, box, color, tX) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= W; px++) {
      const { wx } = toWorld(px, 0, box);
      const wy = evalY(wx, expression);
      if (wy === null || !isFinite(wy)) { started = false; continue; }
      const { py } = toPixel(wx, wy, box);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else { ctx.lineTo(px, py); }
    }
    ctx.stroke();
  }

  useEffect(() => { draw(viewBox, traceX); }, [draw, viewBox, traceX]);

  // Find roots
  const findRoots = () => {
    const roots = [];
    for (let px = 0; px < W - 1; px++) {
      const { wx: x1 } = toWorld(px, 0, viewBox);
      const { wx: x2 } = toWorld(px + 1, 0, viewBox);
      const y1 = evalY(x1, expr);
      const y2 = evalY(x2, expr);
      if (y1 !== null && y2 !== null && Math.sign(y1) !== Math.sign(y2)) {
        // Bisect
        let lo = x1, hi = x2;
        for (let i = 0; i < 50; i++) {
          const mid = (lo + hi) / 2;
          const ym = evalY(mid, expr);
          if (ym === null) break;
          if (Math.sign(ym) === Math.sign(evalY(lo, expr))) lo = mid;
          else hi = mid;
        }
        roots.push(((lo + hi) / 2).toFixed(6));
      }
    }
    setStatus(roots.length ? `Roots: ${roots.join(', ')}` : 'No roots found in view');
  };

  // Numerical integral
  const calcIntegral = () => {
    let sum = 0;
    const n = 1000;
    const dx = (viewBox.xMax - viewBox.xMin) / n;
    for (let i = 0; i < n; i++) {
      const x = viewBox.xMin + (i + 0.5) * dx;
      const y = evalY(x, expr);
      if (y !== null && isFinite(y)) sum += y * dx;
    }
    setStatus(`∫f(x)dx ≈ ${sum.toFixed(6)}`);
  };

  // Zoom
  const zoom = (factor) => {
    setViewBox(b => {
      const cx = (b.xMin + b.xMax) / 2;
      const cy = (b.yMin + b.yMax) / 2;
      const hw = (b.xMax - b.xMin) / 2 * factor;
      const hh = (b.yMax - b.yMin) / 2 * factor;
      return { xMin: cx-hw, xMax: cx+hw, yMin: cy-hh, yMax: cy+hh };
    });
  };

  // Mouse events
  const onMouseDown = (e) => {
    dragging.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    dragStart.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      box: { ...viewBox },
    };
  };

  const onMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (dragging.current) {
      const dx = px - dragStart.current.x;
      const dy = py - dragStart.current.y;
      const b = dragStart.current.box;
      const xRange = b.xMax - b.xMin;
      const yRange = b.yMax - b.yMin;
      const wx = -dx / W * xRange;
      const wy = dy / H * yRange;
      setViewBox({ xMin: b.xMin+wx, xMax: b.xMax+wx, yMin: b.yMin+wy, yMax: b.yMax+wy });
    } else {
      const { wx } = toWorld(px, py, viewBox);
      setTraceX(wx);
    }
  };

  const onMouseLeave = () => {
    dragging.current = false;
    setTraceX(null);
    setStatus('');
  };

  const onMouseUp = () => { dragging.current = false; };

  const onWheel = (e) => {
    e.preventDefault();
    zoom(e.deltaY > 0 ? 1.15 : 0.87);
  };

  return (
    <div className="graph-engine">
      {/* Inputs */}
      <div className="graph-inputs">
        <input
          className="graph-input"
          value={expr}
          onChange={e => setExpr(e.target.value)}
          placeholder="Y1 = e.g. sin(x)"
          spellCheck={false}
        />
        <input
          className="graph-input"
          value={expr2}
          onChange={e => setExpr2(e.target.value)}
          placeholder="Y2 = (optional)"
          spellCheck={false}
        />
      </div>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="graph-canvas"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onWheel={onWheel}
      />
      {/* Status */}
      <div className="graph-status">{status || 'Hover to trace • Drag to pan • Scroll to zoom'}</div>
      {/* Controls */}
      <div className="graph-controls">
        <button className="graph-btn" onClick={() => zoom(0.7)}>Zoom+</button>
        <button className="graph-btn" onClick={() => zoom(1.4)}>Zoom-</button>
        <button className="graph-btn" onClick={() => setViewBox({xMin:-10,xMax:10,yMin:-6,yMax:6})}>Reset</button>
        <button className="graph-btn" onClick={findRoots}>Roots</button>
        <button className="graph-btn" onClick={calcIntegral}>∫dx</button>
      </div>
    </div>
  );
}
