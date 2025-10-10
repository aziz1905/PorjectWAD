import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Comp_Button';
import { useAuth } from '../components/AuthContext';
import api from '../api'; 

// Tambahan: Import tipe error dari Axios
import { AxiosError } from 'axios';

const Masuk = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  // 1. Beri tipe data pada event handler 'e'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    try {
      const response = await api.post('/users/login', { email, password });
      const { user } = response.data;

      if (user) {
        login(user); 
        navigate('/beranda');
      } else {
        setError('Gagal mendapatkan data pengguna.');
      }

    } catch (err) {
      // 2. Beri tipe data pada error 'err'
      // Ini akan membantu TypeScript mengerti struktur error dari Axios
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Terjadi kesalahan. Coba lagi nanti.';
      setError(errorMessage); 
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Masuk ke Akun Anda</h2>
          <p className="login-subtitle">Selamat datang kembali! Silakan masukkan detail Anda.</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="form-group">
               <label htmlFor="email" className="form-label">Alamat Email</label>
               <div className="relative">
                 <Icon icon="mdi:email-outline" className="input-icon" />
                 <input
                   id="email"
                   name="email"
                   type="email"
                   autoComplete="email"
                   required
                   className="form-input pl-10"
                   placeholder="anda@email.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
             </div>

             <div className="form-group">
               <label htmlFor="password" className="form-label">Kata Sandi</label>
               <div className="relative">
                 <Icon icon="mdi:lock-outline" className="input-icon" />
                 <input
                   id="password"
                   name="password"
                   type="password"
                   autoComplete="current-password"
                   required
                   className="form-input pl-10"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
               </div>
             </div>
             
             <div className="flex items-center justify-end">
               <Link to="#" className="form-link">
                 Lupa kata sandi?
               </Link>
             </div>

             {error && (
               <p className="text-red-500 text-sm text-center">{error}</p>
             )}
            <Button 
                buttonType="p_masuk" 
                logoChild={<Icon icon="mdi:login" className="text-white text-2xl" />}
                fontChild="Masuk"
                type="submit" 
            />
          </form>

          <p className="switch-page-text">
            Belum punya akun?{' '}
            <Link to="/buat-akun" className="form-link font-bold">
              Buat Akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Masuk;