import React, { useState, useEffect } from 'react';
// Import 'api' dari laluan yang betul relatif kepada 'src/Admin/pages/'
import api from '../../api';

// Tipe data dari API (findAllRentals)
interface RentalApiAdmin {
  id: number;
  userEmail: string;
  orderStatus: 'Menunggu_Tujuan_Anda' | 'Terkirim' | 'Anda_pinjam' | 'Selesai' | 'Dibatalkan';
  returnStatus: 'Belum_Dikembalikan' | 'Diajukan' | 'Diterima' | 'Selesai';
  items: {
      productId: number;
      productName: string;
      productImageUrl: string;
      unit: number;
  }[];
}

// Tipe data untuk UI
interface RentalStatusUI {
  rentalId: number;
  email: string;
  productName: string;
  productImage: string;
  rentCount: number;
  orderStatus: RentalApiAdmin['orderStatus'];
  returnStatus: RentalApiAdmin['returnStatus'];
}

// Opsi status untuk dropdown
const orderStatusOptions: RentalApiAdmin['orderStatus'][] = ['Menunggu_Tujuan_Anda', 'Terkirim', 'Anda_pinjam', 'Selesai', 'Dibatalkan'];
const returnStatusOptions: RentalApiAdmin['returnStatus'][] = ['Belum_Dikembalikan', 'Diajukan', 'Diterima', 'Selesai'];


const StatusProduk: React.FC = () => {
  const [rentals, setRentals] = useState<RentalStatusUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fungsi fetch data
  const fetchRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Panggil API GET /rentals (endpoint untuk admin)
      const response = await api.get<RentalApiAdmin[]>('/rentals');

      // Map data API ke UI
      const uiRentals = response.data.map(rental => {
        const firstItem = rental.items[0] || {}; // Ambil item pertama sebagai representasi
        return {
          rentalId: rental.id,
          email: rental.userEmail,
          productName: firstItem.productName || 'N/A', // Nama produk dari item pertama
          productImage: firstItem.productImageUrl || 'https://placehold.co/40x40/EEE/313131?text=?', // Gambar produk dari item pertama
          rentCount: rental.items.reduce((sum, item) => sum + item.unit, 0), // Hitung total unit dari semua item
          orderStatus: rental.orderStatus,
          returnStatus: rental.returnStatus,
        };
      });
      setRentals(uiRentals);

    } catch (err: any) {
      console.error("Gagal fetch data rental (Admin):", err);
      setError(err.response?.data?.message || 'Gagal memuat data penyewaan.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect untuk fetch data semasa muat komponen
  useEffect(() => {
    fetchRentals();
  }, []);

  // Fungsi untuk update status pesanan
  const handleOrderStatusChange = async (id: number, newStatus: RentalApiAdmin['orderStatus']) => {
    // Simpan status asal untuk rollback jika gagal
    const originalRentals = [...rentals];
    // Update UI secara optimistik
    setRentals(prevRentals =>
      prevRentals.map(r => (r.rentalId === id ? { ...r, orderStatus: newStatus } : r))
    );
    // Panggil API
    try {
      await api.put(`/rentals/${id}/order`, { newStatus });
      // Jika berjaya, tidak perlu buat apa-apa (UI sudah dikemaskini)
    } catch (err) {
      console.error("Gagal update status pesanan:", err);
      alert("Gagal mengemaskini status pesanan. Data akan dimuat semula.");
      setRentals(originalRentals); // Rollback UI
      // fetchRentals(); // Atau muat semula data dari server
    }
  };

  // Fungsi untuk update status pengembalian
  const handleReturnStatusChange = async (id: number, newStatus: RentalApiAdmin['returnStatus']) => {
    const originalRentals = [...rentals];
    setRentals(prevRentals =>
      prevRentals.map(r => (r.rentalId === id ? { ...r, returnStatus: newStatus } : r))
    );
    try {
      await api.put(`/rentals/${id}/return`, { newStatus });
    } catch (err) {
      console.error("Gagal update status pengembalian:", err);
      alert("Gagal mengemaskini status pengembalian. Data akan dimuat semula.");
      setRentals(originalRentals); // Rollback UI
      // fetchRentals(); // Atau muat semula data dari server
    }
  };

  // Tapis data berdasarkan carian
  const filteredRentals = rentals.filter(r =>
    (r.productName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
         {/* Menggunakan emoji untuk ikon */}
        <span role="img" aria-label="clipboard check" className="text-2xl">📋</span>
        Status Produk (Penyewaan)
      </h1>

       {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Cari Nama Produk atau Email Pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {/* Menggunakan emoji untuk ikon carian */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" role="img" aria-label="search icon">🔍</span>
        </div>
      </div>


      {/* Konten (Tabel Status) */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Pemuatan */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            {/* Menggunakan emoji untuk ikon pemuatan */}
            <span className="animate-spin text-blue-500 text-4xl" role="img" aria-label="loading">⏳</span>
          </div>
        )}
        {/* Ralat */}
        {error && (
          <div className="flex flex-col justify-center items-center h-64 text-red-600 p-4 text-center">
            {/* Menggunakan emoji untuk ikon ralat */}
            <span className="text-4xl mb-2" role="img" aria-label="error">⚠️</span>
            <span className="text-lg font-medium">Oops! Terjadi Kesalahan</span>
            <span className="text-sm">{error}</span>
          </div>
        )}
        {/* Jadual Data */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    E-mail Pengguna
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Produk Utama
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Total Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status Pesanan
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status Pengembalian
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Jika tiada data */}
                {filteredRentals.length === 0 && (
                   <tr>
                      <td colSpan={5} className="text-center p-8 text-gray-500">
                         Tidak ada data penyewaan yang ditemukan.
                      </td>
                   </tr>
                )}
                {/* Papar data */}
                {filteredRentals.map((rental) => (
                  <tr key={rental.rentalId} className="hover:bg-gray-50 transition-colors">
                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{rental.email || 'N/A'}</div>
                    </td>
                    {/* Produk Utama */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover bg-gray-100" // Guna rounded-md
                            src={rental.productImage}
                            alt={rental.productName}
                            // Fallback jika gambar gagal dimuat
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/EEE/313131?text=?')}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rental.productName}</div>
                        </div>
                      </div>
                    </td>
                    {/* Total Item */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 border border-gray-200 rounded-full px-3 py-1 inline-block bg-gray-50">
                        {rental.rentCount}
                      </div>
                    </td>
                    {/* Status Pesanan Dropdown */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <select
                        value={rental.orderStatus}
                        onChange={(e) => handleOrderStatusChange(rental.rentalId, e.target.value as RentalApiAdmin['orderStatus'])}
                        className="text-sm font-medium border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white py-1 px-2 appearance-none" // Styling dropdown
                      >
                        {orderStatusOptions.map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
                     {/* Status Pengembalian Dropdown */}
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <select
                        value={rental.returnStatus}
                        onChange={(e) => handleReturnStatusChange(rental.rentalId, e.target.value as RentalApiAdmin['returnStatus'])}
                         className="text-sm font-medium border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white py-1 px-2 appearance-none" // Styling dropdown
                      >
                         {returnStatusOptions.map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
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

export default StatusProduk;

