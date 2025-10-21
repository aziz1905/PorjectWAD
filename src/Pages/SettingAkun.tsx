// src/Pages/SettingAkun.tsx
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext'; // Sesuaikan path jika perlu
import { Icon } from '@iconify/react';

const SettingAkun = () => {
  const { user } = useAuth(); // Ambil data user dari context
  
  // State untuk menyimpan nilai input (jika ingin membuat form edit)
  const [nama, setNama] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // State untuk form ganti password
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState('');
  
  // Handler untuk menyimpan perubahan profil (perlu logika API call)
  const handleSimpanProfil = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Menyimpan profil:', { nama, email });
    // TODO: Tambahkan logika API call ke backend untuk update profil
    alert('Profil (belum) disimpan!');
  };

  // Handler untuk menyimpan password baru (perlu logika API call)
  const handleSimpanPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordBaru !== konfirmasiPasswordBaru) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    console.log('Menyimpan password baru');
    // TODO: Tambahkan logika API call ke backend untuk update password
    alert('Password (belum) disimpan!');
  };

  if (!user) {
    // Tampilkan pesan jika user belum login (seharusnya tidak terjadi jika ada ProtectedRoute)
    return <div className="container mx-auto p-8 text-center">Harap login untuk mengakses halaman ini.</div>;
  }

  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Pengaturan Akun</h1>

      {/* --- Bagian Profil --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3">Informasi Profil</h2>
        <form onSubmit={handleSimpanProfil} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={user.profileImageUrl} 
              alt={user.fullName} 
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
            {/* Opsi ganti foto profil bisa ditambahkan di sini */}
          </div>
          
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-600 mb-1">Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Alamat Email</label>
            <input
              id="email"
              type="email"
              value={email}
              // Email biasanya tidak diubah, jadi bisa dibuat read-only
              // onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              readOnly 
            />
            <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200 flex items-center gap-2"
            >
              <Icon icon="mdi:content-save" /> Simpan Perubahan Profil
            </button>
          </div>
        </form>
      </div>

      {/* --- Bagian Ganti Password --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3">Ubah Kata Sandi</h2>
        <form onSubmit={handleSimpanPassword} className="space-y-4">
          <div>
            <label htmlFor="passwordLama" className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi Lama</label>
            <input
              id="passwordLama"
              type="password"
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="passwordBaru" className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi Baru</label>
            <input
              id="passwordBaru"
              type="password"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="konfirmasiPasswordBaru" className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input
              id="konfirmasiPasswordBaru"
              type="password"
              value={konfirmasiPasswordBaru}
              onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200 flex items-center gap-2"
            >
               <Icon icon="mdi:lock-reset" /> Simpan Kata Sandi Baru
            </button>
          </div>
        </form>
      </div>
      
      {/* Tambahkan bagian lain jika perlu, misal Notifikasi, Alamat, dll. */}

    </div>
  );
};

export default SettingAkun;