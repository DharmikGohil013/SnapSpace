import React, { useState } from 'react';
import { authService } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  makeAdmin: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await authService.login(email, password);
      console.log('AuthContext: Login response:', response);
      localStorage.setItem('adminToken', response.token);
      setUser(response.user);
      console.log('AuthContext: User set, authentication successful');
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const makeAdmin = async () => {
    try {
      const updatedUser = await authService.makeAdmin();
      setUser(updatedUser);
      
      // Re-login to get new token with admin role
      if (user) {
        logout();
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    makeAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
