import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setLoading(false);
  }, []);

  // `user` only lives in memory, so a hard refresh used to log the admin out of
  // every component that reads it (the sidebar rendered nothing at all). Rehydrate
  // it from the stored token on mount. An expired token also gets cleared here
  // rather than failing every subsequent query.
  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setUser(null);
      setLoading(false);
      return () => { cancelled = true; };
    }

    (async () => {
      try {
        const { default: apiService } = await import('../services/api');
        const me = await apiService.getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('adminToken');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [token]);

  const login = useCallback((userData, nextToken) => {
    setUser(userData);
    setToken(nextToken);
    setLoading(false);
    localStorage.setItem('adminToken', nextToken);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: !!token, login, logout }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
