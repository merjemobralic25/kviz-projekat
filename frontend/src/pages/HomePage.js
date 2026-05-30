import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { data: quizzes } = useFetch('/quizzes');
  const { data: results } = useFetch('/results');
  const { data: users } = useFetch('/users');
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div className="home-page">
      
      <section className="hero">
        <div className="hero__glow-1" />
        <div className="hero__glow-2" />
        <div className={`container hero__content${visible ? ' visible' : ''}`}>
          <div className="hero__tag">🏆 Online Kviz Platforma</div>
          <h1 className="hero__title">
            Testirajte<br />
            <span className="hero__accent">svoje znanje</span><br />
            u realnom vremenu
          </h1>
          <p className="hero__desc">Stotine kvizova iz različitih oblasti. Takmičite se s drugima, pratite napredak i budite na vrhu rang liste.</p>
          <div className="hero__actions">
            {isAuthenticated
              ? <Link to="/quizzes" className="btn btn-accent btn-lg">Istraži kvizove →</Link>
              : <>
                  <Link to="/register" className="btn btn-accent btn-lg">Kreni odmah — besplatno</Link>
                  <Link to="/quizzes" className="btn btn-outline btn-lg">Pogledaj kvizove</Link>
                </>
            }
          </div>
        </div>
      </section>

      
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="stats-grid">
            {[
              { v: `${quizzes?.length || 0}+`, l: 'Kvizova' },
              { v: `${users?.length || 0}+`, l: 'Korisnika' },
              { v: `${results?.length || 0}+`, l: 'Odigranih rundi' },
              { v: '3', l: 'Kategorije' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <span className="stat-value">{s.v}</span>
                <span className="stat-label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Zašto QuizMaster?</span>
            <h2>Sve što trebate za vrhunsko iskustvo učenja</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '⏱️', t: 'Vremenski ograničeni kvizovi', d: 'Svaki kviz ima tajmer koji dodaje uzbuđenje i poboljšava fokus.' },
              { icon: '🏆', t: 'Globalna rang lista', d: 'Takmičite se s korisnicima širom svijeta i budite na vrhu.' },
              { icon: '📊', t: 'Detaljne statistike', d: 'Pratite napredak, analizirajte rezultate i unaprijedite znanje.' },
              { icon: '🎯', t: 'Razne kategorije', d: 'Opće znanje, nauka, geografija i mnoge druge oblasti.' },
              { icon: '📱', t: 'Mobilni prikaz', d: 'Igrajte na bilo kojem uređaju — telefon, tablet ili računar.' },
              { icon: '🔒', t: 'Sigurni nalozi', d: 'Registrujte se, sačuvajte rezultate i pratite historiju.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: 14 }}>{f.icon}</span>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 10 }}>{f.t}</h3>
                <p style={{ fontSize: '0.875rem' }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {quizzes && quizzes.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Popularni kvizovi</span>
              <h2>Istražite naše kvizove</h2>
            </div>
            <div className="grid-3">
              {quizzes.slice(0, 3).map(q => (
                <div key={q.id} className="quiz-prev-card">
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span className="badge badge-accent">{q.category}</span>
                    <span className={`badge ${q.difficulty === 'Lako' ? 'badge-success' : q.difficulty === 'Teško' ? 'badge-danger' : 'badge-warning'}`}>{q.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{q.title}</h3>
                  <p style={{ fontSize: '0.875rem', flex: 1 }}>{q.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 16 }}>
                    <span>❓ {q.questions?.length || 0} pitanja</span>
                    <span>⏱ {Math.floor(q.timeLimit / 60)}min</span>
                    <Link to={`/quizzes/${q.id}`} className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }}>Igraj</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link to="/quizzes" className="btn btn-outline btn-lg">Vidi sve kvizove</Link>
            </div>
          </div>
        </section>
      )}

      {!isAuthenticated && (
        <section className="section">
          <div className="container">
            <div className="cta-box">
              <h2>Spremi se za izazov?</h2>
              <p>Registrujte se besplatno i počnite testirati znanje odmah.</p>
              <Link to="/register" className="btn btn-accent btn-lg">Kreirajte nalog — besplatno</Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .hero { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; }
        .hero__glow-1 { position: absolute; top: -200px; left: -200px; width: 700px; height: 700px; background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 65%); pointer-events: none; }
        .hero__glow-2 { position: absolute; bottom: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,217,166,0.1) 0%, transparent 65%); pointer-events: none; }
        .hero__content { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; padding: 120px 0 80px; max-width: 700px; }
        .hero__content.visible { opacity: 1; transform: translateY(0); }
        .hero__tag { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: var(--radius-full); border: 1px solid var(--color-border-hover); font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 24px; }
        .hero__title { font-size: clamp(3rem,7vw,5.5rem); font-weight: 800; line-height: 1.05; margin-bottom: 24px; }
        .hero__accent { background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero__desc { font-size: 1.1rem; max-width: 520px; margin-bottom: 40px; }
        .hero__actions { display: flex; gap: 16px; flex-wrap: wrap; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
        .stat-card { background: var(--color-surface); padding: 40px 24px; text-align: center; }
        .stat-value { display: block; font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-primary); }
        .stat-label { font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .feature-card { padding: 32px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); transition: all var(--transition-base); }
        .feature-card:hover { border-color: var(--color-primary); transform: translateY(-4px); box-shadow: var(--shadow-primary); }
        .quiz-prev-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; transition: all var(--transition-base); }
        .quiz-prev-card:hover { border-color: var(--color-primary); transform: translateY(-4px); }
        .cta-box { position: relative; background: linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,217,166,0.1)); border: 1px solid var(--color-primary); border-radius: var(--radius-xl); padding: 80px 48px; text-align: center; }
        .cta-box h2 { font-size: clamp(1.8rem,4vw,2.8rem); margin-bottom: 16px; }
        .cta-box p { margin-bottom: 32px; font-size: 1.05rem; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2,1fr); } .hero__actions { flex-direction: column; } .cta-box { padding: 48px 24px; } }
      `}</style>
    </div>
  );
};

export default HomePage;