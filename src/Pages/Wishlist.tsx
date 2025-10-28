import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext'; // Pastikan path ini benar
import { Icon } from '@iconify/react';
import api from '../api'; 
import { Product } from '../type'; // Pastikan path ini benar
import ProductCard from '../components/Comp_Product_Card';
import ProductGrid from '../components/Comp_Product_Grid'; 

export default function WishlistPage() {
  // State ini sudah benar
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]); 
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set<number>());
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated, user } = useAuth(); // Ambil 'user' juga

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setError('Anda harus login untuk melihat wishlist.');
        setLoading(false); 
        return; 
      }
      
      setLoading(true);
      setError(null);

      // Hapus pembuatan 'ids' yang error dari sini

      try {
        const response = await api.get('/wishlist'); 
        
        // 1. Simpan data produk yang di-wishlist
        const items: Product[] = response.data || [];
        setWishlistItems(items); 

        // 2. BUAT SET ID DARI DATA YANG BARU DATANG (response.data)
        // Pindahkan logikanya ke sini
        const ids = items.map((item: Product) => item.id);
        setWishlistProductIds(new Set(ids));

      } catch (err) {
        setError('Gagal memuat wishlist Anda.');
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [isAuthenticated]); // Dependensi sudah benar

  // Pengecekan 'user' ini sudah benar
  if (!user) {
     return <div className="container mx-auto p-8 text-center">Harap login untuk melihat wishlist Anda.</div>;
  }
 
  // Pengecekan loading dan error sudah benar
  if (loading) {
     return <div className="text-center py-12 text-gray-600">Memuat wishlist...</div>
  }

  if (error && !wishlistItems.length) {
     return <div className="text-center py-12 text-red-600">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-1 px-4 py-2">
        <Icon icon="mdi:hanger" className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-gray-800">Wishlist Saya</h1>
      </div>
      
      {/* --- BAGIAN 1: HASIL WISHLIST --- */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        {wishlistItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <Icon icon="mdi:hanger-empty" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Wishlist Anda masih kosong.</p>
            <p className="text-sm">Tambahkan kostum favorit Anda ke sini!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.id}
                {...item} 
                age={item.age as any} 
                gender={item.gender as any}
                wishlisted={true} // Ini sudah benar
              />
            ))}
          </div>
        )}
      </div>
      
      {/* --- BAGIAN 2: PRODUK GRID (REKOMENDASI) --- */}
      <>
        <hr className="my-8 border-gray-200" />
        <h2 className="text-2xl font-bold mb-6 text-gray-800 px-4">Mungkin Anda Suka</h2>
        
        {/* *** PERBAIKAN TYPO DI SINI ***
          'wishlisteProductIds' (SALAH) diubah menjadi 'wishlistProductIds' (BENAR)
        */}
        <ProductGrid wishlistProductIds={wishlistProductIds} />
      </>

    </div>
  );
};

