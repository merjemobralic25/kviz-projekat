import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFetch, api } from '../hooks/useFetch';
import { useTimer } from '../hooks/useTimer';
import toast from 'react-hot-toast';

const QuizPlayPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: quiz, loading } = useFetch(`/quizzes/${id}`);
  const [phase, setPhase] = useState('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const finishQuiz = useCallback(async (finalAnswers, finalScore) => {
    timer.pause();
    setPhase('result');
    if (isAuthenticated && user) {
      try {
        await api.post('/results', {
          userId: user.id, quizId: id,
          score: finalScore, total: quiz?.questions?.length || 0,
          percentage: Math.round((finalScore / (quiz?.questions?.length || 1)) * 100),
          completedAt: new Date().toISOString(),
        });
      } catch { /* silent */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, id, quiz]);

  const handleExpire = useCallback(() => {
    toast.error('Vrijeme je isteklo!');
    finishQuiz(answers, score);
  }, [answers, score, finishQuiz]);

  const timer = useTimer(quiz?.timeLimit || 300, handleExpire);

  useEffect(() => {
    if (quiz && phase === 'playing') timer.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, phase]);

  if (loading) return <div className="loading-center page-wrapper"><div className="spinner" /><p>Učitavanje...</p></div>;
  if (!quiz) return (
    <div className="loading-center page-wrapper">
      <span style={{ fontSize: '3rem' }}>❌</span>
      <h2>Kviz nije pronađen</h2>
      <Link to="/quizzes" className="btn btn-primary">Nazad</Link>
    </div>
  );

  const questions = quiz.questions || [];
  const question = questions[currentQ];

  const handleSelect = (idx) => {
    if (showAnswer || selected !== null) return;
    setSelected(idx);
    setShowAnswer(true);
    const isCorrect = idx === question.correct;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);
    setTimeout(() => {
      const nextAnswers = [...answers, { isCorrect, selected: idx, correct: question.correct }];
      setAnswers(nextAnswers);
      if (currentQ + 1 < questions.length) {
        setCurrentQ(q => q + 1);
        setSelected(null);
        setShowAnswer(false);
      } else {
        finishQuiz(nextAnswers, newScore);
      }
    }, 1200);
  };

  const optionClass = (idx) => {
    if (!showAnswer) return selected === idx ? 'opt selected' : 'opt';
    if (idx === question.correct) return 'opt correct';
    if (idx === selected && idx !== question.correct) return 'opt wrong';
    return 'opt';
  };

  const pct = Math.round((score / questions.length) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪';

  const resetQuiz = () => { setPhase('intro'); setCurrentQ(0); setSelected(null); setAnswers([]); setScore(0); setShowAnswer(false); timer.reset(); };

  
  if (phase === 'intro') return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px var(--space-lg) 40px' }}>
      <div className="card animate-scale-in" style={{ maxWidth: 600, width: '100%', textAlign: 'center', padding: '48px 40px' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <span className="badge badge-accent">{quiz.category}</span>
          <span className={`badge ${quiz.difficulty === 'Lako' ? 'badge-success' : quiz.difficulty === 'Teško' ? 'badge-danger' : 'badge-warning'}`}>{quiz.difficulty}</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>{quiz.title}</h1>
        <p style={{ marginBottom: 32 }}>{quiz.description}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, padding: '24px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', marginBottom: 32 }}>
          {[['❓', questions.length, 'pitanja'], ['⏱', `${Math.floor(quiz.timeLimit / 60)}m`, 'vremena'], ['⭐', quiz.difficulty, 'težina']].map(([icon, val, lbl]) => (
            <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{val}</strong>
              <small style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{lbl}</small>
            </div>
          ))}
        </div>
        {!isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(108,99,255,0.1)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', marginBottom: 24, textAlign: 'left' }}>
            <span>ℹ️</span>
            <p style={{ flex: 1, fontSize: '0.85rem', margin: 0 }}>Prijavite se da sačuvate rezultate.</p>
            <Link to="/login" className="btn btn-sm btn-outline">Prijavi se</Link>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-accent btn-lg" onClick={() => setPhase('playing')}>Pokreni kviz ⚡</button>
          <Link to="/quizzes" className="btn btn-ghost">Nazad</Link>
        </div>
      </div>
    </div>
  );


  if (phase === 'result') return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px var(--space-lg) 40px' }}>
      <div className="card animate-scale-in" style={{ maxWidth: 580, width: '100%', textAlign: 'center', padding: '48px 40px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>{emoji}</div>
        <h1 style={{ fontSize: '2rem', marginBottom: 24 }}>Kviz završen!</h1>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: pct >= 60 ? 'var(--color-accent)' : 'var(--color-danger)' }}>{pct}%</span>
          <div style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{score} / {questions.length} tačnih</div>
        </div>
        <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct >= 60 ? 'var(--color-accent)' : 'var(--color-danger)', borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
        <p style={{ marginBottom: 24 }}>{pct >= 80 ? 'Odlično! Izvrsno znanje.' : pct >= 60 ? 'Dobro urađeno!' : pct >= 40 ? 'Nastavite učiti!' : 'Ne odustajte!'}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28, textAlign: 'left' }}>
          {answers.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: a.isCorrect ? 'rgba(6,214,160,0.1)' : 'rgba(255,77,109,0.1)', fontSize: '0.85rem', color: a.isCorrect ? 'var(--color-success)' : 'var(--color-danger)' }}>
              <span>{a.isCorrect ? '✓' : '✗'}</span>
              <span style={{ color: 'var(--color-text-muted)', flex: 1 }}>{questions[i]?.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={resetQuiz}>Pokušaj ponovo</button>
          <Link to="/quizzes" className="btn btn-outline">Drugi kvizovi</Link>
          <Link to="/leaderboard" className="btn btn-ghost">Rang lista</Link>
        </div>
      </div>
    </div>
  );

 
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="play-wrapper animate-fade-in">
          <div className="play-header">
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>Pitanje {currentQ + 1} / {questions.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>{quiz.title}</div>
            </div>
            <div className={`play-timer${timer.isWarning ? ' warn' : ''}${timer.isDanger ? ' danger' : ''}`}>
              ⏱ {timer.formatted}
            </div>
          </div>
          <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ width: `${(currentQ / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', transition: 'width 0.4s ease', borderRadius: 2 }} />
          </div>
          <div className="card" style={{ padding: '36px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>#{currentQ + 1}</p>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 32, color: 'var(--color-text)' }}>{question?.text}</h2>
            <div className="options-grid">
              {question?.options.map((opt, idx) => (
                <button key={idx} className={optionClass(idx)} onClick={() => handleSelect(idx)} disabled={showAnswer}>
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span style={{ flex: 1, fontSize: '0.95rem' }}>{opt}</span>
                  {showAnswer && idx === question.correct && <span>✓</span>}
                  {showAnswer && idx === selected && idx !== question.correct && <span>✗</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .play-wrapper { max-width: 700px; margin: var(--space-xl) auto; padding-bottom: var(--space-3xl); }
        .play-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .play-timer { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; padding: 10px 20px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); transition: all var(--transition-base); }
        .play-timer.warn { border-color: var(--color-warning); color: var(--color-warning); }
        .play-timer.danger { border-color: var(--color-danger); color: var(--color-danger); animation: pulse 1s infinite; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .opt { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--color-surface-2); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-base); font-family: var(--font-body); color: var(--color-text); text-align: left; }
        .opt:hover:not(:disabled) { border-color: var(--color-primary); background: var(--color-primary-glow); transform: translateY(-2px); }
        .opt.selected { border-color: var(--color-primary); background: var(--color-primary-glow); }
        .opt.correct { border-color: var(--color-success); background: rgba(6,214,160,0.15); color: var(--color-success); }
        .opt.wrong { border-color: var(--color-danger); background: rgba(255,77,109,0.15); color: var(--color-danger); }
        .opt-letter { width: 28px; height: 28px; border-radius: 50%; background: var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
        @media (max-width: 600px) { .options-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default QuizPlayPage;