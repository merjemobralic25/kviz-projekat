import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Dinamički API URL
 */
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (window.location.hostname.includes('.github.dev') || window.location.hostname.includes('preview.app.github.dev')) {
    const baseUrl = window.location.origin.replace(':3000', ':3005');
    return baseUrl;
  }
  return 'http://localhost:3005';
};

const API_URL = getApiUrl();

/**
 * useFetch hook
 */
const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Fetch greška: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(`Fetch error za ${endpoint}:`, err);
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [endpoint]);

  return { data, loading, error, refetch };
};

/**
 * api helper za POST, PUT, PATCH, DELETE
 */
const api = {
  post: async (endpoint, body) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST greška: ${res.status}`);
    return res.json();
  },

  put: async (endpoint, body) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT greška: ${res.status}`);
    return res.json();
  },

  patch: async (endpoint, body) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PATCH greška: ${res.status}`);
    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`DELETE greška: ${res.status}`);
    return res.json();
  },
};

/* ─────────────────────────────────────────
   DIALOG — Potvrda brisanja
───────────────────────────────────────────── */
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content" style={{ maxWidth: 380, textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚠️</div>
      <h3 style={{ marginBottom: 12 }}>Potvrda brisanja</h3>
      <p style={{ marginBottom: 28, color: 'var(--color-text-muted)' }}>{message}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={onCancel}>
          Odustani
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          Obriši
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MODAL — Forma
───────────────────────────────────────────── */
const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div
      className="modal-content"
      style={{ maxWidth: wide ? 700 : 520 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.3rem',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ModalFooter = ({ onCancel, onSave, loading, label = '💾 Sačuvaj' }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 24,
      paddingTop: 16,
      borderTop: '1px solid var(--color-border)',
    }}
  >
    <button className="btn btn-ghost" onClick={onCancel}>
      Odustani
    </button>
    <button className="btn btn-primary" onClick={onSave} disabled={loading}>
      {loading ? (
        <>
          <span className="spinner spinner-sm" />
          Čuvanje...
        </>
      ) : (
        label
      )}
    </button>
  </div>
);

/* ──────────────────────────────────────
   DASHBOARD
────────────────────────────────────────── */
const Dashboard = () => {
  const { data: quizzes } = useFetch('/quizzes');
  const { data: users } = useFetch('/users');
  const { data: results } = useFetch('/results');
  const { data: contacts } = useFetch('/contacts');

  const avg = results?.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;

  const stats = [
    {
      icon: '🧩',
      label: 'Kvizovi',
      value: quizzes?.length ?? 0,
      color: 'var(--color-primary)',
    },
    {
      icon: '👥',
      label: 'Korisnici',
      value: users?.length ?? 0,
      color: 'var(--color-accent)',
    },
    {
      icon: '📊',
      label: 'Rezultati',
      value: results?.length ?? 0,
      color: 'var(--color-warning)',
    },
    {
      icon: '📩',
      label: 'Poruke',
      value: contacts?.length ?? 0,
      color: 'var(--color-danger)',
    },
  ];

  return (
    <div className="adm-section animate-fade-in">
      <h2 className="adm-title">📊 Pregled sistema</h2>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: s.color, marginBottom: 8 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
        <div className="info-card">
          <h4 style={{ margin: '0 0 16px 0' }}>📈 Prosječan rezultat</h4>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 16 }}>
            {avg}%
          </div>
          <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${avg}%`,
                height: '100%',
                background: avg >= 60 ? 'var(--color-success)' : 'var(--color-danger)',
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        <div className="info-card">
          <h4 style={{ margin: '0 0 16px 0' }}>🏆 Nedavni rezultati</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results
              ?.slice(-4)
              .reverse()
              .map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 8,
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: 'var(--color-text-muted)' }}>Korisnik #{r.userId}</span>
                  <strong
                    style={{
                      color: r.percentage >= 60 ? 'var(--color-success)' : 'var(--color-danger)',
                    }}
                  >
                    {r.percentage}%
                  </strong>
                </div>
              ))}
            {!results?.length && (
              <p style={{ color: 'var(--color-text-muted)' }}>Nema rezultata</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   QUIZZES
────────────────────────────────────────── */
const CATEGORIES = ['Opće znanje', 'Nauka', 'Geografija', 'Sport', 'Muzika', 'Film'];
const DIFFICULTIES = ['Lako', 'Srednje', 'Teško'];

const QuizModal = ({ quiz, onSave, onClose }) => {
  const [form, setForm] = useState(
    quiz || {
      title: '',
      description: '',
      category: 'Opće znanje',
      difficulty: 'Srednje',
      timeLimit: 300,
      questions: [],
    }
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correct: 0,
  });

  const addQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast.error('Unesite tekst pitanja');
      return;
    }
    if (newQuestion.options.some((o) => !o.trim())) {
      toast.error('Svi odgovori moraju biti popunjeni');
      return;
    }

    setForm((f) => ({
      ...f,
      questions: [...f.questions, { ...newQuestion, id: `q${Date.now()}` }],
    }));
    setNewQuestion({ text: '', options: ['', '', '', ''], correct: 0 });
  };

  const removeQuestion = (index) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Naziv je obavezan';
    if (!form.description.trim()) newErrors.description = 'Opis je obavezan';
    if (Number(form.timeLimit) < 30) newErrors.timeLimit = 'Min. 30 sekundi';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...form,
        timeLimit: Number(form.timeLimit),
      };

      if (quiz?.id) {
        await api.put(`/quizzes/${quiz.id}`, data);
        toast.success('✏️ Kviz ažuriran');
      } else {
        await api.post('/quizzes', {
          ...data,
          createdAt: new Date().toISOString(),
        });
        toast.success('🎉 Kviz kreiran');
      }

      onSave();
    } catch (error) {
      toast.error('Greška pri čuvanju');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={quiz ? '✏️ Uredi kviz' : '➕ Novi kviz'} onClose={onClose} wide>
      <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
        {/* Osnovni podaci */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label className="form-label">Naziv *</label>
            <input
              className={`form-input${errors.title ? ' error' : ''}`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="npr. Opće znanje"
            />
            {errors.title && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.title}</span>}
          </div>

          <div>
            <label className="form-label">Vremenski limit (s) *</label>
            <input
              className={`form-input${errors.timeLimit ? ' error' : ''}`}
              type="number"
              min={30}
              value={form.timeLimit}
              onChange={(e) => setForm({ ...form, timeLimit: e.target.value })}
            />
            {errors.timeLimit && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.timeLimit}</span>}
          </div>

          <div>
            <label className="form-label">Kategorija</label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Težina</label>
            <select
              className="form-input"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opis */}
        <div style={{ marginBottom: 20 }}>
          <label className="form-label">Opis *</label>
          <textarea
            className={`form-input${errors.description ? ' error' : ''}`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Kratko objašnjenje kviza"
          />
          {errors.description && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.description}</span>}
        </div>

        {/* Pitanja */}
        <div
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--color-surface-2)',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            📋 Pitanja ({form.questions.length})
          </div>

          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.questions.map((q, i) => (
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ flex: 1 }}>{q.text}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>
                  ✓ {q.options[q.correct]}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeQuestion(i)}
                  style={{ padding: '4px 8px' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Dodaj novo pitanje */}
          <div style={{ padding: 16, background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 12, color: 'var(--color-primary)' }}>
              ➕ Novo pitanje
            </div>

            <input
              className="form-input"
              placeholder="Tekst pitanja..."
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              style={{ marginBottom: 12 }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {newQuestion.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    className="form-input"
                    placeholder={`Odgovor ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChange={(e) => {
                      const opts = [...newQuestion.options];
                      opts[i] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: opts });
                    }}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <input
                    type="radio"
                    name="correct"
                    checked={newQuestion.correct === i}
                    onChange={() => setNewQuestion({ ...newQuestion, correct: i })}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>

            <button className="btn btn-outline btn-sm" onClick={addQuestion}>
              Dodaj pitanje
            </button>
          </div>
        </div>
      </div>

      <ModalFooter onCancel={onClose} onSave={handleSave} loading={loading} label="💾 Sačuvaj kviz" />
    </Modal>
  );
};

const AdminQuizzes = () => {
  const { data: quizzes, loading, refetch } = useFetch('/quizzes');
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success('🗑️ Kviz obrisan');
      refetch();
    } catch (error) {
      toast.error('Greška pri brisanju');
      console.error(error);
    }
    setConfirm(null);
  };

  return (
    <div className="adm-section animate-fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2 className="adm-title">🧩 Kvizovi</h2>
        <button className="btn btn-primary" onClick={() => setModal({})}>
          ➕ Novi kviz
        </button>
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Kategorija</th>
                <th>Težina</th>
                <th>Pitanja</th>
                <th>Limit</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {(quizzes || []).map((q) => (
                <tr key={q.id}>
                  <td>
                    <strong>{q.title}</strong>
                  </td>
                  <td>
                    <span className="badge badge-accent">{q.category}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        q.difficulty === 'Lako'
                          ? 'badge-success'
                          : q.difficulty === 'Teško'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td>{q.questions?.length || 0}</td>
                  <td>{Math.floor(q.timeLimit / 60)} min</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setModal({ quiz: q })}
                      >
                        ✏️ Uredi
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirm({ id: q.id, name: q.title })}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!quizzes?.length && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
              Nema kreiranih kvizova
            </div>
          )}
        </div>
      )}

      {modal && (
        <QuizModal
          quiz={modal.quiz}
          onSave={() => {
            setModal(null);
            refetch();
          }}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={`Sigurno obrisati kviz "${confirm.name}"?`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

/* ──────────────────────────────────────
   USERS
────────────────────────────────────────── */
const AdminUsers = () => {
  const { data: users, loading, refetch } = useFetch('/users');
  const { user: me } = useAuth();
  const [confirm, setConfirm] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id) => {
    if (id === me.id) {
      toast.error('Ne možete obrisati vlastiti nalog!');
      setConfirm(null);
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      toast.success('👤 Korisnik obrisan');
      refetch();
    } catch (error) {
      toast.error('Greška pri brisanju');
      console.error(error);
    }
    setConfirm(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      toast.error('Ime i email su obavezni');
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/users/${editModal.id}`, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      });
      toast.success('✏️ Korisnik ažuriran');
      refetch();
      setEditModal(null);
    } catch (error) {
      toast.error('Greška pri ažuriranju');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adm-section animate-fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2 className="adm-title">👥 Korisnici</h2>
        <span className="badge badge-primary">{users?.length || 0} ukupno</span>
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ime</th>
                <th>Email</th>
                <th>Uloga</th>
                <th>Kreiran</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background:
                            u.role === 'admin' ? 'var(--color-primary)' : 'var(--color-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          flexShrink: 0,
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <strong>{u.name}</strong>
                      {u.id === me.id && (
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          Vi
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-accent'}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {new Date(u.createdAt).toLocaleDateString('bs-BA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => {
                          setEditForm({
                            name: u.name,
                            email: u.email,
                            role: u.role,
                          });
                          setEditModal(u);
                        }}
                      >
                        ✏️ Uredi
                      </button>
                      {u.id !== me.id && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setConfirm({ id: u.id, name: u.name })}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users?.length && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
              Nema korisnika
            </div>
          )}
        </div>
      )}

      {editModal && (
        <Modal title="✏️ Uredi korisnika" onClose={() => setEditModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">Ime</label>
              <input
                className="form-input"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Uloga</label>
              <select
                className="form-input"
                value={editForm.role || 'guest'}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <option value="guest">guest</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
          <ModalFooter onCancel={() => setEditModal(null)} onSave={handleSaveEdit} loading={saving} />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          message={`Obrisati korisnika "${confirm.name}"?`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

/* ──────────────────────────────────────
   RESULTS
────────────────────────────────────────── */
const AdminResults = () => {
  const { data: results, loading, refetch } = useFetch('/results');
  const { data: users } = useFetch('/users');
  const { data: quizzes } = useFetch('/quizzes');
  const [confirm, setConfirm] = useState(null);

  const getName = useCallback((uid) => {
    return users?.find((u) => u.id === uid)?.name || `Korisnik #${uid}`;
  }, [users]);

  const getQuiz = useCallback((qid) => {
    return quizzes?.find((q) => q.id === qid)?.title || `Kviz #${qid}`;
  }, [quizzes]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/results/${id}`);
      toast.success('📊 Rezultat obrisan');
      refetch();
    } catch (error) {
      toast.error('Greška pri brisanju');
      console.error(error);
    }
    setConfirm(null);
  };

  return (
    <div className="adm-section animate-fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2 className="adm-title">📈 Rezultati</h2>
        <span className="badge badge-primary">{results?.length || 0} ukupno</span>
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Korisnik</th>
                <th>Kviz</th>
                <th>Rezultat</th>
                <th>Tačnih</th>
                <th>Datum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...(results || [])]
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                .map((r) => (
                  <tr key={r.id}>
                    <td>{getName(r.userId)}</td>
                    <td>{getQuiz(r.quizId)}</td>
                    <td>
                      <strong
                        style={{
                          color:
                            r.percentage >= 60
                              ? 'var(--color-success)'
                              : 'var(--color-danger)',
                        }}
                      >
                        {r.percentage}%
                      </strong>
                    </td>
                    <td>{r.score} / {r.total}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(r.completedAt).toLocaleDateString('bs-BA')}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirm({ id: r.id })}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!results?.length && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
              Nema rezultata
            </div>
          )}
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          message="Obrisati ovaj rezultat?"
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

/* ──────────────────────────────────────
   CONTACTS
────────────────────────────────────────── */
const AdminContacts = () => {
  const { data: contacts, loading, refetch } = useFetch('/contacts');
  const [confirm, setConfirm] = useState(null);
  const [viewMsg, setViewMsg] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('📩 Poruka obrisana');
      refetch();
    } catch (error) {
      toast.error('Greška pri brisanju');
      console.error(error);
    }
    setConfirm(null);
  };

  return (
    <div className="adm-section animate-fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2 className="adm-title">📩 Kontakt poruke</h2>
        <span className="badge badge-primary">{contacts?.length || 0} poruka</span>
      </div>

      {loading ? (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ime</th>
                <th>Email</th>
                <th>Predmet</th>
                <th>Datum</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {[...(contacts || [])]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.subject}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(c.createdAt).toLocaleDateString('bs-BA')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setViewMsg(c)}
                        >
                          👁️ Vidi
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setConfirm({ id: c.id, name: c.name })}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!contacts?.length && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
              Nema poruka
            </div>
          )}
        </div>
      )}

      {viewMsg && (
        <Modal title={`📩 Poruka od ${viewMsg.name}`} onClose={() => setViewMsg(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <strong style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Od:
              </strong>
              <p style={{ margin: '4px 0 0 0' }}>
                {viewMsg.name} &lt;{viewMsg.email}&gt;
              </p>
            </div>

            <div>
              <strong style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Predmet:
              </strong>
              <p style={{ margin: '4px 0 0 0' }}>{viewMsg.subject}</p>
            </div>

            <div>
              <strong style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Datum:
              </strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                {new Date(viewMsg.createdAt).toLocaleString('bs-BA')}
              </p>
            </div>

            <div>
              <strong style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Poruka:
              </strong>
              <div
                style={{
                  marginTop: 8,
                  background: 'var(--color-surface-2)',
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {viewMsg.message}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <button className="btn btn-ghost" onClick={() => setViewMsg(null)}>
              Zatvori
            </button>
            <a
              href={`mailto:${viewMsg.email}?subject=Re: ${viewMsg.subject}`}
              className="btn btn-primary"
            >
              ✉️ Odgovori
            </a>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          message={`Obrisati poruku od "${confirm.name}"?`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
};

/* ──────────────────────────────────────
   ADMIN PAGE SHELL
────────────────────────────────────────── */
const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Provjeri da li je korisnik admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/quizzes', label: 'Kvizovi', icon: '🧩' },
    { to: '/admin/users', label: 'Korisnici', icon: '👥' },
    { to: '/admin/results', label: 'Rezultati', icon: '📈' },
    { to: '/admin/contacts', label: 'Poruke', icon: '📩' },
  ];

  return (
    <div className="adm-wrapper page-wrapper">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <span style={{ fontSize: '1.6rem' }}>⚡</span>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Admin Panel</strong>
            <small style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {user?.name}
            </small>
          </div>
        </div>

        <nav className="adm-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `adm-link${isActive ? ' active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="btn btn-ghost btn-sm adm-back"
          onClick={() => navigate('/')}
        >
          ← Nazad na sajt
        </button>
      </aside>

      <main className="adm-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Routes>
      </main>

      <style>{`
        /* Layout */
        .adm-wrapper {
          display: flex;
          min-height: 100vh;
          padding-top: 80px;
        }

        .adm-sidebar {
          width: 260px;
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: sticky;
          top: 80px;
          height: calc(100vh - 80px);
          overflow-y: auto;
          flex-shrink: 0;
        }

        .adm-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 8px 20px;
          border-bottom: 1px solid var(--color-border);
        }

        .adm-brand strong {
          font-size: 0.95rem;
        }

        .adm-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .adm-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          text-decoration: none;
        }

        .adm-link:hover {
          background: var(--color-border);
          color: var(--color-text);
        }

        .adm-link.active {
          background: rgba(108, 99, 255, 0.1);
          color: var(--color-primary);
          border-left: 2px solid var(--color-primary);
          padding-left: 12px;
        }

        .adm-back {
          margin-top: auto;
          width: 100%;
          justify-content: flex-start;
        }

        .adm-main {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .adm-section {
          max-width: 1200px;
        }

        .adm-title {
          font-size: 1.6rem;
          margin-bottom: 24px;
          color: var(--color-text);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          text-align: center;
          transition: all 0.2s;
        }

        .stat-card:hover {
          border-color: var(--color-border-hover);
          transform: translateY(-2px);
        }

        .info-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          max-height: 90vh;
          overflow-y: auto;
          width: 90%;
        }

        /* Forms */
        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg);
          color: var(--color-text);
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: var(--color-primary);
        }

        .form-input.error {
          border-color: var(--color-danger);
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
          margin-bottom: 6px;
        }

        /* Table */
        .table-wrapper {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: var(--color-surface-2);
          border-bottom: 1px solid var(--color-border);
        }

        th {
          padding: 14px 18px;
          text-align: left;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
        }

        td {
          padding: 14px 18px;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-muted);
          vertical-align: middle;
        }

        tbody tr:hover {
          background: var(--color-surface-2);
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .badge-primary {
          background: rgba(108, 99, 255, 0.2);
          color: var(--color-primary);
        }

        .badge-accent {
          background: rgba(245, 158, 11, 0.15);
          color: #b45309;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.15);
          color: #15803d;
        }

        .badge-danger {
          background: rgba(239, 68, 68, 0.15);
          color: #b91c1c;
        }

        .badge-warning {
          background: rgba(249, 115, 22, 0.15);
          color: #c2410c;
        }

        /* Button */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          background: none;
          color: var(--color-text);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          outline: none;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-danger {
          background: var(--color-danger);
          color: white;
        }

        .btn-danger:hover {
          opacity: 0.9;
        }

        .btn-outline {
          border-color: var(--color-border);
          color: var(--color-text);
        }

        .btn-outline:hover {
          background: var(--color-surface-2);
        }

        .btn-ghost {
          color: var(--color-text-muted);
        }

        .btn-ghost:hover {
          background: var(--color-surface-2);
          color: var(--color-text);
        }

        /* Spinner */
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spinner-sm {
          width: 14px;
          height: 14px;
          border-width: 2px;
          display: inline-block;
          margin-right: 4px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-center {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .adm-wrapper {
            flex-direction: column;
            padding-top: 60px;
          }

          .adm-sidebar {
            width: 100%;
            height: auto;
            position: static;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 12px;
          }

          .adm-brand {
            display: none;
          }

          .adm-nav {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
          }

          .adm-link {
            padding: 8px 12px;
            font-size: 0.8rem;
          }

          .adm-main {
            padding: 16px;
          }

          .adm-title {
            font-size: 1.3rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          table {
            font-size: 0.8rem;
          }

          th,
          td {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;