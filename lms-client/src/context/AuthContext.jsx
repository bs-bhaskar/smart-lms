import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const stored = JSON.parse(localStorage.getItem('lmsAuth'));
    if (stored && stored.token) {
      setUser(stored.user);
      setRole(stored.role);
      setToken(stored.token);
    }
    setLoading(false);
  }, []);

  const saveAuth = (user, role, token) => {
    setUser(user);
    setRole(role);
    setToken(token);
    localStorage.setItem('lmsAuth', JSON.stringify({ user, role, token }));
    localStorage.setItem('lmsToken', token);
  };

  const clearAuth = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('lmsAuth');
    localStorage.removeItem('lmsToken');
  };

  // Example login (adapt as needed)
  const login = async (credentials) => {
    let data;
    if (credentials.regNumber && !credentials.email) {
      // Try teacher first
      try {
        data = await api.post('/teacher/login', credentials);
        saveAuth(data.data.user, data.data.user.role, data.data.token);
        return data.data;
      } catch (err) {
        // If not found as teacher, try student
        if (err.response && err.response.status === 404) {
          try {
            data = await api.post('/student/login', credentials);
            saveAuth(data.data.user, data.data.user.role, data.data.token);
            return data.data;
          } catch (err2) {
            // If not found as student, try admin (with regNumber)
            if (err2.response && err2.response.status === 404) {
              data = await api.post('/auth/login', credentials);
              saveAuth(data.data.user, data.data.user.role, data.data.token);
              return data.data;
            }
            throw err2;
          }
        }
        throw err;
      }
    } else if (credentials.email) {
      // Admin or fallback
      data = await api.post('/auth/login', credentials);
      saveAuth(data.data.user, data.data.user.role, data.data.token);
      return data.data;
    } else {
      throw new Error('Please provide registration number or email');
    }
  };

  const logout = () => {
    clearAuth();
  };

  const register = async (info) => {
    const { data } = await api.post('/auth/register', info);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 