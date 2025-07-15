import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// Helper to get backend URL
const getBackendUrl = () => {
  // Use environment variable or fallback
  return import.meta && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3001';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log(getBackendUrl());
      
      const response = await fetch(`${getBackendUrl()}/api/me`, {
        credentials: 'include'
      });
      if (response && response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (response && response.ok) {
        const userData = await response.json();
        setUser(userData);
        return { success: true, user: userData };
      } else if (response) {
        const error = await response.json();
        return { success: false, error: error.error };
      } else {
        return { success: false, error: 'Network error' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, role: 'user' }),
      });
      if (response && response.ok) {
        const userData = await response.json();
        setUser(userData);
        return { success: true, user: userData };
      } else if (response) {
        const error = await response.json();
        return { success: false, error: error.error };
      } else {
        return { success: false, error: 'Network error' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${getBackendUrl()}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('cart'); // Clear cart on logout
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
