import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Outlet untuk merender halaman
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import TambahProdukPopup from './TambahProdukPopup';

const AdminLayout = () => {
  // State untuk mengontrol popup
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk membuka popup (diteruskan ke Sidebar)
  const handleOpenModal = () => setIsModalOpen(true);
  // Fungsi untuk menutup popup (diteruskan ke Popup)
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans"> {/* Pastikan font konsisten */}
      {/* Sidebar */}
      <Sidebar onTambahProdukClick={handleOpenModal} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Admin */}
        <AdminHeader />

        {/* Konten Halaman (LogTransaksi atau StatusProduk) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 md:p-8">
          {/* Outlet akan merender komponen Rute yang cocok */}
          <Outlet /> 
        </main>
      </div>

      {/* Popup Tambah Produk (ditampilkan kondisional) */}
      {isModalOpen && (
        <TambahProdukPopup onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AdminLayout;