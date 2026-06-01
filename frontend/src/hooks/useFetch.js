import { useState, useEffect } from 'react';

/**
 * Dinamički URL za API
 */
export const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  if (
    window.location.hostname.includes('.github.dev') ||
    window.location.hostname.includes('preview.app.github.dev')
  ) {
    const baseUrl = window.location.origin.replace(':3000', ':3005');
    return baseUrl;
  }

  return 'http://localhost:3005';
};

/**
 * Custom hook za fetch — GET zahtjeve
 * @param {string} endpoint - API endpoint (npr. '/quizzes')
 * @returns {{data: any, loading: boolean, error: string|null, refetch: Function}}
 */
export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = getApiUrl();

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error(`❌ Fetch greška za ${endpoint}:`, err);
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
 * Helper za API pozive — POST, PUT, PATCH, DELETE
 */
export const api = {
  post: async (endpoint, body) => {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST greška: ${res.status}`);
    return res.json();
  },

  put: async (endpoint, body) => {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PUT greška: ${res.status}`);
    return res.json();
  },

  patch: async (endpoint, body) => {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PATCH greška: ${res.status}`);
    return res.json();
  },

  delete: async (endpoint) => {
    const API_URL = getApiUrl();
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`DELETE greška: ${res.status}`);
    return res.json();
  },
};

export default useFetch;