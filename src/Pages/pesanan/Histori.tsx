import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react'; // Import Iconify dikekalkan
import RatingModal from '../../components/Comp_Rating'; // Laluan import dibetulkan
import api from '../../api'; // Laluan import dibetulkan

// Tipe data dari API (Sama seperti Pengiriman.tsx)
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
type HistoryItemUI = {
  rentalId: number;
  productId: number;
  name: string;
  imageUrl: string;
  rentalStartDate: Date; // Kita akan gunakan orderDate
  rentalEndDate: Date; // Kita akan gunakan orderDate + duration (estimasi)
  userRating?: number; // TODO: API review harus di-link ke sini
};

const formatDateRange = (start: Date, end: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const startDate = start.toLocaleString('id-ID', options);
  const endDate = end.toLocaleString('id-ID', options);
  const year = start.getFullYear();
  return `${startDate} - ${endDate} ${year}`;
};

const Histori = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItemUI | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<RentalItemAPI[]>('/rentals/my-rentals');
        const completedRentals = response.data.filter(item =>
          item.returnStatus === 'Diterima' || item.returnStatus === 'Selesai' || item.orderStatus === 'Dibatalkan'
        );
        const uiItems = completedRentals.flatMap(item => {
          const startDate = new Date(item.orderDate);
          return item.items.map(product => {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + product.duration);
            return {
              rentalId: item.id,
              productId: product.productId,
              name: product.productName,
              imageUrl: product.productImageUrl,
              rentalStartDate: startDate,
              rentalEndDate: endDate,
              userRating: undefined // TODO: Hubungkan ke API review
            };
          });
        });
        setHistoryItems(uiItems);
      } catch (err: any) {
        console.error("Gagal mengambil data histori:", err);
        setError(err.response?.data?.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleOpenModal = (item: HistoryItemUI) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmitRatingSuccess = (productId: string | number, newRating: number) => {
    setHistoryItems(currentItems =>
      currentItems.map(item =>
        item.productId.toString() === productId.toString()
          ? { ...item, userRating: newRating }
          : item
      )
    );
    handleCloseModal();
  };

  const DisplayRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center justify-center gap-1 text-lg">
      <span className="font-bold text-gray-700">{rating}</span>
      <Icon icon="ic:round-star" className="text-yellow-400" />
    </div>
  );

  const RatingButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
    >
      Beri Rating
    </button>
  );

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Memuat data histori...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (historyItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <Icon icon="mdi:history" className="text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Riwayat Pesanan Kosong</h2>
        <p>Semua pesanan Anda yang telah selesai akan tampil di sini.</p>
      </div>
    );
  }

  return (
    <>
      <div className="histori-header">
        <span>Gambar & Nama Produk</span>
        <span>Waktu Sewa</span>
        <span>Rating</span>
      </div>

      <div className="space-y-4">
        {historyItems.map(item => {
          const key = `${item.rentalId}-${item.productId}`;
          return (
            <div key={key} className="histori-item">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="bg-gray-100 rounded-lg h-16 w-16 object-cover" />
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>
              <div className="text-center text-gray-600">
                {formatDateRange(item.rentalStartDate, item.rentalEndDate)}
              </div>
              <div className="flex justify-center">
                {item.userRating ? (
                  <DisplayRating rating={item.userRating} />
                ) : (
                  <RatingButton onClick={() => handleOpenModal(item)} />
                )}
            </div>
          </div>
          );
        })}
      </div>

      {isModalOpen && selectedItem && (
        <RatingModal
          item={{
             id: selectedItem.productId,
             name: selectedItem.name,
             imageUrl: selectedItem.imageUrl,
             // Dummy properties to satisfy Comp_Rating type, adjust as needed
             description: "Deskripsi Produk", // Provide a default or fetch if needed
             price: 0, // Provide a default or fetch if needed
             sizes: [], // Provide a default or fetch if needed
             age: "Dewasa", // Provide a default
             gender: "Unisex", // Provide a default
             categoryId: 0 // Provide a default
          } as any} // Using 'as any' for simplification, ensure types match ideally
          onClose={handleCloseModal}
          onSubmitSuccess={handleSubmitRatingSuccess}
        />
      )}
    </>
  );
};

export default Histori;

