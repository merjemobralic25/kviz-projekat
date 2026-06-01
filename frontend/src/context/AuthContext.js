import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (window.location.hostname.includes('.github.dev')) {
    if (window.location.origin.includes('-3000.')) {
      return window.location.origin.replace('-3000.', '-3005.');
    }
    return window.location.origin.replace('//', '//') + ':3005';
  }

  return 'http://localhost:3005';
};

const API_URL = getApiUrl();
console.log('🔌 API URL:', API_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('❌ Greška pri čitanju korisnika iz localStorage:', error);
      localStorage.removeItem('currentUser');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Login — pronalazi korisnika u bazi, vraća i čuva u localStorage
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Server greška: ${response.status} ${response.statusText}`);
      }

      const users = await response.json();

      const found = users.find(
        (u) =>
          u.email?.toLowerCase().trim() === email.toLowerCase().trim() &&
          u.password?.trim() === password.trim()
      );

      if (!found) {
        const err = new Error('Pogrešna email adresa ili lozinka.');
        setError(err.message);
        throw err;
      }

      const safeUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role || 'guest',
        createdAt: found.createdAt,
      };

      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      setUser(safeUser);

      console.log('✅ Login uspješan:', safeUser.name);
      return safeUser;
    } catch (error) {
      console.error('❌ Login greška:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register — SAMO kreira novog korisnika u bazi, bez automatskog logovanja
   */
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Provjeri postoji li email
      const checkRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!checkRes.ok) {
        throw new Error(`Server greška pri provjeri emaila: ${checkRes.status}`);
      }

      const existing = await checkRes.json();

      if (existing && existing.length > 0) {
        const err = new Error('Email je već registriran.');
        setError(err.message);
        throw err;
      }

      // Kreiraj novog korisnika u bazi podataka
      const createRes = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          role: 'guest',
          createdAt: new Date().toISOString(),
        }),
      });

      if (!createRes.ok) {
        throw new Error(`Registracija nije uspjela: ${createRes.status}`);
      }

      const created = await createRes.json();
      console.log('✅ Korisnik uspješno kreiran u bazi:', created.name);
      
      // Vraćamo podatke ali NE diramo localStorage i setUser. State ostaje prazan.
      return created;

    } catch (error) {
      console.error('❌ Register greška:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout — briše iz localStorage i resetuje stanje
   */
  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setError(null);
    console.log('✅ Logout uspješan');
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isGuest: user?.role === 'guest',
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth mora biti korišten unutar AuthProvider-a');
  }
  return ctx;
};

export default AuthContext;