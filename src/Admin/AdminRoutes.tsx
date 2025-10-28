import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Path ke AuthContext mungkin perlu disesuaikan

// Import komponen Layout dan Halaman dari folder Admin
// Pastikan path ke AdminLayout benar
import AdminLayout from './AdminLayout';
import LogTransaksi from './pages/LogTransaksi';
import StatusProduk from './pages/StatusProduk';
import EditProduk from './pages/EditProduk'; // Halaman list produk

// Komponen ProtectedAdminRoute tetap sama
const ProtectedAdminRoute = () => {
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    return <AdminLayout />;
  }
  return <Navigate to="/" replace />;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedAdminRoute />}>
        {/* Rute index default -> Log Transaksi */}
        <Route index element={<Navigate to="log-transaksi" replace />} />

        {/* Halaman-halaman admin */}
        {/* /admin/edit-produk akan menampilkan list produk (EditProduk.tsx) */}
        <Route path="edit-produk" element={<EditProduk />} />
        <Route path="log-transaksi" element={<LogTransaksi />} />
        <Route path="status-produk" element={<StatusProduk />} />

        {/* Rute fallback jika path admin tidak cocok */}
        <Route path="*" element={<Navigate to="log-transaksi" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
