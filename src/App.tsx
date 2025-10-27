import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/AuthContext'; 
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
import ProtectedRoute from './components/ProtectedRoute';
import SettingAkun from './Pages/SettingAkun';
import Wishlist from './Pages/Wishlist';
import AdminRoutes from './Admin/AdminRoutes';


function App() {

  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rute User Biasa */}
        <Route 
          path="/" 
          // Anda bisa sederhanakan ini menjadi element={<Layout />}
          // dan biarkan Layout memanggil useAuth()
          element={<Layout user={user} onLogout={logout} />} 
        > 
          <Route index element={<Navigate replace to="beranda" />} />
          <Route path="beranda" element={<Beranda />} />
          <Route path="tentang" element={<Tentang />} />
          <Route path="settings" element={<SettingAkun />} />
          <Route path="wishlist" element={<Wishlist />} />
          
          <Route 
            path="pesanan" 
            element={
              <ProtectedRoute user={user}>
                <Pesanan />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="keranjang" replace />} />
            <Route path="keranjang" element={<Keranjang />} />
            <Route path="pengiriman" element={<Pengiriman />} />
            <Route path="histori" element={<Histori />} />
          </Route> 
          
          <Route path="masuk" element={
            user ? <Navigate to="/beranda" replace /> : <Masuk />
          } />
          <Route path="buat-akun" element={
            user ? <Navigate to="/masuk" replace /> : <BuatAkun />
          } />

          <Route path="detail-produk/:id" element={<DetailProduk />}/>
          <Route path="detail-penyewaan" element={<DetailPenyewaan />} />

          {/* Rute 404 (sudah benar) */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-96">
              <h1 className="text-4xl font-bold text-blue-800">404: Halaman Tidak Ditemukan</h1>
            </div>
          } />


        </Route>
         <Route path="/admin/*" element={<AdminRoutes />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;