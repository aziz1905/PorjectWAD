// src/Pages/DetailPengembalian.tsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

// Buat interface sederhana untuk data yang kita harapkan
interface RentalItem {
  id: string;
  name: string;
  imageUrl: string;
}

const DetailPengembalian = () => {
  const location = useLocation();
  // Ambil data 'item' yang dikirim dari 'navigate'
  const { item } = (location.state || {}) as { item?: RentalItem };

  // Jika halaman ini diakses langsung tanpa data, tampilkan pesan error
  if (!item) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error: Item Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">
          Data kostum yang akan dikembalikan tidak ditemukan. Silakan kembali ke halaman pesanan.
        </p>
        <Link 
          to="/pesanan/pengiriman" // Arahkan kembali ke halaman pengiriman
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  // Jika item ada, tampilkan halaman pengembalian
  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Icon icon="mdi:package-variant-closed-check" className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Instruksi Pengembalian</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Harap ikuti instruksi di bawah ini untuk mengembalikan kostum Anda.
        </p>

        {/* Detail Item yang Dikembalikan */}
        <div className="border rounded-lg p-4 flex items-center gap-4 mb-6">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-20 h-20 rounded-md object-cover bg-gray-100"
          />
          <div>
            <p className="text-sm text-gray-500">Item ID: {item.id}</p>
            <p className="text-lg font-semibold text-gray-900">{item.name}</p>
          </div>
        </div>

        {/* Instruksi Dummy */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Instruksi Pengiriman:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Pastikan kostum dalam keadaan bersih dan kering.</li>
            <li>Lipat dan kemas kostum dengan rapi di dalam kotak aslinya.</li>
            <li>Tempelkan label pengiriman di bawah ini di luar kotak.</li>
            <li>Serahkan paket ke agen pengiriman (JNE/J&T) terdekat sebelum 3 hari.</li>
          </ol>

          {/* Kode Pengiriman Dummy */}
          <div className="text-center p-6 bg-gray-100 rounded-lg mt-6">
            <p className="text-sm text-gray-600 mb-2">Tempelkan Kode Ini di Paket Anda:</p>
            <div className="flex justify-center items-center">
               <Icon icon="mdi:barcode-scan" className="w-32 h-32 text-gray-800" />
            </div>
            <p className="text-2xl font-bold tracking-widest text-gray-900 mt-2">
              KMB-{item.id}-001
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/pesanan/histori" 
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Saya Sudah Mengirimkan Paket
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default DetailPengembalian;