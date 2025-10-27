import React from 'react';
import { Icon } from '@iconify/react';

// TODO: Ganti data ini dengan data asli dari API
const dummyStatus = [
  { email: 'mas.amba@gmail.com', nama: 'Gaun Pesta Merah', jumlah: 1, status: 'Menunggu Tujuan Anda' },
  { email: 'mas.gato@gmail.com', nama: 'Spiderman', jumlah: 2, status: 'Anda Pinjam' },
];

const StatusProduk = () => {
  // TODO: Tambahkan useEffect untuk fetch data status produk dari API

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Icon icon="mdi:clipboard-list-outline" />
        Status Produk
      </h2>
      
      {/* Search Bar */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Cari Nama Produk atau Email Pengguna..." 
          className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Icon icon="mdi:magnify" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Tabel Status Produk */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">E-mail Pengguna</th>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Gambar & Nama Produk</th>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Jumlah Penyewaan</th>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Status Produk</th>
              </tr>
            </thead>
            <tbody>
              {dummyStatus.map((item) => (
                <tr key={item.email} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">{item.email}</td>
                  <td className="p-3 text-sm text-gray-800 font-medium">{item.nama}</td>
                  <td className="p-3 text-sm text-gray-700">
                    <input type="number" value={item.jumlah} readOnly className="w-16 p-1 border rounded-md text-center bg-gray-50" />
                  </td>
                  <td className="p-3 text-sm">
                    {/* TODO: Ganti ini dengan komponen Dropdown yang fungsional */}
                    <select className="p-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>{item.status}</option>
                      <option>Terkirim</option>
                      <option>Selesai</option>
                      <option>Dibatalkan</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusProduk;