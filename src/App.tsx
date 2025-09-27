import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen Layout dan semua halaman
import Layout from './components/Layout';
import Beranda from './Pages/Beranda';
import Tentang from './Pages/Tentang';
import Pesanan from './Pages/Pesanan';
import Masuk from './Pages/Masuk';
import BuatAkun from './Pages/BuatAkun';
import DetailProduk from './Pages/DetailProduk';

// Anda bisa membuat halaman Masuk dan BuatAkun nanti
// import Masuk from './pages/Masuk'; 
// import BuatAkun from './pages/BuatAkun';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Semua halaman akan menggunakan komponen Layout sebagai bungkusnya */}
        <Route path="/" element={<Layout />}>
          
          {/* Rute-rute anak yang akan dirender di dalam <Outlet> */}
          <Route index element={<Beranda />} />
          <Route path="tentang" element={<Tentang />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="masuk" element={<Masuk />} />
          <Route path="buat-akun" element={<BuatAkun />} />
          <Route path="detail-produk" element={<DetailProduk />}/>


          {/* Rute untuk halaman tidak ditemukan */}
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
