import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a LaTeX string using KaTeX.
 * Falls back to plain text if invalid.
 */
export default function MathDisplay({ latex, inline = false, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !latex) return;
    try {
      katex.render(latex, ref.current, {
        throwOnError: false,
        displayMode: !inline,
        output: 'html',
      });
    } catch {
      if (ref.current) ref.current.textContent = latex;
    }
  }, [latex, inline]);

  return <span ref={ref} className={`math-display ${className}`} />;
}
