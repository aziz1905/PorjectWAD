import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Comp_Button';

// ✅ Tipe data untuk props
interface MasukProps {
  onLogin: (email: string, password: string) => boolean;
}

const Masuk = ({ onLogin }: MasukProps) => { // ✅ Terima props onLogin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ Hook untuk navigasi/redirect

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Hapus error sebelumnya

    // ✅ Panggil fungsi onLogin yang dikirim dari App.tsx
    const loginSuccess = onLogin(email, password);

    if (loginSuccess) {
      // ✅ Jika berhasil, arahkan ke halaman beranda
      navigate('/beranda');
    } else {
      // ✅ Jika gagal, tampilkan pesan error
      setError('Email atau kata sandi salah!');
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

            {/* ✅ Tampilkan pesan error jika ada */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div className="flex items-center justify-end">
              <Link to="#" className="form-link">
                Lupa kata sandi?
              </Link>
            </div>

            <div className='flex item-center justify-center pb-4 flex-grow w-full'>
              <Button buttonType="p_masuk" logoChild={<Icon icon="mdi:login" className="text-white text-2xl" />}
                fontChild="Masuk"
                type="submit" 
              />
            </div>
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