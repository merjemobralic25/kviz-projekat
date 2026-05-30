import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { validateContact } from '../utils/validators';
import { api } from '../hooks/useFetch';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm(
    { name: '', email: '', subject: '', message: '' }, validateContact
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/contacts', { ...data, createdAt: new Date().toISOString() });
      toast.success('Poruka je uspješno poslana!');
      setSent(true);
      reset();
    } catch { toast.error('Greška pri slanju. Pokušajte ponovo.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0 var(--space-xl)' }} className="animate-fade-in">
          <span className="section-tag">Kontakt</span>
          <h1 style={{ margin: '12px 0 16px' }}>Stupite u kontakt</h1>
          <p>Imate pitanje, prijedlog ili problem? Javite nam se.</p>
        </div>

        <div className="contact-layout">
          
          <div className="animate-fade-in">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Email', value: 'info@quizmaster.ba' },
                { label: 'Lokacija', value: 'Sarajevo, BiH' },
                { label: 'Radno vrijeme', value: 'Pon–Pet: 9:00–17:00' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', transition: 'border-color var(--transition-base)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-dim)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>Sarajevo, Bosna i Hercegovina</div>
            <iframe
              title="Google Maps - Sarajevo"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45280.17944839946!2d18.37249315820312!3d43.84864429999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4758c5ad5b6b1f5f%3A0x3e81714fde3f5c25!2sSarajevo!5e0!3m2!1sen!2s!4v1699900000000!5m2!1sen!2s"
              width="100%" height="280"
              style={{ border: 0, borderRadius: 'var(--radius-lg)', display: 'block' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          
          <div className="card animate-fade-in" style={{ animationDelay: '100ms', padding: '36px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <h2>Poruka poslana!</h2>
                <p>Odgovorićemo vam u najkraćem mogućem roku.</p>
                <button className="btn btn-primary" onClick={() => setSent(false)}>Pošalji novu poruku</button>
              </div>
            ) : (
              <>
                <h2 style={{ marginBottom: 28 }}>Pošaljite poruku</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Ime i prezime</label>
                      <input name="name" type="text" className={`form-input${touched.name && errors.name ? ' error' : ''}`} placeholder="Vaše ime" value={values.name} onChange={handleChange} onBlur={handleBlur} />
                      {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email adresa</label>
                      <input name="email" type="email" className={`form-input${touched.email && errors.email ? ' error' : ''}`} placeholder="vas@email.com" value={values.email} onChange={handleChange} onBlur={handleBlur} />
                      {touched.email && errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Predmet</label>
                    <input name="subject" type="text" className={`form-input${touched.subject && errors.subject ? ' error' : ''}`} placeholder="Tema vaše poruke" value={values.subject} onChange={handleChange} onBlur={handleBlur} />
                    {touched.subject && errors.subject && <span className="form-error">{errors.subject}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Poruka</label>
                    <textarea name="message" className={`form-input${touched.message && errors.message ? ' error' : ''}`} placeholder="Napišite vašu poruku..." value={values.message} onChange={handleChange} onBlur={handleBlur} rows={5} />
                    {touched.message && errors.message && <span className="form-error">{errors.message}</span>}
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                    {loading ? <><span className="spinner spinner-sm" /> Slanje...</> : 'Pošalji poruku'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-layout { display: grid; grid-template-columns: 1fr 1.3fr; gap: 32px; padding-bottom: var(--space-3xl); }
        @media (max-width: 1024px) { .contact-layout { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .contact-layout .card { padding: 24px; } }
      `}</style>
    </div>
  );
};

export default ContactPage;