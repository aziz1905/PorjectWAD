import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number; 
  fullName: string;
  email: string;
  profileImageUrl?: string | null;
  phone?: string | null; 
  address?: string | null; 
  role?: string; 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user'); 
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      localStorage.removeItem('user'); 
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]); 

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
