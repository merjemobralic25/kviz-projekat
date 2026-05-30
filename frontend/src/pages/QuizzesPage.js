import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

const CATS = ['Sve', 'Opće znanje', 'Nauka', 'Geografija'];
const DIFFS = ['Sve', 'Lako', 'Srednje', 'Teško'];

const QuizzesPage = () => {
  const { data: quizzes, loading } = useFetch('/quizzes');
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Sve');
  const [diff, setDiff] = useState('Sve');

  const filtered = (quizzes || []).filter(q =>
    (q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase())) &&
    (cat === 'Sve' || q.category === cat) &&
    (diff === 'Sve' || q.difficulty === diff)
  );

  const diffBadge = (d) => d === 'Lako' ? 'badge-success' : d === 'Teško' ? 'badge-danger' : 'badge-warning';

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="qp-header animate-fade-in">
          <span className="section-tag">Svi kvizovi</span>
          <h1>Odaberite kviz</h1>
          <p>Pronađite savršeni kviz za vaš nivo znanja</p>
        </div>

        <div className="filters-bar animate-fade-in">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            <input type="text" className="form-input" style={{ paddingLeft: 44 }} placeholder="Pretražite kvizove..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-row">
            {CATS.map(c => <button key={c} className={`filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="filter-row">
            {DIFFS.map(d => <button key={d} className={`filter-btn${diff === d ? ' active' : ''}`} onClick={() => setDiff(d)}>{d}</button>)}
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /><p>Učitavanje kvizova...</p></div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: 24 }}>{filtered.length} kviz{filtered.length !== 1 ? 'a' : ''} pronađeno</p>
            <div className="quizzes-grid">
              {filtered.length === 0
                ? <div className="no-results"><span>🔎</span><h3>Nema rezultata</h3><p>Pokušajte promijeniti filtere.</p></div>
                : filtered.map((q, i) => (
                  <div key={q.id} className="quiz-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      <span className="badge badge-accent">{q.category}</span>
                      <span className={`badge ${diffBadge(q.difficulty)}`}>{q.difficulty}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{q.title}</h3>
                    <p style={{ fontSize: '0.875rem', flex: 1, marginBottom: 16 }}>{q.description}</p>
                    <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>❓ {q.questions?.length || 0} pitanja</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>⏱ {Math.floor(q.timeLimit / 60)} min</span>
                    </div>
                    <Link to={`/quizzes/${q.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Pokreni kviz →</Link>
                  </div>
                ))
              }
            </div>
          </>
        )}
      </div>

      <style>{`
        .qp-header { text-align: center; padding: var(--space-2xl) 0 var(--space-xl); }
        .qp-header h1 { margin: 12px 0 16px; }
        .filters-bar { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; padding: 24px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
        .filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn { padding: 7px 16px; border-radius: var(--radius-full); border: 1.5px solid var(--color-border); background: transparent; color: var(--color-text-muted); font-family: var(--font-body); font-size: 0.85rem; cursor: pointer; transition: all var(--transition-base); }
        .filter-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .filter-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }
        .quizzes-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; padding-bottom: 80px; }
        .quiz-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; transition: all var(--transition-base); }
        .quiz-card:hover { border-color: var(--color-primary); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .no-results { grid-column: 1/-1; text-align: center; padding: 80px 24px; color: var(--color-text-muted); }
        .no-results span { font-size: 3rem; display: block; margin-bottom: 16px; }
        @media (max-width: 1024px) { .quizzes-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 768px) { .quizzes-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default QuizzesPage;