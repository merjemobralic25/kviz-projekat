import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Lokalni podaci koji glume bazu da te Codespaces ne bi zezao
const allQuizzes = [
  {
    "id": "1",
    "title": "Opće znanje",
    "description": "Testirajte svoje opće znanje iz različitih oblasti.",
    "category": "Opće znanje",
    "difficulty": "Srednje",
    "timeLimit": 45,
    "questions": [
      { "id": "q1", "text": "Koji je glavni grad Bosne i Hercegovine?", "options": ["Banja Luka", "Sarajevo", "Mostar", "Tuzla"], "correct": 1 },
      { "id": "q2", "text": "Koliko planeta ima u Sunčevom sistemu?", "options": ["7", "8", "9", "10"], "correct": 1 },
      { "id": "q3", "text": "Koja rijeka prolazi kroz London?", "options": ["Temza", "Sena", "Rajn", "Dunav"], "correct": 0 },
      { "id": "q4", "text": "Ko je napisao 'Romeo i Julija'?", "options": ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"], "correct": 2 },
      { "id": "q5", "text": "Koliko strana ima kocka?", "options": ["4", "6", "8", "12"], "correct": 1 }
    ]
  },
  {
    "id": "2",
    "title": "Nauka i tehnologija",
    "description": "Koliko znate o najnovijim dostignućima nauke i tehnologije?",
    "category": "Nauka",
    "difficulty": "Teško",
    "timeLimit": 60,
    "questions": [
      { "id": "q1", "text": "Koji element ima hemijski simbol 'Au'?", "options": ["Srebro", "Platina", "Zlato", "Aluminij"], "correct": 2 },
      { "id": "q2", "text": "Koja kompanija je razvila React?", "options": ["Google", "Microsoft", "Apple", "Meta"], "correct": 3 },
      { "id": "q3", "text": "Šta znači HTTP?", "options": ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transport Protocol", "Hybrid Transfer Text Protocol"], "correct": 0 },
      { "id": "q4", "text": "Koji jezik se koristi za stilizovanje web stranica?", "options": ["HTML", "JavaScript", "CSS", "Python"], "correct": 2 }
    ]
  },
  {
    "id": "3",
    "title": "Geografija svijeta",
    "description": "Putujte kroz kontinente i testujte svoje znanje geografije.",
    "category": "Geografija",
    "difficulty": "Lako",
    "timeLimit": 30,
    "questions": [
      { "id": "q1", "text": "Koji je najveći ocean na svijetu?", "options": ["Atlantski", "Indijski", "Tihi", "Arktički"], "correct": 2 },
      { "id": "q2", "text": "Na kom kontinentu se nalazi Sahara?", "options": ["Azija", "Afrika", "Australija", "Južna Amerika"], "correct": 1 },
      { "id": "q3", "text": "Koja je najduža rijeka na svijetu?", "options": ["Amazon", "Nil", "Jangce", "Mississippi"], "correct": 1 }
    ]
  }
];

const QuizPlayPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Simulacija korisnika i ucitavanja
  const isAuthenticated = true;
  const user = { id: "user123", name: "Merjem", email: "merjem@test.com" };
  const loading = false;

  // Pronalazi kviz lokalno prema ID-u iz URL-a
  const quiz = allQuizzes.find(q => q.id === id) || allQuizzes[0];

  const [phase, setPhase] = useState('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit || 45);
  const [timerActive, setTimerActive] = useState(false);

  // Obicni brojac umjesto custom kuke koja moze da zeza
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      toast.error('Vrijeme je isteklo!');
      setPhase('result');
      setTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const finishQuiz = (finalAnswers, finalScore) => {
    setTimerActive(false);
    setPhase('result');
    toast.success('Kviz uspješno završen!');
  };

  const startQuiz = () => {
    setPhase('playing');
    setTimerActive(true);
  };

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

  const questions = quiz?.questions || [];
  const question = questions[currentQ];
  const pct = Math.round((score / questions.length) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪';

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const resetQuiz = () => { 
    setPhase('intro'); 
    setCurrentQ(0); 
    setSelected(null); 
    setAnswers([]); 
    setScore(0); 
    setShowAnswer(false); 
    setTimeLeft(quiz?.timeLimit || 45);
  };

  if (phase === 'intro') return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px var(--space-lg) 40px' }}>
      <div className="card" style={{ maxWidth: 600, width: '100%', textAlign: 'center', padding: '48px 40px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <span className="badge badge-accent">{quiz.category}</span>
          <span className={`badge ${quiz.difficulty === 'Lako' ? 'badge-success' : quiz.difficulty === 'Teško' ? 'badge-danger' : 'badge-warning'}`}>{quiz.difficulty}</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>{quiz.title}</h1>
        <p style={{ marginBottom: 32 }}>{quiz.description}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, padding: '24px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', marginBottom: 32 }}>
        {[['❓', questions.length, 'pitanja'], ['⏱', `${quiz.timeLimit}s`, 'vremena'], ['⭐', quiz.difficulty, 'težina']].map(([icon, val, lbl]) => (
  <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{val}</strong>
              <small style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{lbl}</small>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-accent btn-lg" onClick={startQuiz}>Pokreni kviz ⚡</button>
          <Link to="/quizzes" className="btn btn-ghost">Nazad</Link>
        </div>
      </div>
    </div>
  );

  if (phase === 'result') return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px var(--space-lg) 40px' }}>
      <div className="card" style={{ maxWidth: 580, width: '100%', textAlign: 'center', padding: '48px 40px', background: 'var(--color-surface)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>{emoji}</div>
        <h1 style={{ fontSize: '2rem', marginBottom: 24 }}>Kviz završen!</h1>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: pct >= 60 ? 'var(--color-accent)' : 'var(--color-danger)' }}>{pct}%</span>
          <div style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{score} / {questions.length} tačnih</div>
        </div>
        <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct >= 60 ? 'var(--color-accent)' : 'var(--color-danger)', borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={resetQuiz}>Pokušaj ponovo</button>
          <Link to="/quizzes" className="btn btn-outline">Drugi kvizovi</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="play-wrapper">
          <div className="play-header">
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Pitanje {currentQ + 1} / {questions.length}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{quiz.title}</div>
            </div>
            <div className="play-timer">⏱ {formattedTime}</div>
          </div>
          <div className="card" style={{ padding: '36px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 32 }}>{question?.text}</h2>
            <div className="options-grid">
              {question?.options.map((opt, idx) => (
                <button key={idx} className={optionClass(idx)} onClick={() => handleSelect(idx)} disabled={showAnswer}>
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span style={{ flex: 1, fontSize: '0.95rem' }}>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .play-wrapper { max-width: 700px; margin: var(--space-xl) auto; }
        .play-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .play-timer { font-size: 1.3rem; font-weight: 700; padding: 10px 20px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .opt { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--color-surface-2); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; color: var(--color-text); text-align: left; width: 100%; }
        .opt.selected { border-color: var(--color-primary); }
        .opt.correct { border-color: var(--color-success); background: rgba(6,214,160,0.15); color: var(--color-success); }
        .opt.wrong { border-color: var(--color-danger); background: rgba(255,77,109,0.15); color: var(--color-danger); }
        .opt-letter { width: 28px; height: 28px; border-radius: 50%; background: var(--color-border); display: flex; align-items: center; justify-content: center; font-shrink: 0; }
        @media (max-width: 600px) { .options-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default QuizPlayPage;