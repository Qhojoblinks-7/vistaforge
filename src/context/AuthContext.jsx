import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('adminToken', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);