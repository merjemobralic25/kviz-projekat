import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email je obavezan.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Unesite validan email.';
    }
    if (!password.trim()) {
      newErrors.password = 'Lozinka je obavezna.';
    } else if (password.length < 3) {
      newErrors.password = 'Lozinka mora biti bar 3 karaktera.';
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`🎉 Dobrodošli, ${user.name}!`);

      // Preusmjeravање baziranog na ulozi
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login greška:', error);
      toast.error(error.message || '❌ Pogrešna email adresa ili lozinka!');
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = (e) => {
    e.preventDefault();
    setEmail('admin@quiz.com');
    
    setErrors({});
  };
const fillGuest = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    
    try {
      // Automatski šaljemo demo podatke direktno u login funkciju
      const user = await login('user@quiz.com', 'user123');
      toast.success(`🎉 Dobrodošli, ${user.name}!`);
      
      // Preusmjeravanje na početnu stranicu
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Guest login greška:', error);
      toast.error('Učitavanje demo naloga nije uspjelo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-wrapper login-page"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px var(--space-lg)',
      }}
    >
      <div
        className="card login-card"
        style={{
          maxWidth: 450,
          width: '100%',
          padding: 40,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚡</div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text)', margin: '0 0 8px 0' }}>
            Prijava na profil
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Unesite kredencijale vašeg naloga
          </p>
        </div>

        {errors.form && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              marginBottom: 20,
              fontSize: '0.85rem',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>⚠️</span>
            {errors.form}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <div className="form-group">
            <label className="form-label">Email adresa</label>
            <input
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              placeholder="admin@quiz.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Lozinka</label>
            <input
              type="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              autoComplete="current-password"
              disabled={loading}
            />
            {errors.password && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm" />
                Prijava u toku...
              </>
            ) : (
              '✓ Prijavi se'
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
          }}
        >
          Nemate profil?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            Kreirajte ga ovdje
          </Link>
        </p>

        {/* Demo nalozi */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-text-dim)',
              marginBottom: 12,
              textAlign: 'center',
              margin: '0 0 12px 0',
            }}
          >
            📝 Demo nalozi
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm demo-btn"
              onClick={fillAdmin}
              disabled={loading}
            >
              <strong>👨‍💼 Admin</strong>
              <small>admin@quiz.com</small>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm demo-btn"
              onClick={fillGuest}
              disabled={loading}
            >
              <strong>👤 Korisnik</strong>
              <small>user@quiz.com</small>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          background: linear-gradient(135deg, rgba(108, 99, 255, 0.05), rgba(0, 217, 166, 0.05));
        }

        .login-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .form-input {
          padding: 11px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          color: var(--color-text);
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: var(--color-primary);
          background: var(--color-surface);
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
        }

        .form-input.error {
          border-color: var(--color-danger);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-lg {
          padding: 12px 24px;
          font-size: 1rem;
          border-radius: var(--radius-md);
        }

        .demo-btn {
          flex-direction: column;
          gap: 4px;
          height: auto;
          padding: 12px 10px;
          transition: all 0.2s ease;
        }

        .demo-btn small {
          opacity: 0.7;
          font-size: 0.7rem;
          font-weight: 400;
        }

        .demo-btn:hover:not(:disabled) {
          background: var(--color-surface-2);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .demo-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spinner-sm {
          margin-right: 4px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;