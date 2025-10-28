// src/components/Comp_Review.tsx

import React, { useState, useEffect } from 'react';
import api from '../api'; 
import { Icon } from '@iconify/react';
import NonPict from '../assets/NonPict.png'; 

interface ApiReview {
  id: number;
  rating: string; 
  comment: string; 
  user: {
    name: string; 
    avatarUrl: string | null; 
  };
  product: {
    name: string; 
    imageUrl: string; 
  };
}

// Komponen untuk menampilkan bintang rating
const RenderStars = ({ rating }: { rating: number }) => {
  const stars = [];
  const maxStars = 5;
  // Pastikan rating adalah angka valid antara 0-5
  const currentRating = Math.max(0, Math.min(maxStars, rating || 0));

  for (let i = 1; i <= maxStars; i++) {
    if (i <= currentRating) {
      // Bintang penuh
      stars.push(<Icon key={i} icon="mdi:star" className="text-yellow-400" />);
    } else if (i - 0.5 <= currentRating) {
      // Setengah bintang
      stars.push(<Icon key={i} icon="mdi:star-half-full" className="text-yellow-400" />);
    } else {
      // Bintang kosong
      stars.push(<Icon key={i} icon="mdi:star-outline" className="text-yellow-400" />);
    }
  }
  return <div className="flex items-center">{stars}</div>;
};


const Comp_Reviews: React.FC = () => {
  // State untuk menyimpan data dari API
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Panggil endpoint GET /reviews (yang akan kita buat di backend)
        const response = await api.get('/reviews');
        setReviews(response.data);
      } catch (err) {
        setError('Gagal memuat ulasan pelanggan.');
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  return (
    <div className="bg-blue-900 py-16 sm:py-24">
      <div className="margin-side-content">
        {/* Judul Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Kata Mereka Tentang Kami
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-400">
            Simak pengalaman seru dari para pelanggan setia KostumKita.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="text-center text-gray-300 mt-16">Memuat ulasan...</p>
        )}

        {/* Error State */}
        {error && (
          <p className="text-center text-red-400 mt-16">{error}</p>
        )}

        {/* Grid untuk Kartu Ulasan (Data dari API) */}
        {!loading && !error && reviews.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="flex flex-col items-start justify-between bg-blue-950 rounded-2xl shadow-lg">
                
                {/* Info Penulis Ulasan */}
                <div className="relative mb-4 mt-4 ml-4 flex items-center gap-x-4">
                  <img 
                    src={review.user.avatarUrl || NonPict} // Gunakan fallback NonPict
                    alt={review.user.name} 
                    className="h-10 w-10 rounded-full bg-gray-800 object-cover" 
                  />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-white">
                      {review.user.name}
                    </p>
                  </div>
                </div>

                {/* Gambar Produk yang Diulas */}
                <div className="relative w-full">
                  <img
                    src={review.product.imageUrl}
                    alt={review.product.name}
                    className="aspect-[16/9] w-full bg-gray-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  {/* Nama Produk di atas gambar */}
                  <div className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-50 rounded-tr-lg">
                     <p className="text-xs font-medium text-white">{review.product.name}</p>
                  </div>
                </div>

                <div className="max-w m-1 p-3 w-full">
                  {/* Rating Bintang */}
                  <div className="flex items-center gap-2 mb-2">
                    <RenderStars rating={parseFloat(review.rating)} />
                    <span className="text-gray-300 text-sm">({review.rating})</span>
                  </div>

                  {/* Komentar */}
                  <div className="group relative">
                    <p className="line-clamp-3 text-sm leading-6 text-gray-400">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {/* State Jika Tidak Ada Review */}
        {!loading && !error && reviews.length === 0 && (
           <p className="text-center text-gray-400 mt-16">Belum ada ulasan.</p>
        )}

      </div>
    </div>
  );
};

export default Comp_Reviews;