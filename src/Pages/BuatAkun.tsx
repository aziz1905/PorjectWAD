import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '../components/Comp_Button'; 
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../api';

const BuatAkun = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok!");
      return;
    }
    
    try {
      const response = await api.post('/users/registrasi', {
        name,
        email,
        password,
      });

      setSuccessMessage('Akun berhasil dibuat! Anda akan dialihkan ke halaman login...');
      
      setTimeout(() => {
        navigate('/masuk');
      }, 2000);

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Gagal membuat akun. Coba lagi nanti.';
      setError(errorMessage);
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Buat Akun Baru</h2>
          <p className="login-subtitle">Bergabunglah dengan kami dan mulai sewa kostum impian Anda!</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Input Nama Lengkap */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nama Lengkap</label>
              <div className="relative">
                <Icon icon="mdi:account-outline" className="input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="form-input pl-10"
                  placeholder="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Input Email */}
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

            {/* Input Kata Sandi */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Kata Sandi</label>
              <div className="relative">
                <Icon icon="mdi:lock-outline" className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            {/* Input Konfirmasi Kata Sandi */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <Icon icon="mdi:lock-check-outline" className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="form-input pl-10"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

            <div className="my-8 flex justify-center">
              {/* 5. Perbaikan pada Button */}
              <Button 
                buttonType="p_masuk" 
                logoChild={<Icon icon="mdi:account-card" className="text-white text-2xl" />}
                fontChild="Registrasi"
                type="submit" 
              />
            </div>
          </form>

          <p className="switch-page-text">
            Sudah punya akun?{' '}
            <Link to="/masuk" className="form-link font-bold">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuatAkun;