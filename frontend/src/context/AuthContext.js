import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('quiz_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error('Server greška, pokušajte ponovo.');

    const users = await response.json();
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) throw new Error('Pogrešan email ili lozinka.');

    const { password: _pw, ...safeUser } = found;
    localStorage.setItem('quiz_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const checkRes = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    const existing = await checkRes.json();
    if (existing.length > 0) throw new Error('Email već postoji.');

    const newUser = {
      name,
      email,
      password,
      role: 'guest',
      createdAt: new Date().toISOString(),
    };

    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error('Registracija nije uspjela.');

    const created = await res.json();
    const { password: _pw, ...safeUser } = created;
    localStorage.setItem('quiz_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('quiz_user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isGuest = user?.role === 'guest';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isGuest, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};