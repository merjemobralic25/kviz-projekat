import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';

const StatCard = ({ value, label, delay = 0 }) => (
  <div className="stat-card animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
  <div className="feature-card animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { data: quizzes } = useFetch('/quizzes');
  const { data: results } = useFetch('/results');
  const { data: users } = useFetch('/users');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const totalPlayed = results?.length || 0;
  const totalQuizzes = quizzes?.length || 0;
  const totalUsers = users?.length || 0;

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero__glow-1" />
        <div className="hero__glow-2" />
        <div className={`container hero__content${visible ? ' visible' : ''}`}>
          <div className="hero__tag">🏆 Online Kviz Platforma</div>
          <h1 className="hero__title">
            Testirajte<br />
            <span className="hero__title-accent">svoje znanje</span><br />
            u realnom vremenu
          </h1>
          <p className="hero__desc">
            Stotine kvizova iz različitih oblasti. Takmičite se s drugima,
            pratite napredak i budite na vrhu rang liste.
          </p>
          <div className="hero__actions">
            {isAuthenticated ? (
              <Link to="/quizzes" className="btn btn-accent btn-lg">
                Istraži kvizove →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-accent btn-lg">Kreni odmah — besplatno</Link>
                <Link to="/quizzes" className="btn btn-outline btn-lg">Pogledaj kvizove</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero__scroll-hint">↓ Scroll</div>
      </section>

      {/* Stats */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            <StatCard value={`${totalQuizzes}+`} label="Kvizova" delay={0} />
            <StatCard value={`${totalUsers}+`} label="Korisnika" delay={100} />
            <StatCard value={`${totalPlayed}+`} label="Odigranih rundi" delay={200} />
            <StatCard value="3" label="Kategorije" delay={300} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Zašto QuizMaster?</span>
            <h2>Sve što trebate za<br />vrhunsko iskustvo učenja</h2>
          </div>
          <div className="grid-3">
            <FeatureCard icon="⏱️" title="Vremenski ograničeni kvizovi" desc="Svaki kviz ima tajmer koji dodaje uzbuđenje i poboljšava fokus." delay={0} />
            <FeatureCard icon="🏆" title="Globalna rang lista" desc="Takmičite se s korisnicima širom svijeta i budite na vrhu." delay={100} />
            <FeatureCard icon="📊" title="Detaljne statistike" desc="Pratite napredak, analizirajte rezultate i unaprijedite znanje." delay={200} />
            <FeatureCard icon="🎯" title="Razne kategorije" desc="Opće znanje, nauka, geografija i mnoge druge oblasti." delay={300} />
            <FeatureCard icon="📱" title="Mobilni prikaz" desc="Igrajte na bilo kojem uređaju — telefon, tablet ili računar." delay={400} />
            <FeatureCard icon="🔒" title="Sigurni nalozi" desc="Registrujte se, sačuvajte rezultate i pratite historiju." delay={500} />
          </div>
        </div>
      </section>

      {/* Quiz Preview */}
      {quizzes && quizzes.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Popularni kvizovi</span>
              <h2>Istražite naše kvizove</h2>
            </div>
            <div className="quiz-preview-grid">
              {quizzes.slice(0, 3).map((quiz, i) => (
                <div key={quiz.id} className="quiz-preview-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="quiz-preview-card__header">
                    <span className="badge badge-accent">{quiz.category}</span>
                    <span className={`badge ${quiz.difficulty === 'Lako' ? 'badge-success' : quiz.difficulty === 'Teško' ? 'badge-danger' : 'badge-warning'}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <div className="quiz-preview-card__footer">
                    <span>❓ {quiz.questions?.length || 0} pitanja</span>
                    <span>⏱ {Math.floor(quiz.timeLimit / 60)}min</span>
                    <Link to={`/quizzes/${quiz.id}`} className="btn btn-sm btn-primary">
                      Igraj
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/quizzes" className="btn btn-outline btn-lg">
                Vidi sve kvizove
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!isAuthenticated && (
        <section className="section">
          <div className="container">
            <div className="cta-box">
              <div className="cta-box__glow" />
              <h2>Spremi se za izazov?</h2>
              <p>Registrujte se besplatno i počnite testirati znanje odmah.</p>
              <Link to="/register" className="btn btn-accent btn-lg">
                Kreirajte nalog — besplatno
              </Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero__glow-1 {
          position: absolute;
          top: -200px; left: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero__glow-2 {
          position: absolute;
          bottom: -100px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,217,166,0.1) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero__content {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
          padding: 120px 0 80px;
          max-width: 700px;
        }
        .hero__content.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero__tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border-hover);
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 24px;
          backdrop-filter: blur(4px);
        }
        .hero__title {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 24px;
        }
        .hero__title-accent {
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero__desc {
          font-size: 1.1rem;
          max-width: 520px;
          margin-bottom: 40px;
          color: var(--color-text-muted);
        }
        .hero__actions { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero__scroll-hint {
          position: absolute;
          bottom: 40px; left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          color: var(--color-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        .stats-section { padding: var(--space-xl) 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
        .stat-card { background: var(--color-surface); padding: 40px 24px; text-align: center; }
        .stat-value { display: block; font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-primary); }
        .stat-label { font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .feature-card { padding: 32px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); transition: all var(--transition-base); }
        .feature-card:hover { border-color: var(--color-primary); transform: translateY(-4px); box-shadow: var(--shadow-primary); }
        .feature-icon { font-size: 2rem; margin-bottom: 16px; }
        .feature-card h3 { font-size: 1.1rem; margin-bottom: 10px; }
        .feature-card p { font-size: 0.9rem; }
        .quiz-preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .quiz-preview-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 12px; transition: all var(--transition-base); }
        .quiz-preview-card:hover { border-color: var(--color-primary); transform: translateY(-4px); }
        .quiz-preview-card__header { display: flex; gap: 8px; flex-wrap: wrap; }
        .quiz-preview-card h3 { font-size: 1.1rem; }
        .quiz-preview-card p { font-size: 0.875rem; flex: 1; }
        .quiz-preview-card__footer { display: flex; align-items: center; gap: 16px; font-size: 0.8rem; color: var(--color-text-muted); margin-top: auto; }
        .quiz-preview-card__footer .btn { margin-left: auto; }
        .cta-box { position: relative; background: linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,217,166,0.1)); border: 1px solid var(--color-primary); border-radius: var(--radius-xl); padding: 80px 48px; text-align: center; overflow: hidden; }
        .cta-box__glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(108,99,255,0.1), transparent 70%); pointer-events: none; }
        .cta-box h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin-bottom: 16px; }
        .cta-box p { margin-bottom: 32px; font-size: 1.05rem; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .quiz-preview-grid { grid-template-columns: 1fr; }
          .cta-box { padding: 48px 24px; }
          .hero__actions { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;