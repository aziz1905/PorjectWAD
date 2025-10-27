import React from 'react';
import { Icon } from '@iconify/react';
import api from '../../api'; // 2. Import api instance

// 3. Define interfaces for API data
interface TransactionSummary {
  monthlyIncome: number;
  monthlyRenters: number;
  monthlyItemsRented: number;
}

interface TransactionItem {
  id: string | number; // Product ID or Rental ID
  nama: string;
  jumlah: number;
  status: string;
  waktu: string; // Duration string
}

const LogTransaksi: React.FC = () => {
  // 4. State for API data, loading, and errors
  const [summary, setSummary] = React.useState<TransactionSummary | null>(null);
  const [transactions, setTransactions] = React.useState<TransactionItem[]>([]);
  const [loadingSummary, setLoadingSummary] = React.useState(true);
  const [loadingTransactions, setLoadingTransactions] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 5. Function to fetch data
  const fetchData = async () => {
    setLoadingSummary(true);
    setLoadingTransactions(true);
    setError(null);
    try {
      // Fetch summary and transactions in parallel
      // TEMAN ANDA PERLU MEMBUAT ENDPOINT INI DI BACKEND:
      // GET /rentals/summary -> mengembalikan TransactionSummary
      // GET /rentals -> mengembalikan TransactionItem[]
      const [summaryResponse, transactionsResponse] = await Promise.all([
        api.get<TransactionSummary>('/rentals/summary'), // Endpoint summary
        api.get<TransactionItem[]>('/rentals')           // Endpoint list rentals
      ]);
      setSummary(summaryResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (err: any) {
      console.error("Gagal fetch data log transaksi:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Gagal memuat data.';
      setError(errorMessage);
      setSummary(null); // Reset data on error
      setTransactions([]);
    } finally {
      setLoadingSummary(false);
      setLoadingTransactions(false);
    }
  };

  // 6. useEffect to fetch data on mount
  React.useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means run once on mount

  // Helper to format currency
  const formatCurrency = (value: number | undefined | null) => {
     if (value === undefined || value === null) return 'Rp 0';
     // Pastikan value adalah angka sebelum toLocaleString
     const numericValue = Number(value);
     if (isNaN(numericValue)) return 'Rp ?';
     return `Rp ${numericValue.toLocaleString('id-ID')}`;
  };

   // Helper to format count
  const formatCount = (value: number | undefined | null) => {
     if (value === undefined || value === null) return '0';
      // Pastikan value adalah angka sebelum toLocaleString
     const numericValue = Number(value);
     if (isNaN(numericValue)) return '?';
     return numericValue.toLocaleString('id-ID');
  };

  return (
     <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon icon="mdi:chart-bar" />
          Log Transaksi
        </h2>
        {/* Make refresh button functional */}
        <button
           onClick={fetchData} // Call fetchData on click
           disabled={loadingSummary || loadingTransactions} // Disable while loading
           className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
         >
          {/* Ganti ikon saat loading */}
          <Icon icon={loadingSummary || loadingTransactions ? "mdi:loading" : "mdi:refresh"} className={loadingSummary || loadingTransactions ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs (remain the same for now) */}
      <div className="flex border-b border-gray-300">
        <button className="py-2 px-4 text-blue-600 border-b-2 border-blue-600 font-semibold">Pendapatan Perbulan</button>
        {/* Add onClick handlers later if needed */}
        <button className="py-2 px-4 text-gray-500 hover:text-gray-800">Total penyewa Perbulan</button>
        <button className="py-2 px-4 text-gray-500 hover:text-gray-800">Barang Yang Tersewa Perbulan</button>
      </div>

      {/* Ringkasan Statistik - Use data from state */}
      {/* Tampilkan loading atau error jika data belum siap */}
      {loadingSummary && <p className="text-center text-gray-500 py-4">Memuat ringkasan...</p>}
      {!loadingSummary && error && !summary && (
         <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>
      )}
      {!loadingSummary && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon="mdi:currency-idr" title="Pendapatan Bulan Ini" value={formatCurrency(summary.monthlyIncome)} />
          <StatCard icon="mdi:account-group-outline" title="Total Penyewa Bulan Ini" value={formatCount(summary.monthlyRenters)} />
          <StatCard icon="mdi:package-variant-closed" title="Barang Tersewa Bulan Ini" value={formatCount(summary.monthlyItemsRented)} />
        </div>
      )}

      {/* Tabel Output Penyewaan - Use data from state */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Output Penyewaan Terbaru</h3>
        {/* Tampilkan loading atau error jika data belum siap */}
        {loadingTransactions && <p className="text-center text-gray-500 py-4">Memuat transaksi...</p>}
        {!loadingTransactions && error && transactions.length === 0 && (
             <p className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</p>
        )}
        {!loadingTransactions && !error && (
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                <tr>
                    {/* Sesuaikan header tabel jika perlu */}
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">ID Produk/Sewa</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Nama Barang</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase text-center">Jumlah</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Status</th>
                    <th className="p-3 text-sm font-semibold text-gray-600 uppercase">Lama Sewa</th>
                </tr>
                </thead>
                <tbody>
                {/* Map over transactions state */}
                {transactions.length === 0 && !loadingTransactions && (
                    <tr><td colSpan={5} className="text-center p-6 text-gray-500">Belum ada data transaksi.</td></tr>
                )}
                {transactions.map((item, index) => ( // Gunakan index sebagai bagian key untuk keamanan
                    <tr key={`${item.id}-${index}`} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700 font-mono">{item.id}</td>
                    <td className="p-3 text-sm text-gray-800 font-medium">{item.nama}</td>
                    <td className="p-3 text-sm text-gray-700 text-center">{item.jumlah}</td>
                    <td className="p-3 text-sm">
                        {/* Dynamic status styling */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            // Sesuaikan class berdasarkan kemungkinan nilai status dari API
                            item.status === 'Sedang Disewa' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'Selesai Dikembalikan' || item.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                            item.status === 'Dibatalkan' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800' // Default/pending/Menunggu
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

// Komponen StatCard (helper - tidak berubah)
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
