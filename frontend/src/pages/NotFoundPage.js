import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(id); navigate('/'); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <div className="nf-page page-wrapper">
      <div className="nf-glow" />
      <div className="nf-content animate-scale-in">
        <div className="nf-code">
          <span className="nf-digit">4</span>
          <span className="nf-digit nf-zero">0</span>
          <span className="nf-digit">4</span>
        </div>
        <h1>Stranica nije pronađena</h1>
        <p>Izgleda da ste zalutali. Stranica koju tražite ne postoji ili je premještena.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <Link to="/" className="btn btn-primary btn-lg">← Početna stranica</Link>
          <Link to="/quizzes" className="btn btn-outline btn-lg">Igraj kviz</Link>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>
          Automatski redirect za <span className="nf-count">{count}</span> sekundi...
        </p>
      </div>
      <style>{`
        .nf-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; position: relative; overflow: hidden; padding: 100px var(--space-lg) 40px; }
        .nf-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 700px; height: 700px; background: radial-gradient(circle,rgba(108,99,255,0.08) 0%,transparent 65%); pointer-events: none; }
        .nf-content { position: relative; z-index: 1; max-width: 560px; }
        .nf-code { display: flex; justify-content: center; gap: 8px; margin-bottom: 32px; }
        .nf-digit { font-family: var(--font-display); font-size: clamp(5rem,15vw,9rem); font-weight: 800; line-height: 1; background: linear-gradient(135deg,var(--color-primary),rgba(108,99,255,0.4)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nf-zero { background: linear-gradient(135deg,var(--color-accent),rgba(0,217,166,0.4)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: huerot 8s linear infinite; }
        @keyframes huerot { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .nf-content h1 { font-size: clamp(1.5rem,4vw,2.2rem); margin-bottom: 16px; }
        .nf-content p { margin-bottom: 40px; max-width: 420px; margin-left: auto; margin-right: auto; }
        .nf-count { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: var(--color-primary-glow); border: 1px solid var(--color-primary); border-radius: var(--radius-full); color: var(--color-primary); font-weight: 700; font-size: 0.8rem; }
      `}</style>
    </div>
  );
};

export default NotFoundPage;