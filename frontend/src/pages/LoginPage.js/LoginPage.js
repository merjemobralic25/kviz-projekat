import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validateLogin } from '../../utils/validators';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    validateLogin
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Dobrodošli nazad! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Greška pri prijavi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-glow auth-glow--primary" />
      <div className="auth-glow auth-glow--accent" />
      <div className="auth-container animate-scale-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡ QuizMaster</Link>
          <h1>Dobrodošli nazad</h1>
          <p>Prijavite se na vaš nalog</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email adresa</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input${touched.email && errors.email ? ' error' : ''}`}
              placeholder="vas@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <span className="form-error">⚠ {errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Lozinka</label>
            <div className="input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input${touched.password && errors.password ? ' error' : ''}`}
                placeholder="Vaša lozinka"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
              />
              <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="form-error">⚠ {errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Prijava...</> : 'Prijavi se'}
          </button>
        </form>

        <div className="auth-divider"><span>ili</span></div>

        <div className="auth-demo">
          <p className="demo-title">Demo nalozi</p>
          <div className="demo-cards">
            <button className="demo-card" onClick={() => {
              document.getElementById('email').value = 'admin@quiz.com';
              document.getElementById('password').value = 'admin123';
              handleChange({ target: { name: 'email', value: 'admin@quiz.com' } });
              handleChange({ target: { name: 'password', value: 'admin123' } });
            }}>
              <span>👑</span>
              <div>
                <strong>Admin</strong>
                <small>admin@quiz.com</small>
              </div>
            </button>
            <button className="demo-card" onClick={() => {
              document.getElementById('email').value = 'user@quiz.com';
              document.getElementById('password').value = 'user123';
              handleChange({ target: { name: 'email', value: 'user@quiz.com' } });
              handleChange({ target: { name: 'password', value: 'user123' } });
            }}>
              <span>👤</span>
              <div>
                <strong>Guest</strong>
                <small>user@quiz.com</small>
              </div>
            </button>
          </div>
        </div>

        <p className="auth-footer-text">
          Nemate nalog?{' '}
          <Link to="/register">Registrujte se</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 100px var(--space-lg) 40px;
          position: relative;
          overflow: hidden;
        }
        .auth-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .auth-glow--primary {
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 65%);
        }
        .auth-glow--accent {
          bottom: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,217,166,0.08) 0%, transparent 65%);
        }
        .auth-container {
          width: 100%;
          max-width: 440px;
          background: var(--color-surface);
          border: 1px solid var(--color-border-hover);
          border-radius: var(--radius-xl);
          padding: 48px 40px;
          position: relative;
          z-index: 1;
        }
        .auth-header { text-align: center; margin-bottom: 36px; }
        .auth-logo {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
          display: block;
          margin-bottom: 24px;
          color: var(--color-primary);
        }
        .auth-header h1 { font-size: 1.8rem; margin-bottom: 8px; }
        .auth-header p { font-size: 0.9rem; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .input-wrapper { position: relative; }
        .input-wrapper .form-input { padding-right: 48px; }
        .input-toggle {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          opacity: 0.7;
          transition: opacity var(--transition-base);
          padding: 0;
        }
        .input-toggle:hover { opacity: 1; }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
          color: var(--color-text-dim);
          font-size: 0.8rem;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }
        .auth-demo {}
        .demo-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-dim);
          margin-bottom: 12px;
          text-align: center;
        }
        .demo-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .demo-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
          text-align: left;
          font-family: var(--font-body);
        }
        .demo-card:hover { border-color: var(--color-primary); background: var(--color-primary-glow); }
        .demo-card span { font-size: 1.4rem; }
        .demo-card div { display: flex; flex-direction: column; gap: 2px; }
        .demo-card strong { font-size: 0.85rem; color: var(--color-text); }
        .demo-card small { font-size: 0.72rem; color: var(--color-text-muted); }
        .auth-footer-text { text-align: center; margin-top: 24px; font-size: 0.875rem; color: var(--color-text-muted); }
        .auth-footer-text a { color: var(--color-primary); font-weight: 500; }
        .auth-footer-text a:hover { text-decoration: underline; }
        @media (max-width: 480px) {
          .auth-container { padding: 32px 24px; }
          .demo-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;