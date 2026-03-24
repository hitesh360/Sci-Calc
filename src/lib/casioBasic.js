/**
 * casioBasic.js – Casio BASIC interpreter
 * Supports: Lbl, Goto, If/Then/Else/IfEnd, For/Next, While/WhileEnd,
 *           Disp, Print, Input, ClrText, Locate, assignments (A=5, 5→A)
 */

export function runProgram(code, onOutput, onInput) {
  return new Promise((resolve) => {
    const lines = code
      .split(/\n|:/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const vars = {};
    let pc = 0; // program counter
    const maxSteps = 100000;
    let steps = 0;

    // Build label map
    const labels = {};
    lines.forEach((line, i) => {
      const m = line.match(/^Lbl\s+(\w+)/i);
      if (m) labels[m[1].toUpperCase()] = i;
    });

    // Execution stack for loops
    const forStack = []; // { varName, to, step, lineAfterFor }
    const whileStack = []; // { condLine, lineAfterWhile }

    function evalExpr(expr) {
      expr = expr.trim();
      // Replace variables
      expr = expr.replace(/\b([A-Z])\b/g, (_, v) => {
        const val = vars[v];
        return val !== undefined ? `(${val})` : '0';
      });
      // Replace ^ with **
      expr = expr.replace(/\^/g, '**');
      // Replace common functions
      expr = expr
        .replace(/\bAbs\s*\(/gi, 'Math.abs(')
        .replace(/\bSqrt\s*\(/gi, 'Math.sqrt(')
        .replace(/\bSin\s*\(/gi, 'Math.sin(')
        .replace(/\bCos\s*\(/gi, 'Math.cos(')
        .replace(/\bTan\s*\(/gi, 'Math.tan(')
        .replace(/\bLog\s*\(/gi, 'Math.log10(')
        .replace(/\bLn\s*\(/gi, 'Math.log(')
        .replace(/\bExp\s*\(/gi, 'Math.exp(')
        .replace(/\bInt\s*\(/gi, 'Math.floor(')
        .replace(/\bFrac\s*\(/gi, '(x => x - Math.floor(x))(')
        .replace(/\bπ/g, 'Math.PI')
        .replace(/\bpi\b/gi, 'Math.PI');
      try {
        // eslint-disable-next-line no-new-func
        return Function('"use strict"; return (' + expr + ')')();
      } catch {
        return 0;
      }
    }

    function evalCond(cond) {
      cond = cond.trim();
      // Replace = with == but not already ==, ≠ ≥ ≤
      cond = cond
        .replace(/≠/g, '!=')
        .replace(/≥/g, '>=')
        .replace(/≤/g, '<=')
        .replace(/([^=!<>])=([^=])/g, '$1==$2');
      return !!evalExpr(cond);
    }

    async function run() {
      while (pc < lines.length && steps < maxSteps) {
        steps++;
        const line = lines[pc];
        pc++;

        // --- Assignment: 5→A  or A=5  or A←5 ---
        const arrowAssign = line.match(/^(.+?)→([A-Z])$/i);
        if (arrowAssign) {
          vars[arrowAssign[2].toUpperCase()] = evalExpr(arrowAssign[1]);
          continue;
        }
        const eqAssign = line.match(/^([A-Z])=(.+)$/i);
        if (eqAssign && !/^(If|For|While)/i.test(line)) {
          vars[eqAssign[1].toUpperCase()] = evalExpr(eqAssign[2]);
          continue;
        }

        // --- Lbl ---
        if (/^Lbl\s+/i.test(line)) continue;

        // --- Goto ---
        const gotoM = line.match(/^Goto\s+(\w+)/i);
        if (gotoM) {
          const lbl = gotoM[1].toUpperCase();
          if (labels[lbl] !== undefined) pc = labels[lbl];
          continue;
        }

        // --- Disp / Print ---
        const dispM = line.match(/^(?:Disp|Print)\s+"(.*)"/i);
        if (dispM) { onOutput(dispM[1]); continue; }
        const dispVarM = line.match(/^(?:Disp|Print)\s+(.+)/i);
        if (dispVarM) { onOutput(String(evalExpr(dispVarM[1]))); continue; }

        // --- Locate (simplified – just output) ---
        const locM = line.match(/^Locate\s+\d+\s*,\s*\d+\s*,\s*"(.*)"/i);
        if (locM) { onOutput(locM[1]); continue; }

        // --- Input ---
        const inputM = line.match(/^Input\s+([A-Z])/i);
        if (inputM) {
          const varName = inputM[1].toUpperCase();
          const prompt = line.match(/^Input\s+"([^"]+)"\s*,\s*([A-Z])/i);
          const msg = prompt ? prompt[1] : `${varName}?`;
          const val = await onInput(msg);
          vars[varName] = parseFloat(val) || 0;
          continue;
        }

        // --- ClrText ---
        if (/^ClrText$/i.test(line)) { onOutput('\x0C'); continue; }

        // --- If / Then / Else / IfEnd ---
        const ifM = line.match(/^If\s+(.+)/i);
        if (ifM) {
          const cond = evalCond(ifM[1]);
          // Read Then line
          if (pc < lines.length && /^Then/i.test(lines[pc])) {
            pc++; // consume Then
            if (!cond) {
              // Skip to Else or IfEnd
              let depth = 1;
              while (pc < lines.length && depth > 0) {
                const l = lines[pc];
                if (/^If\b/i.test(l)) depth++;
                else if (/^IfEnd$/i.test(l) || /^Else$/i.test(l)) depth--;
                pc++;
              }
              if (/^Else$/i.test(lines[pc - 1])) {
                // continue executing Else block
              }
            }
          } else {
            // Single-line If: If cond:statement
            // already handled by line splitting
          }
          continue;
        }

        if (/^Else$/i.test(line)) {
          // Skip to IfEnd
          let depth = 1;
          while (pc < lines.length && depth > 0) {
            const l = lines[pc];
            if (/^If\b/i.test(l)) depth++;
            else if (/^IfEnd$/i.test(l)) depth--;
            pc++;
          }
          continue;
        }

        if (/^IfEnd$/i.test(line)) continue;

        // --- For / To / Step / Next ---
        const forM = line.match(/^For\s+([A-Z])\s*=\s*(.+)\s+To\s+(.+?)(?:\s+Step\s+(.+))?$/i);
        if (forM) {
          const v = forM[1].toUpperCase();
          const from = evalExpr(forM[2]);
          const to = evalExpr(forM[3]);
          const step = forM[4] ? evalExpr(forM[4]) : 1;
          vars[v] = from;
          forStack.push({ v, to, step, line: pc });
          continue;
        }

        if (/^Next$/i.test(line)) {
          if (forStack.length > 0) {
            const f = forStack[forStack.length - 1];
            vars[f.v] += f.step;
            const done = f.step > 0 ? vars[f.v] > f.to : vars[f.v] < f.to;
            if (done) {
              forStack.pop();
            } else {
              pc = f.line;
            }
          }
          continue;
        }

        // --- While / WhileEnd ---
        const whileM = line.match(/^While\s+(.+)/i);
        if (whileM) {
          const condLine = pc - 1;
          if (!evalCond(whileM[1])) {
            // Skip to WhileEnd
            let depth = 1;
            while (pc < lines.length && depth > 0) {
              const l = lines[pc];
              if (/^While\b/i.test(l)) depth++;
              else if (/^WhileEnd$/i.test(l)) depth--;
              pc++;
            }
          } else {
            whileStack.push({ condLine, cond: whileM[1] });
          }
          continue;
        }

        if (/^WhileEnd$/i.test(line)) {
          if (whileStack.length > 0) {
            const w = whileStack[whileStack.length - 1];
            if (evalCond(w.cond)) {
              pc = w.condLine + 1;
            } else {
              whileStack.pop();
            }
          }
          continue;
        }

        // --- Break / Stop ---
        if (/^(?:Break|Stop)$/i.test(line)) break;

        // --- Plain expression (output result) ---
        const result = evalExpr(line);
        if (result !== undefined && result !== null && !isNaN(result)) {
          onOutput(String(result));
        }
      }
      resolve(vars);
    }

    run();
  });
}
