  // src/Pages/SettingAkun.tsx
  import React, { useState, useEffect,useRef } from 'react';
  import { useAuth } from '../components/AuthContext'; 
  import { Icon } from '@iconify/react';
  import api from '../api';
  import { AxiosError } from 'axios';

  interface Biodata {
    phone?: string;
    address?: string;
    imageUrl?: string; // Tambahkan jika backend mengirim imageUrl saat GET /biodata
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
          const response = await api.get<Biodata>(`/users/profile`);
          setPhone(response.data.phone || '');
          setAddress(response.data.address || '');
        } catch (error) {
          console.error("Error fetching biodata:", error);
        } finally {
          setLoadingBiodata(false);
        }
      };
      fetchBiodata();
    }, [user, login]);

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
    let newImageUrl = user?.profileImageUrl; // Mulai dengan URL gambar saat ini

    try {
      // --- LANGKAH 1: Upload Foto Jika Ada ---
      if (selectedFile) {
        setProfileMessage({ type: '', text: 'Mengunggah foto...' });
        const formData = new FormData();
        // Pastikan nama field 'profileImage' cocok dengan upload.single() di backend route
        formData.append('profileImage', selectedFile); 

        try {
          // Panggil endpoint HANYA untuk upload FOTO
          // Pastikan endpoint ini adalah POST dan alamatnya benar
          const uploadResponse = await api.post('/users/upload/profile', formData, { 
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          // Ambil URL baru dari respons upload
          // Pastikan backend mengembalikan { imageUrl: '...' }
          newImageUrl = uploadResponse.data.imageUrl; 
          if (!newImageUrl) {
             throw new Error("Backend upload tidak mengembalikan imageUrl.");
          }
          setPreviewUrl(newImageUrl); // Update preview permanen
          setSelectedFile(null); // Reset file selection
          console.log("Upload foto berhasil, URL baru:", newImageUrl);

        } catch (uploadError) {
          // Tangani error spesifik upload
          const axiosError = uploadError as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || 'Gagal mengunggah foto profil.';
          setProfileMessage({ type: 'error', text: errorMessage });
          console.error("Error upload foto:", uploadError);
          return; // Hentikan proses jika upload gagal
        }
      }

      // --- LANGKAH 2: Update Biodata Teks (dan URL Gambar jika berubah) ---
      setProfileMessage({ type: '', text: 'Menyimpan biodata...' });
      const biodataData = { 
          phone, 
          address,
          // Kirim URL gambar (baru atau lama) ke endpoint biodata
          imageUrl: newImageUrl 
      };
      
      // Panggil endpoint HANYA untuk update BIODATA (mengirim JSON)
      // Pastikan endpoint ini adalah PUT dan alamatnya benar
      await api.put('/users/biodata', biodataData); 

      // --- LANGKAH 3: Update Context ---
      if (user) {
         const updatedUserData = { 
             ...user, 
             phone: phone,      
             address: address,    
             profileImageUrl: newImageUrl // Update context dengan URL baru/lama
         };
         login(updatedUserData); // Update context & localStorage
      }

      setProfileMessage({ type: 'success', text: 'Profil & Biodata berhasil diperbarui!' });

    } catch (err) { // Tangani error dari PUT /users/biodata
      // Jangan timpa error upload jika sudah ada
      if (!profileMessage.text.includes('Gagal mengunggah')) { 
          const axiosError = err as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || 'Gagal memperbarui biodata.';
          setProfileMessage({ type: 'error', text: errorMessage });
      }
      console.error("Error simpan biodata:", err);
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
          {/* Form sekarang memanggil handleSimpanBiodata */}
          <form onSubmit={handleSimpanBiodata} className="space-y-6"> 

            {/* --- Header Profil (Layout Baru) --- */}
            <div className="flex items-start gap-4 md:gap-6 border-b pb-6 mb-6">
              <div className="relative flex-shrink-0">
                {/* Gunakan previewUrl atau fallback */}
                <img 
                  src={previewUrl || 'https://via.placeholder.com/96'} 
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

              {/* Info User & Biodata (Read Only) */}
              <div className="space-y-1 flex-grow min-w-0"> {/* Tambah min-w-0 */}
                {/* Baris 1: Nama & ID */}
                <div className="flex items-baseline gap-2">
                  <p className="text-lg text-gray-800 font-semibold truncate flex-shrink mr-2">{user?.fullName || 'Nama Pengguna'}</p>
                  <p className="text-xs text-gray-500 flex-shrink-0">(ID: {user?.id || 'N/A'})</p>
                </div>
                {/* Baris 2: Email */}
                <div>
                    <p className="text-sm text-gray-600 truncate">{user?.email || 'Email tidak tersedia'}</p>
                </div>
                
                {/* --- TAMBAHKAN TAMPILAN PHONE & ADDRESS DI SINI --- */}
                {/* Baris 3: Telepon (Sekarang selalu tampil, ambil dari state) */}
                <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1"> 
                    <Icon icon="mdi:phone-outline" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{phone || <span className="text-gray-400 italic">No. Telepon Belum Diisi</span>}</span>
                </div>
                {/* Baris 4: Alamat (Sekarang selalu tampil, ambil dari state) */}
                <div className="flex items-start gap-1.5 text-sm text-gray-600 mt-1"> 
                    <Icon icon="mdi:map-marker-outline" className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" /> 
                    <span className="break-words whitespace-normal">{address || <span className="text-gray-400 italic">Alamat Belum Diisi</span>}</span> 
                </div>
                {/* Hapus loading biodata */}
              </div>
            </div>
            
            {/* HAPUS INPUT NAMA LENGKAP & EMAIL (Read Only di atas) */}

            {/* --- Input Biodata (Bisa Diedit) --- */}
            <h3 className="text-lg font-medium text-gray-700 pt-2">Edit Biodata</h3>
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

            {/* Tampilkan pesan feedback profil/biodata */}
            {profileMessage.text && (
              <p className={`text-sm mt-2 ${profileMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {profileMessage.text}
              </p>
            )}

            {/* Tombol Simpan Biodata */}
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