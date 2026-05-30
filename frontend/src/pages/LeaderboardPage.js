import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const LeaderboardPage = () => {
  const { data: results, loading: rL } = useFetch('/results');
  const { data: users, loading: uL } = useFetch('/users');
  const { data: quizzes } = useFetch('/quizzes');
  const [tab, setTab] = useState('global');
  const loading = rL || uL;

  const getName = (uid) => users?.find(u => u.id === uid)?.name || `User #${uid}`;
  const getQuiz = (qid) => quizzes?.find(q => q.id === qid)?.title || `Quiz #${qid}`;

  const leaderboard = (() => {
    if (!results || !users) return [];
    const byUser = {};
    results.forEach(r => { if (!byUser[r.userId] || r.percentage > byUser[r.userId].percentage) byUser[r.userId] = r; });
    return Object.values(byUser).map(r => ({ ...r, name: getName(r.userId) })).sort((a, b) => b.percentage - a.percentage);
  })();

  const recent = [...(results || [])].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 20).map(r => ({ ...r, name: getName(r.userId), quizTitle: getQuiz(r.quizId) }));

  const medal = (i) => ['🥇', '🥈', '🥉'][i] || `#${i + 1}`;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0 var(--space-xl)' }} className="animate-fade-in">
          <span className="section-tag">Takmičenje</span>
          <h1 style={{ margin: '12px 0 16px' }}>Rang lista</h1>
          <p>Pogledajte ko su najbolji kvizerski umovi</p>
        </div>

        <div className="lb-tabs animate-fade-in">
          <button className={`lb-tab${tab === 'global' ? ' active' : ''}`} onClick={() => setTab('global')}>🏆 Globalno</button>
          <button className={`lb-tab${tab === 'recent' ? ' active' : ''}`} onClick={() => setTab('recent')}>🕐 Nedavno</button>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <>
            {tab === 'global' && (
              <div className="animate-fade-in">
                {leaderboard.length === 0
                  ? <div style={{ textAlign: 'center', padding: '80px 24px' }}><span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>🏆</span><h3>Nema rezultata još</h3><p>Budite prvi! Igrajte kviz.</p></div>
                  : (
                    <>
                      {leaderboard.length >= 3 && (
                        <div className="podium">
                          {[{ p: leaderboard[1], r: 2 }, { p: leaderboard[0], r: 1 }, { p: leaderboard[2], r: 3 }].map(({ p, r }) => (
                            <div key={r} className={`podium-place rank-${r}`}>
                              <div className="podium-avatar">{p?.name?.charAt(0).toUpperCase()}</div>
                              <span style={{ fontSize: '1.6rem' }}>{['🥇', '🥈', '🥉'][r - 1]}</span>
                              <strong>{p?.name}</strong>
                              <span style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600 }}>{p?.percentage}%</span>
                              <div className={`podium-bar pb-${r}`} />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="table-wrapper">
                        <table>
                          <thead><tr><th>Rang</th><th>Korisnik</th><th>Rezultat</th><th>Tačnih</th><th>Datum</th></tr></thead>
                          <tbody>
                            {leaderboard.map((e, i) => (
                              <tr key={e.userId} style={{ background: i < 3 ? 'rgba(108,99,255,0.04)' : '' }}>
                                <td style={{ fontSize: '1.1rem' }}>{medal(i)}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{e.name.charAt(0).toUpperCase()}</div>
                                    {e.name}
                                  </div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 80, height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                                      <div style={{ width: `${e.percentage}%`, height: '100%', background: e.percentage >= 60 ? 'var(--color-success)' : 'var(--color-warning)' }} />
                                    </div>
                                    <strong style={{ color: 'var(--color-text)' }}>{e.percentage}%</strong>
                                  </div>
                                </td>
                                <td>{e.score} / {e.total}</td>
                                <td>{new Date(e.completedAt).toLocaleDateString('bs-BA')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )
                }
              </div>
            )}
            {tab === 'recent' && (
              <div className="table-wrapper animate-fade-in">
                {recent.length === 0
                  ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>Nema nedavnih rezultata</div>
                  : (
                    <table>
                      <thead><tr><th>Korisnik</th><th>Kviz</th><th>Rezultat</th><th>Datum</th></tr></thead>
                      <tbody>
                        {recent.map((r, i) => (
                          <tr key={i}>
                            <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{r.name.charAt(0).toUpperCase()}</div>{r.name}</div></td>
                            <td>{r.quizTitle}</td>
                            <td><strong style={{ color: r.percentage >= 60 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.percentage}%</strong></td>
                            <td>{new Date(r.completedAt).toLocaleDateString('bs-BA')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .lb-tabs { display: flex; gap: 8px; margin-bottom: 32px; border-bottom: 1px solid var(--color-border); }
        .lb-tab { padding: 12px 24px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--color-text-muted); font-family: var(--font-body); font-size: 0.95rem; cursor: pointer; transition: all var(--transition-base); margin-bottom: -1px; }
        .lb-tab:hover { color: var(--color-text); }
        .lb-tab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
        .podium { display: flex; justify-content: center; align-items: flex-end; gap: 16px; margin-bottom: 40px; padding: 32px 24px; }
        .podium-place { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .rank-1 { order: 2; } .rank-2 { order: 1; } .rank-3 { order: 3; }
        .podium-avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; }
        .rank-1 .podium-avatar { width: 68px; height: 68px; font-size: 1.6rem; box-shadow: 0 0 24px var(--color-primary-glow); }
        .podium-place strong { font-family: var(--font-display); font-size: 0.9rem; color: var(--color-text); }
        .podium-bar { width: 80px; border-radius: 4px 4px 0 0; }
        .pb-1 { height: 80px; background: linear-gradient(180deg,rgba(108,99,255,0.6),rgba(108,99,255,0.1)); }
        .pb-2 { height: 60px; background: linear-gradient(180deg,rgba(255,209,102,0.6),rgba(255,209,102,0.1)); }
        .pb-3 { height: 40px; background: linear-gradient(180deg,rgba(0,217,166,0.6),rgba(0,217,166,0.1)); }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;