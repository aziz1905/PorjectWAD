import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Comp_Button';
import { useAuth } from '../components/AuthContext'; // 1. IMPORT useAuth

const Masuk = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // 2. TAMBAHKAN state untuk error
  
  const navigate = useNavigate();
  const { login } = useAuth(); // 3. PANGGIL hook useAuth untuk mendapatkan fungsi login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error setiap kali submit
    
    try {
        // URL dan method fetch Anda sudah benar
        const response = await fetch('http://localhost:5000/users/login', { // Pastikan path-nya benar
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) { // Jika login berhasil
            // 4. INI BAGIAN UTAMANYA
            const { password, ...safeUser } = data.user; // Hapus password dari objek

            const userToSave = {
              ...safeUser,
              profileImageUrl: safeUser.imageUrl || 'https://i.pravatar.cc/150'
            };

            login(userToSave); // Panggil fungsi login dari context
            navigate('/beranda'); // Arahkan ke beranda (atau '/')
        } else { // Jika login gagal
            setError(data.message || 'Email atau kata sandi salah.'); // 5. Set pesan error
        }
    } catch (error) {
        setError('Terjadi kesalahan jaringan. Pastikan server backend berjalan.'); // 5. Set pesan error
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

            {/* 6. TAMPILKAN pesan error di sini */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

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

export default Masuk;