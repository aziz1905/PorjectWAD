import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Products from '../../data/Produk';
import { Product } from '../../Admin/types';
import RatingModal from '../../components/Comp_Rating'; // 1. Impor Modal

type HistoryItem = Product & {
  rentalStartDate: Date;
  rentalEndDate: Date;
  userRating?: number;
};

const dummyHistoryItems: HistoryItem[] = [
  {
  ...Products[2], 
    rentalStartDate: new Date('2025-09-11'),
    rentalEndDate: new Date('2025-09-12'),
  },
  {
  ...Products[4], 
    rentalStartDate: new Date('2025-09-11'),
    rentalEndDate: new Date('2025-09-12'),
    userRating: 5, 
  },
  {
  ...Products[1], 
    rentalStartDate: new Date('2025-08-20'),
    rentalEndDate: new Date('2025-08-23'),
    userRating: 4,
  },
];

const formatDateRange = (start: Date, end: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const startDate = start.toLocaleDateString('id-ID', options);
  const endDate = end.toLocaleDateString('id-ID', options);
  const year = start.getFullYear();
  return `${startDate} - ${endDate} ${year}`;
};

const Histori = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(dummyHistoryItems);

  // --- 2. Tambahkan State untuk Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // --- 3. Buat Fungsi Handler Modal ---
  const handleOpenModal = (item: HistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Ini adalah DUMMY submit, hanya update state lokal
  const handleSubmitRating = (productId: string | number, rating: number, comment: string) => {
    console.log("Rating Diterima:", { productId, rating, comment });
    
    // Update data dummy di state (bandingkan sebagai string untuk menghindari mismatch tipe)
    setHistoryItems(currentItems =>
      currentItems.map(item =>
        String(item.id) === String(productId) ? { ...item, userRating: rating } : item
      )
    );
    
    // Tutup modal
    handleCloseModal(); 
  };


  // --- 4. Modifikasi Komponen Tombol ---
  const DisplayRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center justify-center gap-1 text-lg">
      <span className="font-bold text-gray-700">{rating}</span>
      <Icon icon="ic:round-star" className="text-yellow-400" />
    </div>
  );

  // Tambahkan 'onClick' prop
  const RatingButton = ({ onClick }: { onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
    >
      Beri Rating
    </button>
  );

  return (
    <>
      <div className="histori-header">
        <span>Gambar & Nama Produk</span>
        <span>Waktu Sewa</span>
        <span>Rating</span>
      </div>

      <div className="space-y-4">
        {historyItems.map(item => (
          <div key={item.id} className="histori-item">
            <div className="flex items-center gap-4">
              <img src={item.imageUrl} alt={item.name} className="bg-gray-100 rounded-lg h-16 w-16 object-cover" />
              <span className="font-semibold text-gray-800">{item.name}</span>
            </div>
            <div className="text-center text-gray-600">
              {formatDateRange(item.rentalStartDate, item.rentalEndDate)}
            </div>
            <div className="flex justify-center">
              {/* --- 5. Perbarui Logika Tampilan --- */}
              {item.userRating ? (
                <DisplayRating rating={item.userRating} /> 
              ) : (
                <RatingButton onClick={() => handleOpenModal(item)} />
              )}
         </div>
        </div>
        ))}
      </div>

      {/* --- 6. Render Modal Secara Kondisional --- */}
      {isModalOpen && selectedItem && (
        <RatingModal
          item={selectedItem}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRating}
        />
      )}
    </>
  );
};

export default Histori;