import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const API_URL = 'https://laughing-space-rotary-phone-494459xgx452qp6q-5004.app.github.dev/api';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      setLoading(true);
      console.log('Tentative de connexion avec:', { username, password });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Status de la réponse:', response.status);
      const data = await response.json();
      console.log('Données reçues:', data);

      if (data.success) {
        console.log('Connexion réussie');
        setAuth(data.user);
        localStorage.setItem('token', data.user.token);
        return true;
      }
      console.log('Échec de connexion:', data.message);
      return false;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      auth,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};