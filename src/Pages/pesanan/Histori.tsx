import React, { useState } from 'react';
import { Icon } from '@iconify/react';
// ✅ LANGKAH 1: Impor data produk dan tipe datanya
import Products from '../../data/Produk.ts';
import { Product } from '../../type.ts';

// ✅ LANGKAH 2: Perbarui tipe HistoryItem agar mencakup semua properti dari Product
type HistoryItem = Product & {
  rentalStartDate: Date;
  rentalEndDate: Date;
  rating?: number;
};

// ✅ LANGKAH 3: Buat data dummy dengan mengambil dari array Products
const dummyHistoryItems: HistoryItem[] = [
  {
    ...Products[2], // <-- Mengambil semua data dari produk ke-3 (Kostum Tradisional)
    rentalStartDate: new Date('2025-09-11'),
    rentalEndDate: new Date('2025-09-12'),
    // Item ini belum punya rating
  },
  {
    ...Products[4], // <-- Mengambil semua data dari produk ke-5 (Gaun Putri Salju)
    rentalStartDate: new Date('2025-09-11'),
    rentalEndDate: new Date('2025-09-12'),
    rating: 5, // Item ini sudah diberi rating 5
  },
  {
    ...Products[1], // <-- Mengambil semua data dari produk ke-2 (Kostum Superhero)
    rentalStartDate: new Date('2025-08-20'),
    rentalEndDate: new Date('2025-08-23'),
    rating: 4,
  },
];

// Helper function untuk memformat tanggal
const formatDateRange = (start: Date, end: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const startDate = start.toLocaleDateString('id-ID', options);
  const endDate = end.toLocaleDateString('id-ID', options);
  const year = start.getFullYear();
  return `${startDate} - ${endDate} ${year}`;
};

const Histori = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(dummyHistoryItems);

  const DisplayRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center justify-center gap-1 text-lg">
      <span className="font-bold text-gray-700">{rating}</span>
      <Icon icon="ic:round-star" className="text-yellow-400" />
    </div>
  );

  const RatingButton = () => (
    <button className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700">
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
              {item.rating ? <DisplayRating rating={item.rating} /> : <RatingButton />}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Histori;