import React, { useState } from 'react';
import Products from '../../data/Produk';

type RentalStatus = 'shipping' | 'rented' | 'due' | 'returning';

type RentalItem = {
  id: string;
  name: string;
  imageUrl: string;
  status: RentalStatus;
};

const dummyRentalItems: RentalItem[] = [
  { id: '1', name: Products[0].name, imageUrl: Products[0].imageUrl, status: 'shipping' },
  { id: '2', name: Products[1].name, imageUrl: Products[1].imageUrl, status: 'rented' },
  { id: '3', name: Products[2].name, imageUrl: Products[2].imageUrl, status: 'due' },
  { id: '4', name: Products[3].name, imageUrl: Products[3].imageUrl, status: 'returning' },
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

const getActionButton = (status: RentalStatus, itemId: string) => {
  const baseButtonClass = "px-4 py-2 text-sm font-semibold rounded-lg transition-colors";
  
  switch (status) {
    case 'shipping':
      return <button className={`${baseButtonClass} bg-red-100 text-red-700 hover:bg-red-200`}>Batalkan Pengiriman</button>;
    case 'rented':
    case 'due':
      return <button className={`${baseButtonClass} bg-blue-600 text-white hover:bg-blue-700`}>Kembalikan sekarang!</button>;
    case 'returning':
      return <span className="text-sm text-gray-400">Dalam proses</span>; // Tidak ada aksi
    default:
      return null;
  }
};


const Pengiriman = () => {
  const [rentalItems, setRentalItems] = useState<RentalItem[]>(dummyRentalItems);

  return (
    <>
      {/* Header Tabel */}
      <div className="pengiriman-header">
        <span>Gambar & Nama Produk</span>
        <span>Status</span>
        <span>Respons</span>
      </div>

      {/* Daftar Item Peminjaman */}
      <div className="space-y-4">
        {rentalItems.map(item => {
          const statusInfo = getStatusInfo(item.status);
          const actionButton = getActionButton(item.status, item.id);

          return (
            <div key={item.id} className="pengiriman-item">
              {/* Kolom 1: Gambar & Nama */}
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="bg-gray-100 rounded-lg h-16 w-16 object-cover" />
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>

              {/* Kolom 2: Status */}
              <div className="flex justify-center gap-2">
                <span className={`h-3 w-3 rounded-full ${statusInfo.color.replace('text', 'bg')}`}></span>
                <span className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
              </div>
              
              {/* Kolom 3: Tombol Aksi / Respons */}
              <div className="text-right pr-15">
                {actionButton}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pengiriman;