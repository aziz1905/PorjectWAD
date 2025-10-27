  import React from 'react';
  import { Routes, Route, Navigate } from 'react-router-dom';
  import { useAuth } from '../components/AuthContext';
  import AdminLayout from './components/AdminLayout';
  import LogTransaksi from './pages/LogTransaksi';
  import StatusProduk from './pages/StatusProduk';

  // Komponen Pelindung Rute (Versi Sederhana)
  const ProtectedAdminRoute = () => {
    // Ambil user HANYA dari context. Context sudah membaca localStorage saat inisialisasi.
    const { user } = useAuth();

    console.log("ProtectedAdminRoute checking user:", user); 

    // Lakukan pengecekan role
    if (user && user.role === 'admin') {
      console.log("Admin access GRANTED.");
      return <AdminLayout />; // Tampilkan layout admin
    }
  
    // Jika tidak, tendang ke halaman utama
    console.log("Admin access DENIED. Redirecting to /");
    return <Navigate to="/" replace />;
  };

  const AdminRoutes = () => {
    return (
      <Routes>
        <Route element={<ProtectedAdminRoute />}>
          {/* Arahkan rute index admin ke log-transaksi */}
          <Route index element={<Navigate to="log-transaksi" replace />} /> 
          <Route path="log-transaksi" element={<LogTransaksi />} />
          <Route path="status-produk" element={<StatusProduk />} />
        </Route>
      </Routes>
    );
  };

  export default AdminRoutes;