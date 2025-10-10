import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// 1. Definisikan tipe data untuk user (sesuaikan jika perlu)
interface User {
  id: number;
  fullName: string;
  email: string;
}

// 2. Definisikan tipe untuk value dari context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// 3. Buat Context dengan tipe yang sudah didefinisikan
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook agar lebih mudah digunakan
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};

// 4. Buat Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Gagal parse user dari localStorage", error);
      return null;
    }
  });

  // Setiap kali state 'user' berubah, simpan ke localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]); // Dependency array: efek ini berjalan saat 'user' berubah

  // Fungsi login sekarang hanya perlu memanggil setUser
  // Logika API call sebaiknya ada di halaman login
  const login = (userData: User) => {
    setUser(userData);
  };

  // Fungsi logout akan membersihkan state dan localStorage
  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};