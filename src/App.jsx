import { Component } from 'react';
import CalculatorShell from './components/CalculatorShell.jsx';
import './App.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || 'Unknown error' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', minHeight:'100vh', background:'#121212',
          color:'#e8e8e8', fontFamily:'monospace', padding:'20px', textAlign:'center'
        }}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>⚠️</div>
          <h2 style={{color:'#f90', marginBottom:'8px'}}>Something went wrong</h2>
          <p style={{color:'#888', marginBottom:'20px', maxWidth:'400px'}}>
            {this.state.message || 'An unexpected error occurred. Please refresh the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding:'10px 24px', background:'#f90', color:'#000',
              border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app-root">
        <CalculatorShell />
      </div>
    </ErrorBoundary>
  );
}
