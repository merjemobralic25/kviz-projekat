import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="page-wrapper">
    <div className="container">
      <div className="about-hero animate-fade-in">
        <span className="section-tag">O nama</span>
        <h1>Naša misija je<br /><span className="grad">učenje kroz zabavu</span></h1>
        <p>QuizMaster je online kviz platforma kreirana kao studentski projekat. Naš cilj je stvoriti okruženje gdje korisnici mogu testirati znanje, natjecati se s drugima i neprestano napredovati.</p>
      </div>

      <section className="section">
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[
            { t: 'Preciznost', d: 'Pažljivo osmišljena pitanja koja testiraju stvarno znanje.' },
            { t: 'Brzina', d: 'Intuitivno sučelje koje ne usporava vaš tok razmišljanja.' },
            { t: 'Takmičenje', d: 'Rang lista koja motivira na stalni napredak.' },
            { t: 'Sigurnost', d: 'Vaši podaci su sigurni i zaštićeni u svakom trenutku.' },
          ].map(v => (
            <div key={v.t} className="val-card">
              <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{v.t}</h3>
              <p style={{ fontSize: '0.85rem' }}>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <span className="section-tag">Tim</span>
          <h2>Upoznajte naš tim</h2>
        </div>
        <div className="grid-2">
          {[
            { name: 'Član Tima 1', role: 'Frontend Developer', desc: 'Odgovoran za dizajn i implementaciju korisničkog sučelja. Razvio komponente, stranice i navigaciju.', init: 'Č1', color: 'var(--color-primary)' },
            { name: 'Član Tima 2', role: 'Backend & Auth', desc: 'Odgovoran za json-server backend, autentikaciju, admin panel i CRUD operacije.', init: 'Č2', color: 'var(--color-accent)' },
          ].map(m => (
            <div key={m.name} className="team-card">
              <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, flexShrink: 0 }}>{m.init}</div>
              <div>
                <h3 style={{ marginBottom: 4 }}>{m.name}</h3>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-accent)', fontWeight: 600, display: 'block', marginBottom: 10 }}>{m.role}</span>
                <p style={{ fontSize: '0.875rem' }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header"><span className="section-tag">Tehnologije</span><h2>Tech Stack</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[
            ['React 18','Frontend'],['React Router v6','Rutiranje'],
            ['Context API','State'],['json-server','Backend'],
            ['CSS Custom','Stilovi'],['Docker','Kontejneri'],
            ['GitHub Actions','CI/CD'],['GCP Cloud Run','Hosting'],
          ].map(([name, desc]) => (
            <div key={name} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6, transition: 'all var(--transition-base)', cursor: 'default' }} className="tech-item">
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{name}</strong>
              <small style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{desc}</small>
            </div>
          ))}
        </div>
      </section>

      <div className="cta-about">
        <h2>Gotovi za izazov?</h2>
        <p style={{ marginBottom: 32 }}>Pridružite se i testirajte znanje</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-accent btn-lg">Kreirajte nalog</Link>
          <Link to="/contact" className="btn btn-outline btn-lg">Kontaktirajte nas</Link>
        </div>
      </div>
    </div>

    <style>{`
      .about-hero { text-align: center; padding: var(--space-2xl) 0 var(--space-xl); max-width: 700px; margin: 0 auto; }
      .about-hero h1 { margin: 12px 0 24px; }
      .about-hero p { font-size: 1.1rem; }
      .grad { background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .val-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 28px 24px; text-align: center; transition: all var(--transition-base); }
      .val-card:hover { border-color: var(--color-primary); transform: translateY(-4px); }
      .team-card { display: flex; gap: 20px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 28px; transition: all var(--transition-base); }
      .team-card:hover { border-color: var(--color-accent); }
      .tech-item:hover { border-color: var(--color-primary); }
      .cta-about { text-align: center; padding: var(--space-2xl); background: linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,217,166,0.08)); border: 1px solid var(--color-border-hover); border-radius: var(--radius-xl); margin-bottom: var(--space-3xl); }
      .cta-about h2 { margin-bottom: 12px; }
      @media (max-width: 1024px) { .val-card-grid { grid-template-columns: repeat(2,1fr) !important; } }
      @media (max-width: 768px) { .team-card { flex-direction: column; align-items: center; text-align: center; } }
    `}</style>
  </div>
);

export default AboutPage;