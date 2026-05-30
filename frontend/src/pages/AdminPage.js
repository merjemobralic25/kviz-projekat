import React, { useState, useCallback } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFetch, api } from '../hooks/useFetch';
import toast from 'react-hot-toast';
 
/* ── Confirm dialog ── */
const Confirm = ({ msg, onOk, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content" style={{ maxWidth: 380, textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
      <h3 style={{ marginBottom: 12 }}>Potvrda brisanja</h3>
      <p style={{ marginBottom: 28 }}>{msg}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={onCancel}>Odustani</button>
        <button className="btn btn-danger" onClick={onOk}>Obriši</button>
      </div>
    </div>
  </div>
);
 
/* ── Modal shell ── */
const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-overlay">
    <div className="modal-content" style={{ maxWidth: wide ? 680 : 520 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);
 
const ModalFooter = ({ onCancel, onSave, loading, label = '💾 Sačuvaj' }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
    <button className="btn btn-ghost" onClick={onCancel}>Odustani</button>
    <button className="btn btn-primary" onClick={onSave} disabled={loading}>
      {loading ? <><span className="spinner spinner-sm" /> Čuvanje...</> : label}
    </button>
  </div>
);
 
/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
const Dashboard = () => {
  const { data: quizzes } = useFetch('/quizzes');
  const { data: users } = useFetch('/users');
  const { data: results } = useFetch('/results');
  const { data: contacts } = useFetch('/contacts');
 
  const avg = results?.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  const stats = [
    { icon: '🧩', label: 'Kvizovi', val: quizzes?.length ?? '—', color: 'var(--color-primary)' },
    { icon: '👥', label: 'Korisnici', val: users?.length ?? '—', color: 'var(--color-accent)' },
    { icon: '📊', label: 'Rezultati', val: results?.length ?? '—', color: 'var(--color-warning)' },
    { icon: '📩', label: 'Poruke', val: contacts?.length ?? '—', color: 'var(--color-danger)' },
  ];
 
  return (
    <div className="adm-section animate-fade-in">
      <h2 className="adm-title">Pregled sistema</h2>
      <div className="dash-grid">
        {stats.map(s => (
          <div key={s.label} className="dash-card">
            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 10 }}>{s.icon}</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.val}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
        <div className="dash-info">
          <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>📈 Prosječan rezultat</h4>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: avg >= 60 ? 'var(--color-accent)' : 'var(--color-danger)', marginBottom: 12 }}>{avg}%</div>
          <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${avg}%`, height: '100%', background: avg >= 60 ? 'var(--color-accent)' : 'var(--color-danger)', borderRadius: 3, transition: 'width 1s ease' }} />
          </div>
        </div>
        <div className="dash-info">
          <h4 style={{ marginBottom: 16, fontSize: '1rem' }}>🏆 Nedavni rezultati</h4>
          {results?.slice(-4).reverse().map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span>Korisnik #{r.userId}</span>
              <strong style={{ color: r.percentage >= 60 ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.percentage}%</strong>
            </div>
          ))}
          {(!results || !results.length) && <p style={{ fontSize: '0.85rem' }}>Nema rezultata</p>}
        </div>
      </div>
    </div>
  );
};
 
/* ══════════════════════════════════════════
   QUIZZES
══════════════════════════════════════════ */
const CATS = ['Opće znanje', 'Nauka', 'Geografija', 'Sport', 'Muzika', 'Film'];
const DIFFS = ['Lako', 'Srednje', 'Teško'];
const EMPTY_Q = { title: '', description: '', category: 'Opće znanje', difficulty: 'Srednje', timeLimit: 300, questions: [] };
 
const QuizModal = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState({ ...EMPTY_Q, ...initial });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);
  const [newQ, setNewQ] = useState({ text: '', options: ['', '', '', ''], correct: 0 });
  const [qErr, setQErr] = useState('');
 
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
 
  const addQ = () => {
    if (!newQ.text.trim()) { setQErr('Tekst pitanja je obavezan.'); return; }
    if (newQ.options.some(o => !o.trim())) { setQErr('Svi odgovori moraju biti popunjeni.'); return; }
    setQErr('');
    setForm(f => ({ ...f, questions: [...f.questions, { ...newQ, id: `q${Date.now()}` }] }));
    setNewQ({ text: '', options: ['', '', '', ''], correct: 0 });
  };
 
  const removeQ = (i) => setForm(f => ({ ...f, questions: f.questions.filter((_, j) => j !== i) }));
 
  const handleSave = async () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Naziv je obavezan.';
    if (!form.description.trim()) e.description = 'Opis je obavezan.';
    if (Number(form.timeLimit) < 30) e.timeLimit = 'Min. 30s.';
    if (Object.keys(e).length) { setErrs(e); return; }
    setLoading(true);
    try { await onSave({ ...form, timeLimit: Number(form.timeLimit) }); }
    finally { setLoading(false); }
  };
 
  return (
    <Modal title={form.id ? 'Uredi kviz' : 'Novi kviz'} onClose={onClose} wide>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Naziv *</label>
            <input className={`form-input${errs.title ? ' error' : ''}`} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Naziv kviza..." />
            {errs.title && <span className="form-error">⚠ {errs.title}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Vremenski limit (s) *</label>
            <input className={`form-input${errs.timeLimit ? ' error' : ''}`} type="number" min={30} value={form.timeLimit} onChange={e => set('timeLimit', e.target.value)} />
            {errs.timeLimit && <span className="form-error">⚠ {errs.timeLimit}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Kategorija</label>
            <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Težina</label>
            <select className="form-input" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
              {DIFFS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Opis *</label>
          <textarea className={`form-input${errs.description ? ' error' : ''}`} value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Kratki opis..." />
          {errs.description && <span className="form-error">⚠ {errs.description}</span>}
        </div>
 
        {/* Questions */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem', fontWeight: 600 }}>
            Pitanja ({form.questions.length})
          </div>
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}></div>