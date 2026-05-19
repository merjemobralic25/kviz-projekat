import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <span className="footer__logo">⚡ QuizMaster</span>
        <p>Platforma za online testiranje znanja.<br />Uči, takmičij se, napreduj.</p>
      </div>
      <div className="footer__links">
        <div className="footer__col">
          <h5>Navigacija</h5>
          <Link to="/">Početna</Link>
          <Link to="/quizzes">Kvizovi</Link>
          <Link to="/leaderboard">Rang lista</Link>
        </div>
        <div className="footer__col">
          <h5>Kompanija</h5>
          <Link to="/about">O nama</Link>
          <Link to="/contact">Kontakt</Link>
        </div>
        <div className="footer__col">
          <h5>Nalog</h5>
          <Link to="/login">Prijava</Link>
          <Link to="/register">Registracija</Link>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="footer__bottom">
        <span>© 2025 QuizMaster. Sva prava zadržana.</span>
        <span>Izgrađeno s ⚡ u Bosni i Hercegovini</span>
      </div>
    </div>
    <style>{`
      .footer {
        border-top: 1px solid var(--color-border);
        padding: 60px 0 32px;
        margin-top: 80px;
        background: var(--color-surface);
      }
      .footer__inner {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 64px;
        padding-bottom: 40px;
        border-bottom: 1px solid var(--color-border);
      }
      .footer__logo {
        font-family: var(--font-display);
        font-size: 1.3rem;
        font-weight: 800;
        display: block;
        margin-bottom: 12px;
        color: var(--color-text);
      }
      .footer__brand p { font-size: 0.9rem; max-width: 260px; }
      .footer__links { display: flex; gap: 48px; }
      .footer__col { display: flex; flex-direction: column; gap: 10px; }
      .footer__col h5 {
        font-family: var(--font-display);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-muted);
        margin-bottom: 4px;
      }
      .footer__col a {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        transition: color var(--transition-base);
      }
      .footer__col a:hover { color: var(--color-primary); }
      .footer__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 24px;
        font-size: 0.8rem;
        color: var(--color-text-dim);
      }
      @media (max-width: 768px) {
        .footer__inner { grid-template-columns: 1fr; gap: 32px; }
        .footer__links { flex-wrap: wrap; gap: 32px; }
        .footer__bottom { flex-direction: column; gap: 8px; text-align: center; }
      }
    `}</style>
  </footer>
);

export default Footer;