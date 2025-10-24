// src/Pages/SettingAkun.tsx
import React, { useState, useEffect,useRef } from 'react';
import { useAuth } from '../components/AuthContext'; 
import { Icon } from '@iconify/react';
import api from '../api';
import { AxiosError } from 'axios';

interface Biodata {
  phone?: string;
  address?: string;
}
interface FeedbackMessage {
  type: 'success' | 'error' | '';
  text: string;
}
const SettingAkun = () => {
  const { user, login } = useAuth(); 
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPasswordBaru, setKonfirmasiPasswordBaru] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profileImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loadingBiodata, setLoadingBiodata] = useState(true);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' }); 
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchBiodata = async () => {
      if (!user) return;
      setLoadingBiodata(true);
      try {
        const response = await api.get<Biodata>(`/users/${user.id}/biodata`);
        setPhone(response.data.phone || '');
        setAddress(response.data.address || '');
      } catch (error) {
        console.error("Error fetching biodata:", error);
      } finally {
        setLoadingBiodata(false);
      }
    };
    fetchBiodata();
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
   };
  const handleImageClick = () => { 
    fileInputRef.current?.click(); 
  };

  const handleSimpanBiodata = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    try {
      if (selectedFile) {
         await handleUploadFotoProfil();
      }
      const biodataData = { phone, address };
      await api.put('/users/biodata', biodataData);
      setProfileMessage({ type: 'success', text: selectedFile ? 'Foto profil & Biodata berhasil diperbarui!' : 'Biodata berhasil diperbarui!' });
      

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = profileMessage.text.includes('Gagal mengunggah')
        ? profileMessage.text
        : axiosError.response?.data?.message || 'Gagal memperbarui biodata.';
      setProfileMessage({ type: 'error', text: errorMessage });
      console.error("Error simpan biodata:", err);
    }
  };

  const handleUploadFotoProfil = async () => {
    if (!selectedFile) return Promise.resolve();
    setProfileMessage({ type: '', text: 'Mengunggah foto...' });
    const formData = new FormData();
    formData.append('profileImage', selectedFile); 

    try {
      const response = await api.put('/users/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Update user context dengan URL gambar baru dari backend
      if (response.data.user && user) {
        const updatedUserData = { ...user, profileImageUrl: response.data.user.profileImageUrl };
        login(updatedUserData);
        setPreviewUrl(response.data.user.profileImageUrl); 
        setSelectedFile(null); 
      }
      return Promise.resolve();

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Gagal mengunggah foto profil.';
      setProfileMessage({ type: 'error', text: errorMessage });
      console.error("Error upload foto:", err);
    }
  };

 const handleSimpanPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordBaru !== konfirmasiPasswordBaru) {
      setPasswordMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok!' });
      return;
    }
    if (!passwordLama || !passwordBaru) {
       setPasswordMessage({ type: 'error', text: 'Semua field password harus diisi!' });
       return;
    }

    try {
      await api.put('/users/password', { passwordLama, passwordBaru });
      setPasswordMessage({ type: 'success', text: 'Password berhasil diubah!' });
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
      <div className="flex items-center gap-1 px-4 py-2 mb-6"> {/* Header Halaman */}
         <Icon icon="mdi:account-cog-outline" className="text-4xl text-gray-500" />
         <h1 className="text-3xl font-bold text-gray-800">Pengaturan Akun</h1>
      </div>

      {/* --- Bagian Profil & Biodata --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3">Profil & Biodata</h2>
        <form onSubmit={handleSimpanBiodata} className="space-y-6">

          {/* --- Header Profil (Layout Baru) --- */}
          <div className="flex items-center gap-6 border-b pb-6 mb-6">
            <div className="relative flex-shrink-0">
              <img 
                src={previewUrl || user.profileImageUrl} 
                alt="Foto Profil" 
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
              <button 
                type="button" 
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 p-1.5 bg-gray-700 rounded-full text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Ubah foto profil"
              >
                 <Icon icon="mdi:camera" className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden" 
              />
            </div>
            <div className="space-y-1 flex-grow">
               <div>
                  <label className="block text-xs font-medium text-gray-500">User ID</label>
                  <p className="text-sm text-gray-800 font-medium">{user.id || 'N/A'}</p>
               </div>
               <div>
                  <label className="block text-xs font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-sm text-gray-800 font-medium">{user.fullName || 'N/A'}</p>
               </div>
               <div>
                  <label className="block text-xs font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-800 font-medium truncate">{user.email || 'N/A'}</p>
               </div>
            </div>
          </div>
          {loadingBiodata ? (
            <div className="text-center text-gray-500">Memuat data biodata...</div>
          ) : (
            <>
              {/* Nomor Telepon */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Nomor Telepon</label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 081234567890" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              {/* Alamat */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">Alamat Lengkap</label>
                <textarea id="address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Masukkan alamat lengkap Anda" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </>
          )}

          {/* Tampilkan pesan feedback profil/biodata */}
          {profileMessage.text && (
            <p className={`text-sm mt-2 ${profileMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {profileMessage.text}
            </p>
          )}

          {/* Tombol Simpan Biodata */}
          <div className="pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200 flex items-center gap-2">
              <Icon icon="mdi:content-save" /> Simpan Biodata & Foto
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