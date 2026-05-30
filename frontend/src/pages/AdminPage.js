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
           {form.questions.map((q, i) => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ flex: 1, color: 'var(--color-text)' }}>{q.text}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>✓ {q.options[q.correct]}</span>
                <button type="button" className="btn btn-sm btn-danger" style={{ padding: '4px 10px' }} onClick={() => removeQ(i)}>✕</button>
              </div>
            ))}
            {!form.questions.length && <p style={{ textAlign: 'center', padding: '16px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Nema pitanja. Dodajte ispod.</p>}
          </div>
          <div style={{ padding: 14, background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>+ Novo pitanje</p>
            <input className="form-input" placeholder="Tekst pitanja..." value={newQ.text} onChange={e => setNewQ(q => ({ ...q, text: e.target.value }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {newQ.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                  <input className="form-input" style={{ fontSize: '0.85rem', padding: '8px 12px' }} placeholder={`Odgovor ${String.fromCharCode(65 + i)}...`} value={opt}
                    onChange={e => { const opts = [...newQ.options]; opts[i] = e.target.value; setNewQ(q => ({ ...q, options: opts })); }} />
                  <input type="radio" name="correct" checked={newQ.correct === i} onChange={() => setNewQ(q => ({ ...q, correct: i }))} title="Tačan" style={{ cursor: 'pointer', width: 16, height: 16 }} />
                </div>
              ))}
            </div>
            {qErr && <span className="form-error">⚠ {qErr}</span>}
            <button type="button" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }} onClick={addQ}>Dodaj pitanje</button>
          </div>
        </div>
      </div>
      <ModalFooter onCancel={onClose} onSave={handleSave} loading={loading} label="💾 Sačuvaj kviz" />
    </Modal>
  );
};
 
const AdminQuizzes = () => {
  const { data: quizzes, loading, refetch } = useFetch('/quizzes');
  const { user } = useAuth();
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
 
  const handleSave = async (data) => {
    try {
      if (data.id) { await api.put(`/quizzes/${data.id}`, data); toast.success('Kviz ažuriran! ✏️'); }
      else { await api.post('/quizzes', { ...data, createdAt: new Date().toISOString(), createdBy: user.id }); toast.success('Kviz kreiran! 🎉'); }
      refetch(); setModal(null);
    } catch { toast.error('Greška pri čuvanju.'); }
  };
 
  const handleDelete = async (id) => {
    try { await api.delete(`/quizzes/${id}`); toast.success('Kviz obrisan.'); refetch(); }
    catch { toast.error('Greška pri brisanju.'); }
    setConfirm(null);
  };
 
  return (
    <div className="adm-section animate-fade-in">
      <div className="adm-top">
        <h2 className="adm-title">Kvizovi</h2>
        <button className="btn btn-primary" onClick={() => setModal({ quiz: EMPTY_Q })}>+ Novi kviz</button>
      </div>
      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Naziv</th><th>Kategorija</th><th>Težina</th><th>Pitanja</th><th>Limit</th><th>Akcije</th></tr></thead>
            <tbody>
              {(quizzes || []).map(q => (
                <tr key={q.id}>
                  <td><strong style={{ color: 'var(--color-text)' }}>{q.title}</strong></td>
                  <td><span className="badge badge-accent">{q.category}</span></td>
                  <td><span className={`badge ${q.difficulty === 'Lako' ? 'badge-success' : q.difficulty === 'Teško' ? 'badge-danger' : 'badge-warning'}`}>{q.difficulty}</span></td>
                  <td>{q.questions?.length || 0}</td>
                  <td>{Math.floor(q.timeLimit / 60)}min</td>
                  <td><div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-outline" onClick={() => setModal({ quiz: q })}>✏️ Uredi</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setConfirm({ id: q.id, name: q.title })}>🗑️</button>
                  </div></td>
                </tr>
              ))}
              {!quizzes?.length && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>Nema kvizova</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal && <QuizModal initial={modal.quiz} onSave={handleSave} onClose={() => setModal(null)} />}
      {confirm && <Confirm msg={`Sigurno obrisati kviz "${confirm.name}"?`} onOk={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
};
 
/* ══════════════════════════════════════════
   USERS
══════════════════════════════════════════ */
const AdminUsers = () => {
  const { data: users, loading, refetch } = useFetch('/users');
  const { user: me } = useAuth();
  const [confirm, setConfirm] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
 
  const handleDelete = async (id) => {
    if (id === me.id) { toast.error('Ne možete obrisati vlastiti nalog!'); setConfirm(null); return; }
    try { await api.delete(`/users/${id}`); toast.success('Korisnik obrisan.'); refetch(); }
    catch { toast.error('Greška.'); }
    setConfirm(null);
  };
 
  const handleSaveEdit = async () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) { toast.error('Ime i email su obavezni.'); return; }
    setSaving(true);
    try { await api.patch(`/users/${editModal.id}`, { name: editForm.name, email: editForm.email, role: editForm.role }); toast.success('Korisnik ažuriran!'); refetch(); setEditModal(null); }
    catch { toast.error('Greška.'); }
    finally { setSaving(false); }
  };
 
  return (
    <div className="adm-section animate-fade-in">
      <div className="adm-top">
        <h2 className="adm-title">Korisnici</h2>
        <span className="badge badge-primary">{users?.length || 0} ukupno</span>
      </div>
      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Ime</th><th>Email</th><th>Uloga</th><th>Kreiran</th><th>Akcije</th></tr></thead>
            <tbody>
              {(users || []).map(u => (
                <tr key={u.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: u.role === 'admin' ? 'var(--color-primary)' : 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{u.name.charAt(0).toUpperCase()}</div>
                    <strong style={{ color: 'var(--color-text)' }}>{u.name}</strong>
                    {u.id === me.id && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Vi</span>}
                  </div></td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-accent'}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString('bs-BA')}</td>
                  <td><div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-outline" onClick={() => { setEditForm({ name: u.name, email: u.email, role: u.role }); setEditModal(u); }}>✏️ Uredi</button>
                    {u.id !== me.id && <button className="btn btn-sm btn-danger" onClick={() => setConfirm({ id: u.id, name: u.name })}>🗑️</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editModal && (
        <Modal title="Uredi korisnika" onClose={() => setEditModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group"><label className="form-label">Ime</label><input className="form-input" value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Uloga</label>
              <select className="form-input" value={editForm.role || 'guest'} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                <option value="guest">guest</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
          <ModalFooter onCancel={() => setEditModal(null)} onSave={handleSaveEdit} loading={saving} />
        </Modal>
      )}
      {confirm && <Confirm msg={`Obrisati korisnika "${confirm.name}"?`} onOk={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />}
    </div>
  );
};
 
/* ══════════════════════════════════════════
   RESULTS
══════════════════════════════════════════ */
const AdminResults = () => {
  const { data: results, loading, refetch } = useFetch('/results');
  const { data: users } = useFetch('/users');
  const { data: quizzes } = useFetch('/quizzes');
  const [confirm, setConfirm] = useState(null);
  const getName = useCallback((uid) => users?.find(u => u.id === uid)?.name || `User #${uid}`, [users]);
  const getQuiz = useCallback((qid) => quizzes?.find(q => q.id === qid)?.title || `Quiz #${qid}`, [quizzes]);
 
  const handleDelete = async (id) => {
    try { await api.delete(`/results/${id}`); toast.success('Rezultat obrisan.'); refetch(); }
    catch { toast.error('Greška.'); }
    setConfirm(null);
  };
 