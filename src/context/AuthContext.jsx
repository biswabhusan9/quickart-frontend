import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// Helper to get backend URL
const getBackendUrl = () => {
  // Use environment variable or fallback to Vercel deployment
  const apiUrl = import.meta && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'https://quickart-backend-peach.vercel.app';
  
  return apiUrl;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const apiUrl = getBackendUrl();
      
      const response = await fetch(`${apiUrl}/api/me`, {
        credentials: 'include'
      });
      
      if (response && response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const apiUrl = getBackendUrl();
      
      const response = await fetch(`${apiUrl}/api/login`, {
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
      console.error('Login error:', err);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const apiUrl = getBackendUrl();
      
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, email, password, role: 'user' }),
      });
      
      if (response && response.ok) {
        // Don't automatically log in the user after signup
        // Just return success without setting user state
        return { success: true };
      } else if (response) {
        const error = await response.json();
        return { success: false, error: error.error };
      } else {
        return { success: false, error: 'Network error' };
      }
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: 'Network error' };
    }
  };

  const updateUser = async (userData) => {
    try {
      const apiUrl = getBackendUrl();
      
      const response = await fetch(`${apiUrl}/api/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      
      if (response && response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } else if (response) {
        const error = await response.json();
        return { success: false, error: error.error };
      } else {
        return { success: false, error: 'Network error' };
      }
    } catch (err) {
      console.error('Update error:', err);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      const apiUrl = getBackendUrl();
      await fetch(`${apiUrl}/api/logout`, {
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
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
