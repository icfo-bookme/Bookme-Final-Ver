'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, logout } from '@/lib/auth';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      setLoading(false);
      return;
    }

    getUser(savedToken)
      .then((userData) => {
        setUser(userData);
        setToken(savedToken);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logoutUser = async () => {
    // try {
    //   if (token) {
    //     await logout(token);
    //   }
    // } catch (err) {
    //   console.log('Logout API failed but continuing UI logout');
    // }

    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, token, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return context;
};