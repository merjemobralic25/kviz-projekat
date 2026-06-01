import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // UVEZENO: koristi naš auth kontekst
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // DODATO: stanje za učitavanje
  const { register } = useAuth(); // UVEZENO: funkcija koja šalje podatke u db.json
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Osnovna validacija polja
    if (!name.trim() || !email.trim() || !password.trim()) {
      return toast.error('Molimo popunite sva polja!');
    }

    if (password.length < 6) {
      return toast.error('Lozinka mora imati najmanje 6 znakova!');
    }

    setLoading(true);

    try {
      // 2. Šaljemo podatke direktno u naš AuthContext koji puni db.json server
      await register(name, email, password);
      
      toast.success('Profil uspješno kreiran! Sada se možete prijaviti. 👋');
      navigate('/login');
    } catch (error) {
      console.error('Greška pri registraciji:', error);
      // Prikazuje grešku ako email već postoji (što smo podesili u kontekstu)
      toast.error(error.message || 'Registracija nije uspjela. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px var(--space-lg) 40px' }}>
      <div className="card" style={{ maxWidth: 450, width: '100%', padding: 40, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: '3rem' }}>🚀</span>
          <h2 style={{ fontSize: '1.75rem', marginTop: 12, color: 'var(--color-text)' }}>Kreiraj Profil</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Pridruži se zajednici kvizaša i testiraj znanje!</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dim)' }}>Ime i prezime</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text)', fontSize: '0.95rem', transition: 'border-color 0.2s' }} placeholder="Npr. Merjem" disabled={loading} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dim)' }}>Email adresa</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text)', fontSize: '0.95rem' }} placeholder="tvoj@email.com" disabled={loading} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-dim)' }}>Lozinka</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text)', fontSize: '0.95rem' }} placeholder="Najmanje 6 znakova" disabled={loading} />
          </div>
          <button type="submit" className="btn btn-accent btn-lg" style={{ marginTop: 10, width: '100%', padding: '14px', fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'Registracija...' : 'Registruj se ✨'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Već imaš profil? <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Prijavi se</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;