import React, { useState, useEffect } from 'react';
// Pastikan @iconify/react dipasang: npm install @iconify/react
import { Icon } from '@iconify/react';
// Laluan ini sepatutnya betul jika api.ts berada di dalam folder src
import api from '../../api';

// Interfaces (Tetap sama)
interface TransactionSummary {
  monthlyIncome: number;
  monthlyRenters: number;
  monthlyItemsRented: number;
}
interface RentalApiAdmin {
  id: number;
  userEmail: string;
  orderStatus: string;
  returnStatus: string;
  orderDate: string;
  items: { productId: number; productName: string; productImageUrl: string; unit: number; duration: number; }[];
}
interface TransactionItemUI {
  id: string; nama: string; email: string; jumlah: number; status: string; waktu: string;
}

const LogTransaksi: React.FC = () => {
  // State (Tetap sama)
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [transactions, setTransactions] = useState<TransactionItemUI[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data (Tetap sama)
  const fetchData = async () => {
    setLoadingSummary(true); setLoadingTransactions(true); setError(null);
    try {
      const [summaryResponse, transactionsResponse] = await Promise.all([
        api.get<TransactionSummary>('/rentals/summary'),
        api.get<RentalApiAdmin[]>('/rentals') // Ambil semua rental untuk admin
      ]);
      setSummary(summaryResponse.data);

      // Ubah data API ke format UI
      const uiTransactions = transactionsResponse.data.flatMap(rental =>
        rental.items.map(item => ({
          id: `${rental.id}-${item.productId}`, // Gabungkan ID rental dan produk
          nama: item.productName,
          email: rental.userEmail, // Ambil email dari data rental
          jumlah: item.unit,
          // Logik status yang lebih baik: Prioritaskan status pengembalian jika bukan 'Belum_Dikembalikan'
          status: rental.returnStatus !== 'Belum_Dikembalikan'
                    ? rental.returnStatus.replace(/_/g, ' ') // Tampilkan status pengembalian
                    : rental.orderStatus.replace(/_/g, ' '), // Jika belum dikembalikan, tampilkan status pesanan
          waktu: `${item.duration} hari`
        }))
      );
      setTransactions(uiTransactions);

    } catch (err: any) {
      console.error("Gagal fetch data log transaksi:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data.';
      setError(errorMessage); setSummary(null); setTransactions([]);
    } finally {
      setLoadingSummary(false); setLoadingTransactions(false);
    }
  };

  // useEffect (Tetap sama)
  useEffect(() => { fetchData(); }, []);

  // Helpers (Tetap sama)
  const formatCurrency = (value: number | undefined | null): string => {
     if (typeof value !== 'number' || isNaN(value)) return 'Rp 0';
     return `Rp ${value.toLocaleString('id-ID')}`;
  };
  const formatCount = (value: number | undefined | null): string => {
     if (typeof value !== 'number' || isNaN(value)) return '0';
     return value.toLocaleString('id-ID');
  };

  return (
     <div className="space-y-6">
      {/* Header Halaman (Tetap sama) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon icon="mdi:chart-bar" className="w-6 h-6" /> Log Transaksi
        </h2>
        <button
           onClick={fetchData} disabled={loadingSummary || loadingTransactions}
           className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
         >
          <Icon icon={loadingSummary || loadingTransactions ? "mdi:loading" : "mdi:refresh"} className={`w-5 h-5 ${loadingSummary || loadingTransactions ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs (Tetap sama) */}
       <div className="flex border-b border-gray-300">
        <button className="py-2 px-4 text-blue-600 border-b-2 border-blue-600 font-semibold">Pendapatan Perbulan</button>
        <button className="py-2 px-4 text-gray-500 hover:text-gray-800">Total penyewa Perbulan</button>
        <button className="py-2 px-4 text-gray-500 hover:text-gray-800">Barang Yang Tersewa Perbulan</button>
      </div>

      {/* Ringkasan Statistik (Tetap sama) */}
      {loadingSummary && <p className="text-center text-gray-500 py-4">Memuat ringkasan...</p>}
      {!loadingSummary && error && !summary && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
      {!loadingSummary && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon="mdi:currency-idr" title="Pendapatan Bulan Ini" value={formatCurrency(summary.monthlyIncome)} />
          <StatCard icon="mdi:account-group-outline" title="Total Penyewa Bulan Ini" value={formatCount(summary.monthlyRenters)} />
          <StatCard icon="mdi:package-variant-closed" title="Barang Tersewa Bulan Ini" value={formatCount(summary.monthlyItemsRented)} />
        </div>
      )}

      {/* Tabel Output Penyewaan (Tetap sama) */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Output Penyewaan Terbaru</h3>
        {loadingTransactions && <p className="text-center text-gray-500 py-4">Memuat transaksi...</p>}
        {!loadingTransactions && error && transactions.length === 0 && <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>}
        {!loadingTransactions && !error && (
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                <tr>
                    {/* Sesuaikan header */}
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">ID Sewa-Produk</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Email Penyewa</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Nama Barang</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase text-center">Jumlah</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Status</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Lama Sewa</th>
                </tr>
                </thead>
                <tbody>
                {/* Tampilan jika kosong */}
                {transactions.length === 0 && !loadingTransactions && (
                    <tr><td colSpan={6} className="text-center p-6 text-gray-500">Belum ada data transaksi.</td></tr>
                )}
                {/* Map data transaksi */}
                {transactions.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700 font-mono">{item.id}</td>
                    <td className="p-3 text-sm text-gray-700">{item.email}</td>
                    <td className="p-3 text-sm text-gray-800 font-medium">{item.nama}</td>
                    <td className="p-3 text-sm text-gray-700 text-center">{item.jumlah}</td>
                    <td className="p-3 text-sm">
                        {/* Styling status */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            // Status Selesai / Dikembalikan
                            item.status === 'Selesai' || item.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                            // Status Dibatalkan
                            item.status === 'Dibatalkan' ? 'bg-red-100 text-red-800' :
                            // Status Aktif Dipinjam / Perlu Dikembalikan
                            item.status === 'Anda pinjam' || item.status === 'Diajukan' ? 'bg-yellow-100 text-yellow-800' :
                            // Status Pengiriman / Menunggu
                            'bg-blue-100 text-blue-800'
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
        )}
      </div>
    </div>
  );
};

// StatCard (Tetap sama)
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

