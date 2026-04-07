import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const token = localStorage.getItem('saheli_token');
    const ngoId = localStorage.getItem('saheli_ngo_id');
    const ngoName = localStorage.getItem('saheli_ngo_name');

    if (token) {
      setCurrentUser({ id: ngoId, name: ngoName, token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      const user = { id: data.ngo_id, name: data.ngo_name, token: data.access_token };
      setCurrentUser(user);
      localStorage.setItem('saheli_token', data.access_token);
      localStorage.setItem('saheli_ngo_id', data.ngo_id);
      localStorage.setItem('saheli_ngo_name', data.ngo_name);
      return { success: true };
    } catch (error) {
      // Extract clean backend message from Axios error response
      const detail = error?.response?.data?.detail;
      return { success: false, error: detail || 'Login failed. Please check your credentials.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('saheli_token');
    localStorage.removeItem('saheli_ngo_id');
    localStorage.removeItem('saheli_ngo_name');
    apiLogout(); // remove token from interceptors
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
