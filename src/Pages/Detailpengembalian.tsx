

// src/Pages/DetailPengembalian.tsx
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import api from '../api';

interface RentalItemUI {
  rentalId: number;
  productId: number;
  name: string;
  imageUrl: string;
}

const DetailPengembalian = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = (location.state || {}) as { item?: RentalItemUI };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitPengembalian = async () => {
    if (!item) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/rentals/${item.rentalId}/submit-return`);
      alert("Pengajuan pengembalian berhasil!");
      navigate('/pesanan/histori');
    } catch (err: any) {
      console.error("Gagal submit pengembalian:", err);
      setError(err.response?.data?.message || 'Gagal memproses pengajuan pengembalian.');
      setIsLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error: Item Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">
          Data kostum yang akan dikembalikan tidak ditemukan. Silakan kembali ke halaman pesanan.
        </p>
        <Link
          to="/pesanan/pengiriman"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Icon icon="mdi:package-variant-closed-check" className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Instruksi Pengembalian</h1>
        </div>
        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Harap ikuti instruksi di bawah ini untuk mengembalikan kostum Anda.
        </p>
        {/* Detail Item */}
        <div className="border rounded-lg p-4 flex items-center gap-4 mb-6">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-20 h-20 rounded-md object-cover bg-gray-100"
          />
          <div>
            <p className="text-sm text-gray-500">Rental ID: {item.rentalId} / Produk ID: {item.productId}</p>
            <p className="text-lg font-semibold text-gray-900">{item.name}</p>
          </div>
        </div>
        {/* Instruksi */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Instruksi Pengiriman:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Pastikan kostum dalam keadaan bersih dan kering.</li>
            <li>Lipat dan kemas kostum dengan rapi di dalam kotak aslinya.</li>
            <li>Tempelkan label pengiriman di bawah ini di luar kotak.</li>
            <li>Serahkan paket ke agen pengiriman (JNE/J&T) terdekat sebelum 3 hari.</li>
          </ol>
          {/* Barcode */}
          <div className="text-center p-6 bg-gray-100 rounded-lg mt-6">
            <p className="text-sm text-gray-600 mb-2">Tempelkan Kode Ini di Paket Anda:</p>
            <div className="flex justify-center items-center">
              <Icon icon="mdi:barcode-scan" className="w-32 h-32 text-gray-800" />
            </div>
            <p className="text-2xl font-bold tracking-widest text-gray-900 mt-2">
              KMB-{item.rentalId}-00{item.productId}
            </p>
          </div>
        </div>
        {/* Error message */}
        {error && (
          <div className="text-center text-red-600 bg-red-50 p-3 rounded-md mt-6">{error}</div>
        )}
        {/* Tombol Aksi */}
        <div className="text-center mt-8">
          <button
            onClick={handleSubmitPengembalian}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Memproses...' : 'Saya Sudah Mengirimkan Paket'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPengembalian;


