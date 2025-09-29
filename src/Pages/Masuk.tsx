import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from '../components/Comp_Button';

const Masuk = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => { // Fungsi harus async
    e.preventDefault();
    
    try {
        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Kirim data email dan password ke backend
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) { // Status 200 OK
            alert('Login berhasil! Selamat datang, ${data.user.fullName}.'); 
            // Nanti, di sini Anda akan menyimpan token sesi
            navigate('/'); // Redirect ke halaman beranda
        } else { // Status 401 Unauthorized
            alert('Login Gagal: ${data.message}');
        }
    } catch (error) {
        alert('Terjadi kesalahan jaringan atau server. Pastikan server backend berjalan di port 5000.');
        console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Masuk ke Akun Anda</h2>
          <p className="login-subtitle">Selamat datang kembali! Silakan masukkan detail Anda.</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

            <Button buttonType="p_masuk" logoChild={<Icon icon="mdi:login" className="text-white text-2xl" />}
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

export default Masuk;