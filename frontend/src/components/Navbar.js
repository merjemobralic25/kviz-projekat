import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("!!! KLIKNUTO NA ODJAVU USPJEŠNO !!!");
    
    try {
      localStorage.removeItem('currentUser');
      localStorage.clear();
      if (typeof logout === 'function') {
        logout();
      }
    } catch (err) {
      console.log("Greška u kontekstu, ignorišemo:", err);
    }

    toast.success('Uspješno ste se odjavili. 👋');
    setProfileDropdown(false);
    setMenuOpen(false);
    
    // Grubo preusmjeravanje
    window.location.href = '/';
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
                    ⚙️ Admin
                  </Link>
                )}
                
                {/* Dropdown profila */}
                <div className="navbar__profile-dropdown">
                  <button 
                    className="navbar__avatar"
                    title={user.name}
                    onClick={() => setProfileDropdown(!profileDropdown)}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  
                  {profileDropdown && (
                    <div className="profile-dropdown-menu" style={{ zIndex: 99999 }}>
                      <div className="profile-dropdown-header">
                        <div className="profile-dropdown-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-dropdown-info">
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                          {isAdmin && <span className="badge badge-sm badge-primary">Admin</span>}
                        </div>
                      </div>
                      <div className="profile-dropdown-divider" />
                      
                      {/* PROMIJENJENO: onClick na onMouseDown da preduhitrimo gubljenje fokusa */}
                      <button 
                        className="profile-dropdown-item logout"
                        onMouseDown={(e) => handleLogout(e)}
                        type="button"
                        style={{ cursor: 'pointer', position: 'relative', zIndex: 999999 }}
                      >
                        <span>🚪</span>
                        Odjava
                      </button>
                    </div>
                  )}
                </div>
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
            type="button"
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
              <div className="mobile-menu__user-info">
                <div className="mobile-menu__avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
              </div>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                  ⚙️ Admin Panel
                </Link>
              )}
              <button 
                onClick={(e) => handleLogout(e)} 
                className="btn btn-ghost" 
                style={{ width: '100%' }}
                type="button"
              >
                🚪 Odjava
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

      {/* UKLONJEN KLASIČNI BACKDROP KOJI JE BLOKIRAO KLIK */}

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
          text-decoration: none;
          color: var(--color-text);
        }
        .navbar__logo span { color: var(--color-primary); }
        .navbar__logo-icon { font-size: 1.2rem; }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 4px;
          flex: 1;
          justify-content: center;
          margin: 0;
          padding: 0;
        }
        .navbar__link {
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          color: var(--color-text-muted);
          transition: all var(--transition-base);
          font-weight: 500;
          text-decoration: none;
          display: block;
        }
        .navbar__link:hover, .navbar__link.active {
          color: var(--color-text);
          background: var(--color-border);
        }
        .navbar__link.active { 
          color: var(--color-primary); 
          background: rgba(108, 99, 255, 0.1);
        }
        .navbar__actions { 
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar__user { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
        }
        .navbar__auth { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
        }

        /* Profile Dropdown */
        .navbar__profile-dropdown {
          position: relative;
        }
        .navbar__avatar {
          width: 40px; 
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: 700; 
          font-size: 0.95rem;
          color: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 16px rgba(108, 99, 255, 0.3);
          transition: all 0.3s ease;
        }
        .navbar__avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 0 24px rgba(108, 99, 255, 0.5);
        }

        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          min-width: 280px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
        }

        .profile-dropdown-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          color: white;
          flex-shrink: 0;
        }

        .profile-dropdown-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .profile-dropdown-info strong {
          font-size: 0.95rem;
          color: var(--color-text);
        }

        .profile-dropdown-info small {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .badge-sm { padding: 2px 6px; font-size: 0.65rem; }
        .badge-primary { background: rgba(108, 99, 255, 0.2); color: var(--color-primary); }
        .profile-dropdown-divider { height: 1px; background: var(--color-border); }

        .profile-dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: none;
          border: none;
          color: var(--color-text);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .profile-dropdown-item:hover {
          background: var(--color-surface-2);
          color: var(--color-primary);
        }

        .profile-dropdown-item.logout { color: var(--color-danger); }
        .profile-dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-danger);
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
          overflow-y: auto;
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
          text-decoration: none;
          display: block;
        }
        .mobile-menu__link:hover, .mobile-menu__link.active {
          color: var(--color-primary);
          background: rgba(108, 99, 255, 0.1);
        }
        .mobile-menu__divider { height: 1px; background: var(--color-border); margin: 12px 0; }
        
        .mobile-menu__user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--color-surface-2);
          border-radius: var(--radius-md);
          margin-bottom: 12px;
        }

        .mobile-menu__avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700; font-size: 0.9rem;
          color: white; flex-shrink: 0;
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