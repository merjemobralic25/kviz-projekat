import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Merjem Obralić',
      role: 'Full-Stack Developer',
      subjects: 'DWS & OSiRuO',
      contributions: [
        'App.js — glavni routing i integracija',
        'HomePage.js — početna stranica',
        'LoginPage.js & RegisterPage.js',
        'nginx.conf — produkcijska konfiguracija',
        'db.json — baza podataka',
        'package.json (backend)',
        'Dockerfile (backend)',
        'docker-compose.yml — orkestracija'
      ],
      color: 'linear-gradient(135deg, #6c63ff, #00d9a6)',
      emoji: '👩‍💻'
    },
    {
      id: 2,
      name: 'Adna Salatović',
      role: 'Frontend & React Developer',
      subjects: 'DWS & OSiRuO',
      contributions: [
        'React setup — sve biblioteke',
        'index.html & index.js',
        'index.css — globalni dizajn',
        'AuthContext.js — upravljanje autentifikacijom',
        'validators.js — validacija formi',
        'QuizzesPage.js — lista kvizova',
        'QuizPlayPage.js — interaktivno igranje',
        'LeaderboardPage.js — rang lista',
        'AdminPage.js — admin panel',
        'Dockerfile (frontend)'
      ],
      color: 'linear-gradient(135deg, #ff006e, #8338ec)',
      emoji: '🎨'
    },
    {
      id: 3,
      name: 'Adna Hrustanović',
      role: 'Components & Features Developer',
      subjects: 'DWS & OSiRuO',
      contributions: [
        'useFetch.js — dohvaćanje podataka',
        'useForm.js — upravljanje formama',
        'useTimer.js — tajmer funkcionalnost',
        'Navbar.js — navigacijski meni',
        'Footer.js — podnožje',
        'PrivateRoute.js — zaštita stranica',
        'AboutPage.js (ova stranica)',
        'ContactPage.js — kontakt forma',
        'NotFoundPage.js — 404 stranica',
        '.gitignore & sigurnosne provjere'
      ],
      color: 'linear-gradient(135deg, #fb5607, #ffbe0b)',
      emoji: '⚙️'
    }
  ];

  const technologies = [
    { name: 'React', version: '18.2.0', category: 'Frontend Framework' },
    { name: 'React Router', version: '6.22.0', category: 'Routing' },
    { name: 'Context API', version: 'React 18', category: 'State Management' },
    { name: 'react-hot-toast', version: '2.4.1', category: 'Notifications' },
    { name: 'json-server', version: '0.17.4', category: 'Backend' },
    { name: 'Node.js', version: '18.x', category: 'Runtime' },
    { name: 'Docker', version: '24.x', category: 'Containerization' },
    { name: 'nginx', version: 'alpine', category: 'Web Server' },
    { name: 'GitHub Actions', version: 'Latest', category: 'CI/CD' },
    { name: 'GCP Cloud Run', version: 'Latest', category: 'Hosting' }
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Interaktivni kvizovi',
      description: 'Igranje kvizova iz različitih kategorija sa tajmerom'
    },
    {
      icon: '📊',
      title: 'Praćenje rezultata',
      description: 'Detaljni prikaz rezultata i statističkih podataka'
    },
    {
      icon: '🏆',
      title: 'Rang lista',
      description: 'Takmičenje s drugim korisnicima i praćenje napretka'
    },
    {
      icon: '🔐',
      title: 'Sigurna autentifikacija',
      description: 'Login/Register sa zaštitom i upravljanjem session-om'
    },
    {
      icon: '👨‍💼',
      title: 'Admin panel',
      description: 'Potpuno upravljanje (CRUD) kvizovima i korisnicima'
    },
    {
      icon: '📱',
      title: 'Responzivan dizajn',
      description: 'Savršena iskustva na desktop, tablet i mobilnim uređajima'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero__title">O nama</h1>
          <p className="about-hero__subtitle">
            Studentski projekat za predmete DWS i OSiRuO — Full-Stack Web Aplikacija za Online Testiranje
          </p>
        </div>
      </section>

      {/* Project overview */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid-2">
            <div className="about-content">
              <h2>📖 Opis projekta</h2>
              <p>
                <strong>QuizMaster</strong> je moderna web aplikacija za online testiranje znanja. Korisnici mogu igrrati
                kvizove iz različitih kategorija, pratiti svoje rezultate, takmičiti se s drugima na rang listi i
                poboljšavati svoje znanje.
              </p>
              <p>
                Administratori imaju pristup admin panelu gdje mogu upravljati kvizovima, korisnicima, rezultatima i
                kontakt porukama. Aplikacija je izgrađena s React frontendом i json-server backendом, idealna za
                demonstraciju full-stack web razvoja.
              </p>
              <div className="about-highlights">
                <div className="highlight">
                  <strong>3</strong>
                  <span>Članova tima</span>
                </div>
                <div className="highlight">
                  <strong>10</strong>
                  <span>Integriranih tehnologija</span>
                </div>
                <div className="highlight">
                  <strong>4</strong>
                  <span>Akademska predmeta</span>
                </div>
              </div>
            </div>
            <div className="about-features">
              <h3>✨ Ključne mogućnosti</h3>
              <ul className="features-list">
                {features.slice(0, 6).map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-icon">{feature.icon}</span>
                    <div>
                      <strong>{feature.title}</strong>
                      <p>{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="about-section about-section--alt">
        <div className="container">
          <h2 className="about-section__title">👥 Naš tim</h2>
          <p className="about-section__subtitle">
          
          </p>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-card__header" style={{ background: member.color }}>
                  <div className="team-card__avatar">{member.emoji}</div>
                </div>
                <div className="team-card__content">
                  <h3>{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__subjects">📚 {member.subjects}</p>

                  <div className="team-card__contributions">
                    <h4>Doprinos:</h4>
                    <ul>
                      {member.contributions.map((contrib, idx) => (
                        <li key={idx}>{contrib}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="about-section">
        <div className="container">
          <h2 className="about-section__title">🛠️ Tehnologije</h2>
          <p className="about-section__subtitle">Moderna i skalabilna techstack za full-stack razvoj</p>

          <div className="tech-grid">
            {technologies.map((tech, idx) => (
              <div key={idx} className="tech-card">
                <h4>{tech.name}</h4>
                <p className="tech-version">v{tech.version}</p>
                <p className="tech-category">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="about-section about-section--alt">
        <div className="container">
          <h2 className="about-section__title">🏗️ Arhitektura</h2>

          <div className="architecture">
            <div className="architecture-layer">
              <div className="layer-content">
                <h3>🎨 Frontend (React)</h3>
                <p>Port 3000</p>
                <ul>
                  <li>React 18 SPA</li>
                  <li>React Router v6</li>
                  <li>Context API</li>
                  <li>Custom Hooks</li>
                </ul>
              </div>
            </div>

            <div className="architecture-arrow">↕️ REST API (HTTP)</div>

            <div className="architecture-layer">
              <div className="layer-content">
                <h3>🔌 Backend (json-server)</h3>
                <p>Port 3005</p>
                <ul>
                  <li>/users — Upravljanje korisnicima</li>
                  <li>/quizzes — Upravljanje kvizovima</li>
                  <li>/results — Čuvanje rezultata</li>
                  <li>/contacts — Kontakt poruke</li>
                </ul>
              </div>
            </div>

            <div className="architecture-arrow">↕️ Perzistencija</div>

            <div className="architecture-layer">
              <div className="layer-content">
                <h3>💾 Baza podataka</h3>
                <p>db.json</p>
                <ul>
                  <li>JSON datoteka</li>
                  <li>Automatski sprema promjene</li>
                  <li>Unit testing pogodan format</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="ci-cd-section">
            <h3>🚀 CI/CD Pipeline</h3>
            <div className="ci-cd-flow">
              <span>git push</span>
              <span>→</span>
              <span>GitHub Actions</span>
              <span>→</span>
              <span>Build Docker</span>
              <span>→</span>
              <span>Push GCR</span>
              <span>→</span>
              <span>Cloud Run</span>
              <span>→</span>
              <span>✅ Live</span>
            </div>
          </div>
        </div>
      </section>

      {/* Design System */}
      <section className="about-section">
        <div className="container">
          <h2 className="about-section__title">🎨 Dizajn sistem</h2>

          <div className="design-grid">
            <div className="design-item">
              <h4>Paleta boja</h4>
              <div className="color-palette">
                <div className="color-swatch" style={{ background: '#0a0a14' }} title="Primary BG">
                  #0a0a14
                </div>
                <div className="color-swatch" style={{ background: '#6c63ff' }} title="Primary">
                  #6c63ff
                </div>
                <div className="color-swatch" style={{ background: '#00d9a6' }} title="Accent">
                  #00d9a6
                </div>
                <div className="color-swatch" style={{ background: '#ff4d6d' }} title="Danger">
                  #ff4d6d
                </div>
                <div className="color-swatch" style={{ background: '#ffd166' }} title="Warning">
                  #ffd166
                </div>
              </div>
            </div>

            <div className="design-item">
              <h4>Fontovi</h4>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem' }}>
                Syne — Naslovi (400, 600, 700, 800)
              </p>
              <p style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
                DM Sans — Body tekst (300, 400, 500)
              </p>
            </div>

            <div className="design-item">
              <h4>Responsive breakpoints</h4>
              <ul>
                <li>Mobile: &lt; 640px</li>
                <li>Tablet: 640px - 1024px</li>
                <li>Desktop: ≥ 1024px</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo credentials */}
      <section className="about-section about-section--alt">
        <div className="container">
          <h2 className="about-section__title">🔐 Demo nalozi</h2>

          <div className="demo-credentials">
            <div className="credential-card">
              <h4>👨‍💼 Administrator</h4>
              <p className="credential-field">
                <strong>Email:</strong> <code>admin@quiz.com</code>
              </p>
              <p className="credential-field">
                <strong>Lozinka:</strong> <code>admin123</code>
              </p>
              <p className="credential-note">Pristup: Admin panel + sve funkcionalnosti</p>
            </div>

            <div className="credential-card">
              <h4>👤 Guest korisnik</h4>
              <p className="credential-field">
                <strong>Email:</strong> <code>user@quiz.com</code>
              </p>
              <p className="credential-field">
                <strong>Lozinka:</strong> <code>user123</code>
              </p>
              <p className="credential-note">Pristup: Igranje kvizova + rezultati</p>
            </div>

            <div className="credential-card">
              <h4>👥 Dodatni korisnici</h4>
              <p className="credential-field">
                <strong>Email:</strong> <code>marko@example.com</code>
              </p>
              <p className="credential-field">
                <strong>Lozinka:</strong> <code>pass123</code>
              </p>
              <p className="credential-note">Pristup: Igranje kvizova + rezultati</p>
            </div>
          </div>

          <div className="get-started-cta">
            <h3>Želite početi?</h3>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary btn-lg">
                Prijava
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Registracija
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="about-section">
        <div className="container about-cta">
          <h2>Želite saznati više?</h2>
          <p>Ako imate pitanja, sugestije ili povratne informacije, slobodno nas kontaktirajte!</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Kontaktirajte nas
          </Link>
        </div>
      </section>

      <style>{`
        .about-page {
          padding-top: 80px;
        }

        /* Hero section */
        .about-hero {
          background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(0, 217, 166, 0.05));
          border-bottom: 1px solid var(--color-border);
          padding: 80px 0;
          text-align: center;
        }

        .about-hero__title {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-hero__subtitle {
          font-size: 1.2rem;
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Sections */
        .about-section {
          padding: 80px 0;
        }

        .about-section--alt {
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .about-section__title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 12px;
          text-align: center;
        }

        .about-section__subtitle {
          font-size: 1.1rem;
          color: var(--color-text-muted);
          text-align: center;
          margin-bottom: 48px;
        }

        /* Grid layouts */
        .about-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .about-content h2 {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: 20px;
          color: var(--color-text);
        }

        .about-content p {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }

        /* Highlights */
        .about-highlights {
          display: flex;
          gap: 32px;
          margin-top: 32px;
          padding: 24px;
          background: var(--color-surface-2);
          border-radius: var(--radius-lg);
        }

        .highlight {
          flex: 1;
          text-align: center;
        }

        .highlight strong {
          display: block;
          font-size: 2rem;
          color: var(--color-primary);
          margin-bottom: 8px;
        }

        .highlight span {
          display: block;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        /* Features list */
        .about-features h3 {
          font-size: 1.5rem;
          margin-bottom: 24px;
          color: var(--color-text);
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .features-list li {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: var(--color-surface-2);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          transition: all 0.3s ease;
        }

        .features-list li:hover {
          background: var(--color-border);
          border-color: var(--color-primary);
        }

        .feature-icon {
          font-size: 1.5rem;
          min-width: 32px;
        }

        .features-list strong {
          display: block;
          color: var(--color-text);
          margin-bottom: 4px;
        }

        .features-list p {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin: 0;
        }

        /* Team grid */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
          margin-top: 48px;
        }

        .team-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          hover {
            border-color: var(--color-primary);
            box-shadow: 0 12px 48px rgba(108, 99, 255, 0.15);
          }
        }

        .team-card:hover {
          border-color: var(--color-primary);
          box-shadow: 0 12px 48px rgba(108, 99, 255, 0.15);
          transform: translateY(-4px);
        }

        .team-card__header {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .team-card__avatar {
          font-size: 3rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .team-card__content {
          padding: 24px;
        }

        .team-card__content h3 {
          font-family: var(--font-display);
          font-size: 1.4rem;
          margin: 0 0 8px 0;
          color: var(--color-text);
        }

        .team-card__role {
          font-size: 1rem;
          color: var(--color-primary);
          margin: 0 0 4px 0;
          font-weight: 600;
        }

        .team-card__subjects {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin: 0 0 16px 0;
        }

        .team-card__contributions {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--color-border);
        }

        .team-card__contributions h4 {
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin: 0 0 12px 0;
          letter-spacing: 0.05em;
        }

        .team-card__contributions ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .team-card__contributions li {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          padding-left: 16px;
          position: relative;
        }

        .team-card__contributions li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--color-accent);
          font-weight: bold;
        }

        /* Tech grid */
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .tech-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 20px;
          border-radius: var(--radius-md);
          text-align: center;
          transition: all 0.3s ease;
        }

        .tech-card:hover {
          border-color: var(--color-primary);
          background: var(--color-surface-2);
          transform: translateY(-4px);
        }

        .tech-card h4 {
          margin: 0 0 8px 0;
          color: var(--color-text);
          font-size: 1.1rem;
        }

        .tech-version {
          font-size: 0.9rem;
          color: var(--color-primary);
          margin: 0;
          font-weight: 600;
        }

        .tech-category {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin: 8px 0 0 0;
        }

        /* Architecture */
        .architecture {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin: 40px 0;
        }

        .architecture-layer {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 24px;
          border-radius: var(--radius-md);
        }

        .architecture-layer:first-child {
          border-bottom: none;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          background: linear-gradient(135deg, rgba(108, 99, 255, 0.05), rgba(0, 217, 166, 0.05));
        }

        .architecture-layer:last-child {
          border-top: none;
          border-radius: 0 0 var(--radius-md) var(--radius-md);
          background: linear-gradient(135deg, rgba(255, 77, 109, 0.05), rgba(255, 209, 102, 0.05));
        }

        .layer-content h3 {
          margin: 0 0 8px 0;
          color: var(--color-text);
          font-size: 1.2rem;
        }

        .layer-content > p {
          margin: 0 0 12px 0;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .layer-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }

        .layer-content li {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          padding-left: 16px;
          position: relative;
        }

        .layer-content li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--color-primary);
        }

        .architecture-arrow {
          text-align: center;
          padding: 12px 0;
          color: var(--color-primary);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .ci-cd-section {
          margin-top: 40px;
          padding: 24px;
          background: var(--color-surface-2);
          border-radius: var(--radius-md);
        }

        .ci-cd-section h3 {
          margin: 0 0 16px 0;
          color: var(--color-text);
        }

        .ci-cd-flow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          overflow-x: auto;
        }

        .ci-cd-flow span {
          padding: 8px 12px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          white-space: nowrap;
          color: var(--color-text);
        }

        .ci-cd-flow span:nth-child(even) {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: 600;
        }

        .ci-cd-flow span:last-child {
          background: rgba(6, 214, 160, 0.1);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* Design grid */
        .design-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-top: 40px;
        }

        .design-item {
          background: var(--color-surface);
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }

        .design-item h4 {
          margin: 0 0 16px 0;
          color: var(--color-text);
          font-size: 1.1rem;
        }

        .color-palette {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-swatch {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-swatch:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .design-item ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .design-item li {
          color: var(--color-text-muted);
          padding-left: 16px;
          position: relative;
        }

        .design-item li:before {
          content: '●';
          position: absolute;
          left: 0;
          color: var(--color-accent);
        }

        /* Demo credentials */
        .demo-credentials {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 40px 0;
        }

        .credential-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          padding: 24px;
          border-radius: var(--radius-md);
          transition: all 0.3s ease;
        }

        .credential-card:hover {
          border-color: var(--color-primary);
          box-shadow: 0 8px 24px rgba(108, 99, 255, 0.15);
        }

        .credential-card h4 {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          color: var(--color-text);
        }

        .credential-field {
          margin: 8px 0;
          font-size: 0.9rem;
        }

        .credential-field strong {
          color: var(--color-text-muted);
          display: inline-block;
          min-width: 80px;
        }

        .credential-field code {
          background: var(--color-surface-2);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          color: var(--color-primary);
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
        }

        .credential-note {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
          color: var(--color-accent);
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* CTA sections */
        .get-started-cta {
          margin-top: 40px;
          text-align: center;
          padding: 40px;
          background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(0, 217, 166, 0.05));
          border-radius: var(--radius-lg);
        }

        .get-started-cta h3 {
          font-size: 1.8rem;
          margin: 0 0 12px 0;
          color: var(--color-text);
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .about-cta {
          text-align: center;
          padding: 60px 40px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          background-clip: padding-box;
          border-radius: var(--radius-lg);
        }

        .about-cta h2 {
          margin: 0 0 12px 0;
          font-size: 2rem;
          color: white;
          font-family: var(--font-display);
        }

        .about-cta p {
          margin: 0 0 24px 0;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .about-hero__title { font-size: 2.2rem; }
          .about-section__title { font-size: 1.8rem; }
          .about-grid-2 { grid-template-columns: 1fr; gap: 32px; }
          .about-highlights { flex-direction: column; gap: 16px; }
          .team-grid { grid-template-columns: 1fr; }
          .tech-grid { grid-template-columns: repeat(2, 1fr); }
          .design-grid { grid-template-columns: 1fr; }
          .demo-credentials { grid-template-columns: 1fr; }
          .cta-buttons { flex-direction: column; }
          .cta-buttons a { width: 100%; }
          .ci-cd-flow { gap: 4px; }
          .ci-cd-flow span { padding: 6px 10px; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;