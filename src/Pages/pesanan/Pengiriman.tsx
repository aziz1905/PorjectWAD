// src/Pages/pesanan/Pengiriman.tsx
import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { useNavigate } from 'react-router-dom';
// Ralat: '@iconify/react' tidak dapat diselesaikan. Import ini dialih keluar buat sementara waktu.
// import { Icon } from '@iconify/react'; 
import api from '../../api'; // 2. Import api (Path diandaikan betul)

// 3. Tipe data dari API (sesuai repository baru)
type RentalItemAPI = {
  id: number; // Rental ID
  orderStatus: 'Menunggu_Tujuan_Anda' | 'Terkirim' | 'Anda_pinjam' | 'Selesai' | 'Dibatalkan';
  returnStatus: 'Belum_Dikembalikan' | 'Diajukan' | 'Diterima' | 'Selesai';
  orderDate: string;
  items: {
    productId: number;
    productName: string;
    productImageUrl: string;
    duration: number;
    unit: number;
  }[];
};

// Tipe data untuk UI
type RentalItemUI = {
  rentalId: number;
  productId: number;
  name: string;
  imageUrl: string;
  status: 'shipping' | 'rented' | 'due' | 'returning' | 'unknown'; // Status UI
  orderStatusText: string;
  duration: number;
  unit: number;
};

// 4. Hapus dummyRentalItems

// 5. Fungsi mapping dari API ke UI
const mapApiToUI = (item: RentalItemAPI): RentalItemUI[] => {
  let status: RentalItemUI['status'] = 'unknown';
  let orderStatusText = 'Status Tidak Diketahui';

  // Logika status UI berdasarkan status backend
  if (item.returnStatus === 'Diajukan') {
    status = 'returning';
    orderStatusText = 'Pengembalian Diajukan';
  } else if (item.orderStatus === 'Menunggu_Tujuan_Anda') {
    status = 'shipping';
    orderStatusText = 'Perjalanan menuju Anda';
  } else if (item.orderStatus === 'Terkirim') {
    status = 'shipping'; // Anggap 'Terkirim' masih 'shipping'
    orderStatusText = 'Terkirim ke Alamat Anda';
  } else if (item.orderStatus === 'Anda_pinjam') {
    status = 'rented';
    orderStatusText = 'Sedang Anda Pinjam';
    // Logika untuk 'due' bisa ditambahkan jika ada tanggal jatuh tempo
  }

  // Map setiap produk di dalam satu rental
  return item.items.map(product => ({
    rentalId: item.id,
    productId: product.productId,
    name: product.productName,
    imageUrl: product.productImageUrl,
    status: status,
    orderStatusText: orderStatusText,
    duration: product.duration,
    unit: product.unit
  }));
};

const getStatusInfo = (status: RentalItemUI['status'], text: string) => {
  // Ralat: '@iconify/react' tidak tersedia. Menggunakan teks sebagai ganti ikon.
  switch (status) {
    case 'shipping':
      return { text: text, color: 'text-blue-500', icon: '🚚' }; // Menggunakan emoji
    case 'rented':
      return { text: text, color: 'text-green-600', icon: '✅' }; // Menggunakan emoji
    case 'due':
      return { text: 'Segera Kembalikan', color: 'text-yellow-500', icon: '⚠️' }; // Menggunakan emoji
    case 'returning':
      return { text: text, color: 'text-gray-500', icon: '📦' }; // Menggunakan emoji
    default:
      return { text: 'Status Tidak Diketahui', color: 'text-red-500', icon: '❓' }; // Menggunakan emoji
  }
};

const Pengiriman = () => {
  // 6. Ganti state untuk data API
  const [rentalItems, setRentalItems] = useState<RentalItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItemUI | null>(null);
  const navigate = useNavigate();

  // 7. useEffect untuk fetch data
  useEffect(() => {
    const fetchMyRentals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<RentalItemAPI[]>('/rentals/my-rentals');
        
        // Filter: Hanya yang statusnya BELUM selesai/diterima
        const activeRentals = response.data.filter(item => 
          item.returnStatus === 'Belum_Dikembalikan' || item.returnStatus === 'Diajukan'
        );

        // Map data API ke UI, dan ratakan (flatMap)
        const uiItems = activeRentals.flatMap(mapApiToUI);
        
        // Filter lagi di UI untuk memastikan hanya status aktif yang tampil
        const activeUiItems = uiItems.filter(item => 
          item.status === 'shipping' || item.status === 'rented' || item.status === 'due' || item.status === 'returning'
        );

        setRentalItems(activeUiItems);
      } catch (err: any) {
        console.error("Gagal mengambil data pengiriman:", err);
        setError(err.response?.data?.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRentals();
  }, []); // [] = jalankan sekali saat komponen dimuat

  // ... (handleOpenModal, handleCloseModal tetap sama) ...
   const handleOpenModal = (item: RentalItemUI) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // 8. Modifikasi handleConfirmReturn untuk mengirim ID yang benar
  const handleConfirmReturn = () => {
    if (selectedItem) {
      // Kirim data UI ke halaman pengembalian
      navigate('/detail-pengembalian', { state: { item: selectedItem } });
    }
    handleCloseModal();
  };

  // 9. Modifikasi getActionButton
  const getActionButton = (status: RentalItemUI['status'], item: RentalItemUI) => {
    const baseButtonClass = "px-4 py-2 text-sm font-semibold rounded-lg transition-colors";
    switch (status) {
      case 'shipping':
        // Logika batalkan pengiriman (jika ada API-nya)
        return <button disabled className={`${baseButtonClass} bg-gray-200 text-gray-500 cursor-not-allowed`}>Batalkan (WIP)</button>;
      case 'rented':
      case 'due':
        return <button onClick={() => handleOpenModal(item)} className={`${baseButtonClass} bg-blue-600 text-white hover:bg-blue-700`}>Kembalikan sekarang!</button>;
      case 'returning':
        return <span className="text-sm text-gray-400">Dalam proses</span>;
      default:
        return null;
    }
  };

  // 10. Tambahkan render loading/error
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Memuat data pengiriman...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (rentalItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        {/* Ralat: '@iconify/react' tidak tersedia. Menggunakan emoji sebagai ganti ikon. */}
        <span className="text-6xl mx-auto mb-4" role="img" aria-label="package">📦</span> 
        <h2 className="text-2xl font-semibold mb-2">Tidak Ada Pengiriman Aktif</h2>
        <p>Semua pesanan Anda yang sedang berjalan akan tampil di sini.</p>
      </div>
    );
  }

  return (
    <>
      {/* Header Tabel (Tetap sama) */}
      <div className="hidden md:grid grid-cols-[3fr_1.5fr_1fr_0.7fr_0.2fr] items-center gap-4 px-6 py-3 border-b-2 border-gray-200 font-semibold text-gray-600 bg-gray-50 rounded-t-lg">
        <span className="text-left">Produk & Gambar</span>
        <span className="text-center">Status</span>
        <span className="text-center">Durasi Sewa</span>
        <span className="text-right">Respons</span>
      </div>
      {/* Daftar Item Peminjaman */}
      <div className="space-y-4 mt-4 md:mt-0">
        {rentalItems.map(item => {
          // 11. Gunakan rentalId + productId sebagai key unik
          const key = `${item.rentalId}-${item.productId}`;
          const statusInfo = getStatusInfo(item.status, item.orderStatusText);
          const actionButton = getActionButton(item.status, item);
          return (
            <div key={key} className="grid grid-cols-1 md:grid-cols-[3fr_1.5fr_1fr_1fr] items-center gap-4 bg-white p-4 shadow rounded-lg border border-gray-100">
              {/* Kolom 1: Gambar & Nama */}
              <div className="flex items-center gap-4 text-left">
                <img src={item.imageUrl} alt={item.name} className="bg-gray-100 rounded-lg h-16 w-16 object-cover flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">{item.name}</span>
                  <span className="text-sm text-gray-500 block"> (x{item.unit})</span>
                </div>
              </div>
              {/* Kolom 2: Status */}
              <div className="flex justify-center items-center gap-2 text-center">
                 {/* Ralat: '@iconify/react' tidak tersedia. Menggunakan emoji sebagai ganti ikon. */}
                <span className={`${statusInfo.color} w-5 h-5`} role="img" aria-label="status icon">{statusInfo.icon}</span> 
                <span className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
              </div>
              {/* Kolom 3: Durasi */}
              <div className="text-center text-gray-600">{item.duration} Hari</div>
              {/* Kolom 4: Tombol Aksi */}
              <div className="text-right">
                {actionButton}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Popup (Tetap sama) */}
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

