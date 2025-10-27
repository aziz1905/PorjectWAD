// src/Pages/pesanan/Pengiriman.tsx
import React, { useState } from 'react';
import Products from '../../data/Produk';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

type RentalStatus = 'shipping' | 'rented' | 'due' | 'returning';

type RentalItem = {
  id: string;
  name: string;
  imageUrl: string;
  status: RentalStatus;
  duration: number; // Durasi sewa dalam hari
};

const dummyRentalItems: RentalItem[] = [
  { id: '1', name: Products[0].name, imageUrl: Products[0].imageUrl, status: 'shipping', duration: 5 },
  { id: '2', name: Products[1].name, imageUrl: Products[1].imageUrl, status: 'rented', duration: 3 },
  { id: '3', name: Products[2].name, imageUrl: Products[2].imageUrl, status: 'due', duration: 7 },
  { id: '4', name: Products[3].name, imageUrl: Products[3].imageUrl, status: 'returning', duration: 2 },
];

const getStatusInfo = (status: RentalStatus) => {
  switch (status) {
    case 'shipping':
      return { text: 'Perjalanan menuju Anda', color: 'text-blue-500' };
    case 'rented':
      return { text: 'Anda Pinjam', color: 'text-green-600' };
    case 'due':
      return { text: 'Segera Kembalikan', color: 'text-yellow-500' };
    case 'returning':
      return { text: 'Pengiriman Kembali ke Toko', color: 'text-gray-500' };
    default:
      return { text: 'Status Tidak Diketahui', color: 'text-red-500' };
  }
};

const Pengiriman = () => {
  const [rentalItems, setRentalItems] = useState<RentalItem[]>(dummyRentalItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const navigate = useNavigate();

  const handleOpenModal = (item: RentalItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmReturn = () => {
    if (selectedItem) {
      navigate('/detail-pengembalian', { state: { item: selectedItem } });
    }
    handleCloseModal();
  };

  const getActionButton = (status: RentalStatus, item: RentalItem) => {
    const baseButtonClass = "px-4 py-2 text-sm font-semibold rounded-lg transition-colors";
    switch (status) {
      case 'shipping':
        return <button className={`${baseButtonClass} bg-red-100 text-red-700 hover:bg-red-200`}>Batalkan Pengiriman</button>;
      case 'rented':
      case 'due':
        return <button onClick={() => handleOpenModal(item)} className={`${baseButtonClass} bg-blue-600 text-white hover:bg-blue-700`}>Kembalikan sekarang!</button>;
      case 'returning':
        return <span className="text-sm text-gray-400">Dalam proses</span>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header Tabel - Menggunakan Grid dengan alignment */}
      <div className="hidden md:grid grid-cols-[3fr_1.5fr_1fr_0.7fr_0.2fr] items-center gap-4 px-6 py-3 border-b-2 border-gray-200 font-semibold text-gray-600 bg-gray-50 rounded-t-lg">
        <span className="text-left">Produk & Gambar</span>
        <span className="text-center">Status</span>
        <span className="text-center">Durasi Sewa</span>
        <span className="text-right">Respons</span>
      </div>
      {/* Daftar Item Peminjaman */}
      <div className="space-y-4 mt-4 md:mt-0">
        {rentalItems.map(item => {
          const statusInfo = getStatusInfo(item.status);
          const actionButton = getActionButton(item.status, item);
          return (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr_1fr] items-center gap-4 bg-white p-4 shadow rounded-lg border border-gray-100">
              {/* Kolom 1: Gambar & Nama (rata kiri) */}
              <div className="flex items-center gap-4 text-left">
                <img src={item.imageUrl} alt={item.name} className="bg-gray-100 rounded-lg h-16 w-16 object-cover flex-shrink-0" />
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>
              {/* Kolom 2: Status (rata tengah) */}
              <div className="flex justify-center items-center gap-2 text-center">
                {item.status === 'rented' && <Icon icon="mdi:check-circle" className="text-green-600 w-5 h-5" />}
                {item.status === 'due' && <Icon icon="mdi:alert-circle" className="text-yellow-500 w-5 h-5" />}
                {item.status === 'shipping' && <Icon icon="mdi:truck-fast-outline" className="text-blue-500 w-5 h-5" />}
                {item.status === 'returning' && <Icon icon="mdi:package-variant-closed-check" className="text-gray-500 w-5 h-5" />}
                <span className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
              </div>
              {/* Kolom 3: Durasi (rata tengah) */}
              <div className="text-center text-gray-600">{item.duration} Hari</div>
              {/* Kolom 4: Tombol Aksi / Respons (rata kanan) */}
              <div className="text-right">
                {actionButton}
              </div>
            </div>
          );
        })}
      </div>
      {/* Modal Popup */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Pengembalian</h2>
            <p className="mb-6">Anda akan mengembalikan kostum: <span className="font-semibold">{selectedItem.name}</span>. <br/><br/> Apakah Anda yakin ingin melanjutkan?</p>
            <div className="flex justify-end gap-4">
              <button onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Batal</button>
              <button onClick={handleConfirmReturn} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Ya, Kembalikan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pengiriman;


