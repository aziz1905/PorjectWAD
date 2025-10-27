import { Routes, Route, Navigate } from 'react-router-dom';
// Hapus useAuth dari sini
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
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import SettingAkun from './Pages/SettingAkun'; 
import Wishlist from './Pages/Wishlist';
import AdminRoutes from './Admin/AdminRoutes';

function App() {
  // HAPUS useAuth(), user, dan logout dari sini

  return (
    // HAPUS <BrowserRouter> dari sini
    <Routes>
      {/* Rute User Biasa */}
      <Route 
        path="/" 
        element={<Layout />} // Hapus props user dan onLogout
      > 
        <Route index element={<Navigate replace to="beranda" />} />
        <Route path="beranda" element={<Beranda />} />
        <Route path="tentang" element={<Tentang />} />
        {/* Lindungi rute setting & wishlist dengan ProtectedRoute */}
        <Route path="settings" element={<ProtectedRoute><SettingAkun /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        
        {/* Rute Pesanan (sudah menggunakan ProtectedRoute) */}
        <Route 
          path="pesanan" 
          element={<ProtectedRoute><Pesanan /></ProtectedRoute>} // Hapus prop user
        >
          <Route index element={<Navigate to="keranjang" replace />} />
          <Route path="keranjang" element={<Keranjang />} />
          <Route path="pengiriman" element={<Pengiriman />} />
          <Route path="histori" element={<Histori />} />
        </Route> 
        
        {/* Rute Masuk & BuatAkun (disederhanakan) */}
        {/* Logika redirect akan ditangani oleh ProtectedRoute/Layout */}
        <Route path="masuk" element={<Masuk />} />
        <Route path="buat-akun" element={<BuatAkun />} />

        <Route path="detail-produk/:id" element={<DetailProduk />}/>
        <Route path="detail-penyewaan" element={<DetailPenyewaan />} />

        {/* Rute 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-96">
            <h1 className="text-4xl font-bold text-blue-800">404: Halaman Tidak Ditemukan</h1>
          </div>
        } />
      </Route>

      {/* Rute Admin (sudah benar) */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
    // HAPUS </BrowserRouter> dari sini
  );
}

export default App;