import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext'; // Sesuaikan path jika perlu
import { Icon } from '@iconify/react';
import api from '../api'; // 1. Import instance axios Anda
import { AxiosError } from 'axios'; // Import tipe error Axios

const SettingAkun = () => {
  // 2. Ambil fungsi 'login' dari context untuk update data user setelah sukses
  const { user, login } = useAuth(); 
  
  const [nama, setNama] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState('');

  // State untuk feedback (opsional tapi bagus)
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // 3. Handler untuk menyimpan profil (diubah menjadi async)
  const handleSimpanProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' }); // Reset pesan

    try {
      // Panggil API PUT ke backend
      const response = await api.put('/users/profile', { name: nama });
      
      // Tampilkan pesan sukses
      setProfileMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });

      // Update data user di AuthContext agar nama di navbar juga berubah
      if (response.data.user) {
        // Ambil data user lama dan gabungkan dengan data baru
        const updatedUserData = { ...user, ...response.data.user };
        login(updatedUserData); 
      }

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Gagal menyimpan profil.';
      setProfileMessage({ type: 'error', text: errorMessage });
      console.error("Error update profil:", err);
    }
  };

  // 4. Handler untuk menyimpan password (diubah menjadi async)
  const handleSimpanPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' }); // Reset pesan

    if (passwordBaru !== konfirmasiPasswordBaru) {
      setPasswordMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok!' });
      return;
    }

    try {
      // Panggil API PUT ke backend
      await api.put('/users/password', { passwordLama, passwordBaru });

      // Tampilkan pesan sukses
      setPasswordMessage({ type: 'success', text: 'Password berhasil diubah!' });
      
      // Kosongkan field password
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasiPasswordBaru('');

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengubah password.';
      setPasswordMessage({ type: 'error', text: errorMessage });
      console.error("Error ubah password:", err);
    }
  };

  if (!user) {
    return <div className="container mx-auto p-8 text-center">Harap login untuk mengakses halaman ini.</div>;
  }

  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Pengaturan Akun</h1>

      {/* --- Bagian Profil --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3">Informasi Profil</h2>
        <form onSubmit={handleSimpanProfil} className="space-y-4">
          {/* ... (bagian foto profil tidak berubah) ... */}
          
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-600 mb-1">Nama Lengkap</label>
            <input
              id="nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Alamat Email</label>
            <input
              id="email" type="email" value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" readOnly 
            />
            <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
          </div>

          {/* Tampilkan pesan feedback profil */}
          {profileMessage.text && (
            <p className={`text-sm ${profileMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {profileMessage.text}
            </p>
          )}

          <div className="pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200 flex items-center gap-2">
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
              id="passwordLama" type="password" value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required
            />
          </div>
          
          <div>
            <label htmlFor="passwordBaru" className="block text-sm font-medium text-gray-600 mb-1">Kata Sandi Baru</label>
            <input
              id="passwordBaru" type="password" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required
            />
          </div>
          
          <div>
            <label htmlFor="konfirmasiPasswordBaru" className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input
              id="konfirmasiPasswordBaru" type="password" value={konfirmasiPasswordBaru} onChange={(e) => setKonfirmasiPasswordBaru(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required
            />
          </div>

          {/* Tampilkan pesan feedback password */}
          {passwordMessage.text && (
            <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {passwordMessage.text}
            </p>
          )}

          <div className="pt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200 flex items-center gap-2">
               <Icon icon="mdi:lock-reset" /> Simpan Kata Sandi Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingAkun;