import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest, session as sessionRequest, logout as logoutRequest } from '../services/authService';
import { setSessionToken } from '../services/apiClient';

const AuthContext = createContext(null);
const SESSION_STORAGE_KEY = 'capstone_session_id';

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSessionId) {
      setIsLoading(false);
      return;
    }

    setSessionToken(storedSessionId);

    sessionRequest()
      .then((response) => {
        if (response?.data?.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          setSessionToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionToken(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const response = await loginRequest({ email, password });

    const sessionId = response?.data?.sessionId;
    if (sessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
      setSessionToken(sessionId);
    }

    setIsAuthenticated(Boolean(response?.data?.isAuthenticated));
    setUser(response?.data?.user ?? null);

    return response;
  }, []);

  const register = useCallback(async ({ displayName, email, password }) => {
    const response = await registerRequest({ displayName, email, password });

    const sessionId = response?.data?.sessionId;
    if (sessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
      setSessionToken(sessionId);
    }

    setIsAuthenticated(Boolean(response?.data?.isAuthenticated));
    setUser(response?.data?.user ?? null);

    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setSessionToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      user,
      login,
      register,
      logout
    }),
    [isLoading, isAuthenticated, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
