import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { User } from './types';
import { dummyUsers } from './data/Users';
import Layout from './components/Layout';
import Beranda from './Pages/Beranda';
import Tentang from './Pages/Tentang';
import Pesanan from './Pages/Pesanan';
import Masuk from './Pages/Masuk';
import BuatAkun from './Pages/BuatAkun';
import DetailProduk from './Pages/DetailProduk';
import Keranjang from './Pages/pesanan/Keranjang';
import Pengiriman from './Pages/pesanan/Pengiriman';
import Histori from './Pages/pesanan/Histori';
import DetailPenyewaan from './Pages/DetailPenyewaan';

function App() {
  // ✅ State untuk menyimpan data user yang sedang login
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ✅ Fungsi untuk menangani proses login
  const handleLogin = (email: string, password: string): boolean => {
    const user = dummyUsers.find(u => u.email === email && u.password === password);
    if (user) {
      // Jangan simpan password di state
      const { password: _, ...userData } = user; 
      setCurrentUser(userData);
      return true; // Login berhasil
    }
    return false; // Login gagal
  };

  // ✅ Fungsi untuk menangani proses logout
  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Kirim state dan fungsi ke komponen Layout */}
        <Route 
          path="/" 
          element={<Layout user={currentUser} onLogout={handleLogout} />}
        >
          <Route index element={<Navigate replace to="beranda" />} />
          <Route path="beranda" element={<Beranda />} />
          <Route path="tentang" element={<Tentang />} />
          <Route path="pesanan" element={<Pesanan />}>
            <Route index element={<Navigate to="keranjang" replace />} />
            <Route path="keranjang" element={<Keranjang />} />
            <Route path="pengiriman" element={<Pengiriman />} />
            <Route path="histori" element={<Histori />} />
          </Route> 
          <Route path="masuk" element={<Masuk onLogin={handleLogin} />} />
          <Route path="buat-akun" element={<BuatAkun />} />
          <Route path="detail-produk/:id" element={<DetailProduk />}/>
          <Route path="detail-penyewaan" element={<DetailPenyewaan />} />

          <Route path="*" element={
            <div className="flex items-center justify-center h-96">
              <h1 className="text-4xl font-bold text-blue-800">404: Halaman Tidak Ditemukan</h1>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;