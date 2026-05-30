import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateLogin } from '../utils/validators';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' }, validateLogin
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Dobrodošli nazad! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Greška pri prijavi.');
    } finally { setLoading(false); }
  };

  const fillDemo = (email, pw) => {
    handleChange({ target: { name: 'email', value: email } });
    handleChange({ target: { name: 'password', value: pw } });
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-glow auth-glow--1" />
      <div className="auth-glow auth-glow--2" />
      <div className="auth-box animate-scale-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡ QuizMaster</Link>
          <h1>Dobrodošli nazad</h1>
          <p>Prijavite se na vaš nalog</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Email adresa</label>
            <input id="login-email" name="email" type="email" className={`form-input${touched.email && errors.email ? ' error' : ''}`}
              placeholder="vas@email.com" value={values.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
            {touched.email && errors.email && <span className="form-error">⚠ {errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Lozinka</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPw ? 'text' : 'password'} className={`form-input${touched.password && errors.password ? ' error' : ''}`}
                placeholder="Vaša lozinka" value={values.password} onChange={handleChange} onBlur={handleBlur} autoComplete="current-password" style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.7 }}>{showPw ? '🙈' : '👁️'}</button>
            </div>
            {touched.password && errors.password && <span className="form-error">⚠ {errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Prijava...</> : 'Prijavi se'}
          </button>
        </form>

        <div className="auth-divider"><span>demo nalozi</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="demo-btn" onClick={() => fillDemo('admin@quiz.com', 'admin123')}>
            <span>👑</span><div><strong>Admin</strong><small>admin@quiz.com</small></div>
          </button>
          <button className="demo-btn" onClick={() => fillDemo('user@quiz.com', 'user123')}>
            <span>👤</span><div><strong>Guest</strong><small>user@quiz.com</small></div>
          </button>
        </div>

        <p className="auth-footer-link">Nemate nalog? <Link to="/register">Registrujte se</Link></p>
      </div>
      <style>{`
        .auth-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 100px var(--space-lg) 40px; position: relative; overflow: hidden; }
        .auth-glow { position: absolute; border-radius: 50%; pointer-events: none; }
        .auth-glow--1 { top: -200px; left: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 65%); }
        .auth-glow--2 { bottom: -150px; right: -150px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,217,166,0.08) 0%, transparent 65%); }
        .auth-box { width: 100%; max-width: 440px; background: var(--color-surface); border: 1px solid var(--color-border-hover); border-radius: var(--radius-xl); padding: 48px 40px; position: relative; z-index: 1; }
        .auth-header { text-align: center; margin-bottom: 36px; }
        .auth-logo { font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: var(--color-primary); display: block; margin-bottom: 24px; }
        .auth-header h1 { font-size: 1.8rem; margin-bottom: 8px; }
        .auth-divider { display: flex; align-items: center; gap: 16px; margin: 24px 0; color: var(--color-text-dim); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
        .demo-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-base); font-family: var(--font-body); }
        .demo-btn:hover { border-color: var(--color-primary); background: var(--color-primary-glow); }
        .demo-btn span { font-size: 1.4rem; }
        .demo-btn div { display: flex; flex-direction: column; gap: 2px; text-align: left; }
        .demo-btn strong { font-size: 0.85rem; color: var(--color-text); }
        .demo-btn small { font-size: 0.72rem; color: var(--color-text-muted); }
        .auth-footer-link { text-align: center; margin-top: 24px; font-size: 0.875rem; color: var(--color-text-muted); }
        .auth-footer-link a { color: var(--color-primary); font-weight: 500; }
        .auth-footer-link a:hover { text-decoration: underline; }
        @media (max-width: 480px) { .auth-box { padding: 32px 24px; } }
      `}</style>
    </div>
  );
};

export default LoginPage;