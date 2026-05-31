import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Uspješno ste se odjavili.');
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Početna' },
    { to: '/quizzes', label: 'Kvizovi' },
    { to: '/leaderboard', label: 'Rang lista' },
    { to: '/about', label: 'O nama' },
    { to: '/contact', label: 'Kontakt' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">⚡</span>
            Quiz<span>Master</span>
          </Link>

          <ul className="navbar__links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            {user ? (
              <div className="navbar__user">
                {isAdmin && (
                  <Link to="/admin" className="btn btn-sm btn-outline">
                    Admin Panel
                  </Link>
                )}
                <div className="navbar__avatar" title={user.name}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="btn btn-sm btn-ghost">
                  Odjava
                </button>
              </div>
            ) : (
              <div className="navbar__auth">
                <Link to="/login" className="btn btn-sm btn-ghost">Prijava</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Registracija</Link>
              </div>
            )}
          </div>

          <button
            className={`navbar__burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu__inner">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `mobile-menu__link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="mobile-menu__divider" />
          {user ? (
            <>
              <span className="mobile-menu__username">👤 {user.name}</span>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%' }}>
                Odjava
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                Prijava
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                Registracija
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 16px 0;
          transition: all 0.3s ease;
        }
        .navbar--scrolled {
          background: rgba(10, 10, 20, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
          padding: 12px 0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .navbar__logo {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .navbar__logo span { color: var(--color-primary); }
        .navbar__logo-icon { font-size: 1.2rem; }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }
        .navbar__link {
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          color: var(--color-text-muted);
          transition: all var(--transition-base);
          font-weight: 500;
        }
        .navbar__link:hover, .navbar__link.active {
          color: var(--color-text);
          background: var(--color-border);
        }
        .navbar__link.active { color: var(--color-primary); }
        .navbar__actions { margin-left: auto; }
        .navbar__user { display: flex; align-items: center; gap: 10px; }
        .navbar__auth { display: flex; align-items: center; gap: 8px; }
        .navbar__avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 0 0 12px var(--color-primary-glow);
        }
        .navbar__burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          margin-left: auto;
        }
        .navbar__burger span {
          display: block;
          width: 24px; height: 2px;
          background: var(--color-text);
          transition: all var(--transition-base);
          border-radius: 2px;
        }
        .navbar__burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .navbar__burger.open span:nth-child(2) { opacity: 0; }
        .navbar__burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: var(--color-bg);
          z-index: 99;
          padding-top: 80px;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu__inner {
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-menu__link {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--color-text-muted);
          transition: all var(--transition-base);
        }
        .mobile-menu__link:hover, .mobile-menu__link.active {
          color: var(--color-primary);
          background: var(--color-primary-glow);
        }
        .mobile-menu__divider {
          height: 1px;
          background: var(--color-border);
          margin: 12px 0;
        }
        .mobile-menu__username {
          padding: 0 16px;
          font-weight: 500;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .navbar__links, .navbar__actions { display: none; }
          .navbar__burger { display: flex; }
          .mobile-menu { display: block; }
        }
      `}</style>
    </>
  );
};

export default Navbar;