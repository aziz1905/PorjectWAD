import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Product } from '../type'; // Pastikan path ini benar
import api from '../api'; // <-- 1. Import API

// Tipe data untuk item yang akan di-rate
type ItemToRate = Product & {
  // Anda bisa tambahkan properti lain jika perlu
};

interface RatingModalProps {
  item: ItemToRate;
  onClose: () => void;
  // 2. Ubah prop ini: beri tahu parent jika SUKSES
  onSubmitSuccess: (productId: string, newRating: number) => void;
}

const RatingModal = ({ item, onClose, onSubmitSuccess }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 3. Tambah loading state

  const handleStarClick = (index: number) => {
    setRating(index);
  };

  const handleStarHover = (index: number) => {
    setHoverRating(index);
  };

  // 4. Ubah handleSubmit untuk memanggil API
  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Harap berikan rating bintang terlebih dahulu.");
      return;
    }
    if (comment.trim() === '') {
      alert("Harap isi komentar Anda.");
      return;
    }

    setIsLoading(true); // Mulai loading

    try {
      // Panggil API sesuai backend/routes/reviewsRoutes.js
      await api.post('/reviews/comment', {
        productId: item.id,
        rating: rating,
        comment: comment
      });
      
      // Panggil prop sukses untuk update UI di parent
      onSubmitSuccess(item.id, rating);
      onClose(); // Tutup modal

    } catch (error: any) {
      console.error("Gagal mengirim review:", error);
      // Cek jika error karena duplikat (unique constraint dari backend/db/schema/reviewsSchema.js)
      if (error.response && error.response.data?.message.includes('unique constraint')) {
        alert("Anda sudah pernah memberi ulasan untuk produk ini.");
      } else {
        alert("Gagal mengirim ulasan. Coba lagi.");
      }
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose} 
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-xl font-bold mb-2">Pemberian Rating</h2>
        <p className="text-gray-700 mb-4">{item.name}</p>

        <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-4">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover rounded-md" 
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Rating :</h3>
          <div className="flex items-center text-4xl">
            {[1, 2, 3, 4, 5].map((index) => (
              <Icon
                key={index}
                icon="ic:round-star"
                className={`cursor-pointer transition-colors ${
                  (hoverRating || rating) >= index
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                onClick={() => handleStarClick(index)}
                onMouseEnter={() => handleStarHover(index)}
                onMouseLeave={() => handleStarHover(0)}
              />
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Masukan Komentar Produk..."
          className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading} // Nonaktifkan saat loading
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading} // Nonaktifkan saat loading
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? 'Mengirim...' : 'Selesai'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RatingModal;