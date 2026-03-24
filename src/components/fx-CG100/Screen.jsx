import MathDisplay from '../shared/MathDisplay.jsx';

export default function Screen({ input, result, isError, angleMode }) {
  // Convert plain expression to a basic LaTeX for display
  const displayLatex = exprToLatex(input);

  return (
    <div className="cg100-screen">
      <div className="cg100-screen-top">
        <span>{angleMode}</span>
        <span>Math</span>
      </div>
      <div className="cg100-input-area">
        {/* Expression line */}
        <div className="cg100-expr">
          {input ? (
            <MathDisplay latex={displayLatex} inline />
          ) : (
            <span className="cursor" />
          )}
          {input && <span className="cursor" />}
        </div>
        {/* Result line */}
        <div className={`cg100-result ${isError ? 'error' : result === '' ? 'empty' : ''}`}>
          {result !== '' ? (
            isError ? result : <MathDisplay latex={escapeLatex(result)} inline />
          ) : (
            <span style={{color:'#333'}}>—</span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Convert a calculator expression to KaTeX-friendly LaTeX */
function exprToLatex(expr) {
  if (!expr) return '';
  return expr
    .replace(/\*/g, '\\times ')
    .replace(/\//g, '\\div ')
    .replace(/sqrt\(([^)]*)\)/g, '\\sqrt{$1}')
    .replace(/π/g, '\\pi ')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ');
}

function escapeLatex(str) {
  if (!str) return '';
  // If it's a fraction-like result, try to show it nicely
  const fracMatch = str.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (fracMatch) {
    return `${fracMatch[1]}\\dfrac{${fracMatch[2]}}{${fracMatch[3]}}`;
  }
  const pureFrac = str.match(/^(-?)(\d+)\/(\d+)$/);
  if (pureFrac) {
    return `${pureFrac[1]}\\dfrac{${pureFrac[2]}}{${pureFrac[3]}}`;
  }
  // Scientific notation
  const sci = str.match(/^(-?[\d.]+)×10\^(-?\d+)$/);
  if (sci) {
    return `${sci[1]}\\times10^{${sci[2]}}`;
  }
  return str.replace(/\\/g, '\\\\').replace(/[_^]/g, '\\$&');
}
