import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'https://tutam9-backend-beta.vercel.app/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          'x-auth-token': token
        }
      });
      setCurrentUser(response.data);
    } catch (err) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/users/register`, userData);
      localStorage.setItem('token', response.data.token);
      setCurrentUser({
        id: response.data.userId,
        username: response.data.username
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      setError(null);
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      setCurrentUser({
        id: response.data.userId,
        username: response.data.username
      });
      return response.data;
    } catch (err) {
      console.error('Login error details:', err.response || err);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};