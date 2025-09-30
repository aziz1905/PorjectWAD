import { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../type'; 
import { dummyUsers } from '../data/Users'; 

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email: string, password: string): boolean => {
    const user = dummyUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userData } = user;
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = { user: currentUser, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};