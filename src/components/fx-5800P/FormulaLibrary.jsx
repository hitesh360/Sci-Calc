import { useState } from 'react';
import { getCategories, getFormulasByCategory } from '../../lib/formulas.js';
import './Fx5800P.css';

export default function FormulaLibrary({ onUseFormula }) {
  const [selCat, setSelCat] = useState(null);
  const [selFormula, setSelFormula] = useState(null);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState('');

  const categories = getCategories();
  const formulas = selCat ? getFormulasByCategory(selCat) : [];

  const compute = () => {
    if (!selFormula) return;
    try {
      const vals = {};
      selFormula.variables.forEach(v => {
        vals[v.sym] = parseFloat(inputs[v.sym] ?? '0') || 0;
      });
      const res = selFormula.compute(vals);
      setResult(typeof res === 'number' ? res.toPrecision(8).replace(/\.?0+$/, '') : String(res));
    } catch {
      setResult('ERROR');
    }
  };

  // If a formula is selected, show its input form
  if (selFormula) {
    return (
      <div className="formula-lib">
        <div className="formula-lib-title">
          <button onClick={() => setSelFormula(null)} style={{fontSize:8,marginRight:4,background:'none',border:'none',color:'#1a2010',cursor:'pointer'}}>◀</button>
          {selFormula.name}
        </div>
        <div className="formula-lib-scroll" style={{display:'flex',flexDirection:'column',gap:2,padding:'3px 4px'}}>
          {selFormula.variables.map(v => (
            <div key={v.sym} style={{display:'flex',alignItems:'center',gap:3,fontSize:9}}>
              <label style={{color:'#2a3020',width:60,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.label}:</label>
              <input
                type="number"
                value={inputs[v.sym] ?? ''}
                onChange={e => setInputs(prev => ({...prev, [v.sym]: e.target.value}))}
                style={{width:50,fontSize:9,background:'rgba(0,0,0,.1)',border:'none',outline:'none',fontFamily:'monospace',color:'#1a2010'}}
              />
            </div>
          ))}
          <div style={{display:'flex',gap:3,marginTop:2}}>
            <button className="prog-run-btn" onClick={compute}>= Calc</button>
            <button className="prog-run-btn" onClick={() => onUseFormula(selFormula.name)}>Use</button>
          </div>
          {result && <div style={{fontSize:11,fontWeight:700,color:'#1a2010',fontFamily:'monospace'}}>= {result}</div>}
        </div>
      </div>
    );
  }

  // Category selected – show formulas
  if (selCat) {
    return (
      <div className="formula-lib">
        <div className="formula-lib-title">
          <button onClick={() => setSelCat(null)} style={{fontSize:8,marginRight:4,background:'none',border:'none',color:'#1a2010',cursor:'pointer'}}>◀</button>
          {selCat}
        </div>
        <div className="formula-lib-scroll">
          {formulas.map(f => (
            <div key={f.id} className="formula-lib-item" onClick={() => setSelFormula(f)}>
              {f.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Category list
  return (
    <div className="formula-lib">
      <div className="formula-lib-title">FORMULA LIBRARY</div>
      <div className="formula-lib-scroll">
        {categories.map(cat => (
          <div key={cat} className="formula-lib-item" onClick={() => setSelCat(cat)}>
            ▸ {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
