// src/Pages/SettingAkun.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth, User } from '../components/AuthContext'; // Pastikan User di-impor
import { Icon } from '@iconify/react';
import api from '../api';
import { AxiosError } from 'axios';
import NonPict from '../assets/NonPict.png'; // Impor gambar fallback


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
  
  // State untuk phone dan address, diinisialisasi dari context
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  
  const [loadingBiodata, setLoadingBiodata] = useState(true); // Tetap gunakan untuk loading awal
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchFullUserData = async () => {
      if (!user) return;
      setLoadingBiodata(true);
      try {
        const response = await api.get<{ user: User }>(`/users/${user.id}`); 
        const fullUser = response.data.user;
        setPhone(fullUser.phone || '');
        setAddress(fullUser.address || '');
        setPreviewUrl(fullUser.profileImageUrl || null); 

        if (JSON.stringify(user) !== JSON.stringify(fullUser)) {
           login(fullUser);
        }

      } catch (error) {
        console.error("Error fetching full user data:", error);
      } finally {
        setLoadingBiodata(false);
      }
    };
    fetchFullUserData();
  }, [user?.id]); 

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
    setProfileMessage({ type: '', text: 'Menyimpan...' });
    
    let newImageUrl = previewUrl || user?.profileImageUrl; 

    try {
      // --- LANGKAH 1: Upload Foto Jika Ada File Baru Dipilih ---
      if (selectedFile) {
        setProfileMessage({ type: '', text: 'Mengunggah foto...' });
        const formData = new FormData();
        
        // 4. PERBAIKAN: Gunakan 'imageUrl' agar cocok dengan upload.single('imageUrl')
        formData.append('imageUrl', selectedFile);

        try {

          const uploadResponse = await api.post('/upload/profileImage', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          newImageUrl = uploadResponse.data.imageUrl;
          if (!newImageUrl) {
            throw new Error("Backend upload tidak mengembalikan imageUrl.");
          }
          setPreviewUrl(newImageUrl); 
          setSelectedFile(null); // Reset file selection
          console.log("Upload foto berhasil, URL baru:", newImageUrl);

        } catch (uploadError) {
          const axiosError = uploadError as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || 'Gagal mengunggah foto profil.';
          setProfileMessage({ type: 'error', text: errorMessage });
          console.error("Error upload foto:", uploadError);
          return;
        }
      }

      // --- LANGKAH 2: Update Biodata Teks (dan URL Gambar jika berubah) ---
      setProfileMessage({ type: '', text: 'Menyimpan biodata...' });
      
      // 5. PERBAIKAN: Kirim 'imageUrl' agar cocok dengan controller/repo backend
      const biodataData = {
        phone,
        address,
        profileImageUrl: newImageUrl 
      };

      await api.put('/users/biodata', biodataData);

      if (user) {
        const updatedUserData = {
          ...user,
          phone: phone,
          address: address,
          profileImageUrl: newImageUrl 
        };
        login(updatedUserData); 
      }

      setProfileMessage({ type: 'success', text: 'Profil & Biodata berhasil diperbarui!' });

    } catch (err) {
      if (!profileMessage.text.includes('Gagal mengunggah')) {
        const axiosError = err as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Gagal memperbarui biodata.';
        setProfileMessage({ type: 'error', text: errorMessage });
      }
      console.error("Error simpan biodata:", err);
    }
  };

  const handleSimpanPassword = async (e: React.FormEvent) => {
    // ... (fungsi ini sudah benar)
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
      await api.put('/users/password', { oldPassword: passwordLama, newPassword: passwordBaru });
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
      <div className="flex items-center gap-1 px-4 py-2 mb-6">
        <Icon icon="mdi:account-cog-outline" className="text-4xl text-gray-500" />
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan Akun</h1>
      </div>

      {/* --- Bagian Profil & Biodata --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-3">Profil & Biodata</h2>
        <form onSubmit={handleSimpanBiodata} className="space-y-6">
          <div className="flex items-start gap-4 md:gap-6 border-b pb-6 mb-6">
            <div className="relative flex-shrink-0">
              <img
                src={previewUrl || NonPict} 
                alt="Foto Profil"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-blue-500"
              />
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute -bottom-1 -right-1 p-1 bg-gray-700 rounded-full text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
            <div className="space-y-1 flex-grow min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-lg text-gray-800 font-semibold truncate flex-shrink mr-2">{user?.fullName || 'Nama Pengguna'}</p>
                <p className="text-xs text-gray-500 flex-shrink-0">(ID: {user?.id || 'N/A'})</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 truncate">{user?.email || 'Email tidak tersedia'}</p>
              </div>
              
              {/* Tampilkan data dari state (yang di-fetch dari DB) */}
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                <Icon icon="mdi:phone-outline" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{loadingBiodata ? 'Memuat...' : (phone || <span className="text-gray-400 italic">No. Telepon Belum Diisi</span>)}</span>
              </div>
              <div className="flex items-start gap-1.5 text-sm text-gray-600 mt-1">
                <Icon icon="mdi:map-marker-outline" className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="break-words whitespace-normal">{loadingBiodata ? 'Memuat...' : (address || <span className="text-gray-400 italic">Alamat Belum Diisi</span>)}</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-700 pt-2">Edit Biodata</h3>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Nomor Telepon</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 081234567890" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">Alamat Lengkap</label>
            <textarea id="address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Masukkan alamat lengkap Anda" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {profileMessage.text && (
            <p className={`text-sm mt-2 ${profileMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {profileMessage.text}
            </p>
          )}

          <div className="pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200 flex items-center gap-2 ">
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
          {passwordMessage.text && (
            <p className={`text-sm mt-2 ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {passwordMessage.text}
            </p>
          )}
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
    </div>
  );
};

export default SettingAkun;