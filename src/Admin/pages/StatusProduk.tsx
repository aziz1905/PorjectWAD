import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// Data Mock untuk Status Produk (karena API belum ada)
interface RentalStatus {
  id: string;
  email: string;
  productName: string;
  productImage: string;
  rentCount: number;
  status: 'Menuju Tujuan' | 'Anda Pinjam' | 'Selesai' | 'Dibatalkan';
}

const mockData: RentalStatus[] = [
  { id: 'tx-1', email: 'mas.amba@gmail.com', productName: 'Gaun Pesta Merah', productImage: 'https://placehold.co/40x40/E8BFBF/4F0000?text=G', rentCount: 1, status: 'Menuju Tujuan' },
  { id: 'tx-2', email: 'mas.getot@gmail.com', productName: 'Spiderman', productImage: 'https://placehold.co/40x40/BFBFE8/000A4F?text=S', rentCount: 2, status: 'Anda Pinjam' },
  { id: 'tx-3', email: 'user.baru@gmail.com', productName: 'Baju Adat Jawa', productImage: 'https://placehold.co/40x40/E8D4BF/4F2A00?text=B', rentCount: 1, status: 'Selesai' },
];


const StatusProduk: React.FC = () => {
  const [rentals, setRentals] = useState<RentalStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulasi fetch data
  useEffect(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // TODO: Ganti dengan API call ke endpoint transaksi/sewa jika sudah ada
      setRentals(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Fungsi untuk update status (MOCK)
  const handleStatusChange = (id: string, newStatus: RentalStatus['status']) => {
    setRentals(prevRentals =>
      prevRentals.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };
  
  const filteredRentals = rentals.filter(r =>
    r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Status Produk (Penyewaan)</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Cari Nama Produk atau Email Pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Konten (Tabel Status) */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Icon icon="mdi:loading" className="animate-spin text-blue-500 w-12 h-12" />
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center h-64 text-red-500">
            <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 mr-4" />
            <span className="text-lg">{error || 'Gagal memuat data.'}</span>
          </div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    E-mail Pengguna
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Gambar & Nama Produk
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status Produk
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{rental.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={rental.productImage} 
                            alt={rental.productName} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rental.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 border rounded-lg px-3 py-1 inline-block">
                        {rental.rentCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {/* Dropdown untuk ganti status */}
                      <select
                        value={rental.status}
                        onChange={(e) => handleStatusChange(rental.id, e.target.value as RentalStatus['status'])}
                        className="text-sm font-medium border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Menuju Tujuan">Menuju Tujuan</option>
                        <option value="Anda Pinjam">Anda Pinjam</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && filteredRentals.length === 0 && (
           <div className="text-center p-16 text-gray-500">
             Tidak ada data penyewaan yang ditemukan.
           </div>
        )}
      </div>
    </div>
  );
};

export default StatusProduk;