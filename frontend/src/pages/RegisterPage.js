import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateRegister } from '../utils/validators';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' }, validateRegister
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await register(data.name, data.email, data.password);
      toast.success('Nalog je kreiran! Dobrodošli! 🎉');
      navigate('/quizzes');
    } catch (err) {
      toast.error(err.message || 'Greška pri registraciji.');
    } finally { setLoading(false); }
  };

  const getStrength = (pw) => {
    if (!pw) return { w: 0, label: '', color: '' };
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return { w: 20, label: 'Slaba', color: 'var(--color-danger)' };
    if (s <= 2) return { w: 50, label: 'Srednja', color: 'var(--color-warning)' };
    if (s <= 3) return { w: 75, label: 'Dobra', color: 'var(--color-accent)' };
    return { w: 100, label: 'Jaka', color: 'var(--color-success)' };
  };
  const strength = getStrength(values.password);

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-glow auth-glow--1" />
      <div className="auth-glow auth-glow--2" />
      <div className="auth-box animate-scale-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">⚡ QuizMaster</Link>
          <h1>Kreirajte nalog</h1>
          <p>Pridružite se hiljadama kvizera</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Puno ime</label>
            <input name="name" type="text" className={`form-input${touched.name && errors.name ? ' error' : ''}`}
              placeholder="Vaše puno ime" value={values.name} onChange={handleChange} onBlur={handleBlur} autoComplete="name" />
            {touched.name && errors.name && <span className="form-error">⚠ {errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email adresa</label>
            <input name="email" type="email" className={`form-input${touched.email && errors.email ? ' error' : ''}`}
              placeholder="vas@email.com" value={values.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
            {touched.email && errors.email && <span className="form-error">⚠ {errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Lozinka</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPw ? 'text' : 'password'} className={`form-input${touched.password && errors.password ? ' error' : ''}`}
                placeholder="Min. 6 karaktera" value={values.password} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" style={{ paddingRight: 48 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.7 }}>{showPw ? '🙈' : '👁️'}</button>
            </div>
            {values.password && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <div style={{ flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${strength.w}%`, height: '100%', background: strength.color, transition: 'all 0.4s ease', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: strength.color, minWidth: 48 }}>{strength.label}</span>
              </div>
            )}
            {touched.password && errors.password && <span className="form-error">⚠ {errors.password}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Potvrdite lozinku</label>
            <input name="confirmPassword" type={showPw ? 'text' : 'password'} className={`form-input${touched.confirmPassword && errors.confirmPassword ? ' error' : ''}`}
              placeholder="Ponovite lozinku" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" />
            {touched.confirmPassword && errors.confirmPassword && <span className="form-error">⚠ {errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? <><span className="spinner spinner-sm" /> Kreiranje...</> : 'Kreiraj nalog'}
          </button>
        </form>
        <p className="auth-footer-link">Već imate nalog? <Link to="/login">Prijavite se</Link></p>
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
        .auth-footer-link { text-align: center; margin-top: 24px; font-size: 0.875rem; color: var(--color-text-muted); }
        .auth-footer-link a { color: var(--color-primary); font-weight: 500; }
        .auth-footer-link a:hover { text-decoration: underline; }
        @media (max-width: 480px) { .auth-box { padding: 32px 24px; } }
      `}</style>
    </div>
  );
};

export default RegisterPage;