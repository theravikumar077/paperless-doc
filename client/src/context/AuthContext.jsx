import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Sync theme with DOM & media query listener
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t) => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else if (t === 'light') {
        root.classList.remove('dark');
      } else if (t === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, [theme]);

  // Update theme state and sync with backend if logged in
  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (token) {
      try {
        await api.put('/auth/profile', { theme: newTheme });
      } catch (err) {
        console.error('Failed to sync theme with backend profile:', err);
      }
    }
  };

  // Fetch current user details on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
          if (res.data.data.theme) {
            setTheme(res.data.data.theme);
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, data } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(newToken);
    setUser(data);
    if (data.theme) setTheme(data.theme);
    return data;
  };

  const handleTokenLogin = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.theme) setTheme(userData.theme);
      return userData;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw err;
    }
  };

  const googleLogin = async (idToken, googleUser) => {
    const res = await api.post('/auth/google', { idToken, googleUser });
    const { token: newToken, data } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(newToken);
    setUser(data);
    if (data.theme) setTheme(data.theme);
    return data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: newToken, data } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(newToken);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const completeOnboarding = async (selectedCategories, preferences) => {
    const res = await api.post('/auth/onboarding', {
      selectedCategories,
      preferences,
    });
    setUser(res.data.data);
    localStorage.setItem('user', JSON.stringify(res.data.data));
    return res.data.data;
  };

  const updateProfile = async (updateData) => {
    const res = await api.put('/auth/profile', updateData);
    setUser(res.data.data);
    localStorage.setItem('user', JSON.stringify(res.data.data));
    if (updateData.theme) setTheme(updateData.theme);
    return res.data.data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  };

  const deleteAccount = async (confirmationText) => {
    const res = await api.delete('/auth/account', {
      data: { confirmationText },
    });
    logout();
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        theme,
        setTheme: changeTheme,
        login,
        googleLogin,
        handleTokenLogin,
        signup,
        logout,
        completeOnboarding,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
