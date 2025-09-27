import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import BuatAkunButton from '../components/Comp_Button.tsx';
import { Link } from 'react-router-dom';

const BuatAkun = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Kata sandi tidak cocok!");
      return;
    }
    // TODO: Tambahkan logika untuk handle pendaftaran di sini
    console.log({ fullName, email, password });
    alert('Akun berhasil dibuat untuk: ' + fullName);
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Buat Akun Baru</h2>
          <p className="login-subtitle">Bergabunglah dengan kami dan mulai sewa kostum impian Anda!</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Nama Lengkap</label>
              <div className="relative">
                <Icon icon="mdi:account-outline" className="input-icon" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="form-input pl-10"
                  placeholder="Nama Lengkap Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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
                  required
                  className="form-input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

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

            <div className="my-8 flex justify-center">
              <BuatAkunButton  
               buttonType="p_masuk" logoChild={<Icon icon="mdi:account-card" className="text-white text-2xl" />}
                fontChild="Registrasi"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault(); 
                <Link to="/"> </Link>
                }}
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