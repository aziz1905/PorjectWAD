import React from 'react';
import { Icon } from '@iconify/react';

// TODO: Ganti data ini dengan data asli dari API
const dummyStats = {
  pendapatan: 300000,
  penyewa: 3000,
  barangTersewa: 3000,
};

// TODO: Ganti data ini dengan data asli dari API
const dummyTransaksi = [
  { id: 'ax23213131', nama: 'Gaun Merah', jumlah: 3, status: 'Sedang Disewa', waktu: '10 Hari' },
  { id: '3sjaodoakoa', nama: 'Kemeja Hitam', jumlah: 0, status: 'Belum Disewa', waktu: '0 Hari' },
  { id: 'spdr-001', nama: 'Spiderman', jumlah: 1, status: 'Sedang Disewa', waktu: '3 Hari' },
];

const LogTransaksi = () => {
  // TODO: Tambahkan useEffect untuk fetch data log transaksi dari API backend

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon icon="mdi:chart-bar" />
          Log Transaksi
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Icon icon="mdi:refresh" />
          Refresh
        </button>
      </div>

      {/* Tabs (sesuai desain) */}
      <div className="flex border-b border-gray-300">
        <button className="py-2 px-4 text-blue-600 border-b-2 border-blue-600 font-semibold">Pendapatan Perbulan</button>
        <button className="py-2 px-4 text-gray-500 hover:text-gray-800">Total penyewa Perbulan</button>
        <button className="py-2 px-4 text-gray-500 hover:text-gray-800">Barang Yang Tersewa Perbulan</button>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="mdi:currency-idr" title="Pendapatan" value={`Rp ${dummyStats.pendapatan.toLocaleString('id-ID')}`} />
        <StatCard icon="mdi:account-group-outline" title="Total Penyewa" value={dummyStats.penyewa.toLocaleString('id-ID')} />
        <StatCard icon="mdi:package-variant-closed" title="Barang Tersewa" value={dummyStats.barangTersewa.toLocaleString('id-ID')} />
      </div>
      
      {/* Tabel Output Penyewaan */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Output Penyewaan</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">ID Produk</th>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Nama Barang</th>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Jumlah Disewa</th>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Status Barang</th>
                <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Waktu Penyewaan</th>
              </tr>
            </thead>
            <tbody>
              {dummyTransaksi.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700 font-mono">{item.id}</td>
                  <td className="p-3 text-sm text-gray-800 font-medium">{item.nama}</td>
                  <td className="p-3 text-sm text-gray-700">{item.jumlah}</td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Sedang Disewa' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{item.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Komponen kartu statistik (helper)
const StatCard = ({ icon, title, value }: { icon: string, title: string, value: string | number }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
    <div className="p-3 bg-gray-100 rounded-full">
      <Icon icon={icon} className="w-6 h-6 text-gray-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default LogTransaksi;