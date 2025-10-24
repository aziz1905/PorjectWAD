import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Icon } from '@iconify/react';
import api from '../api'; 
import { Product } from '../type'; 
import ProductCard from '../components/Comp_Product_Card';

const Wishlist = () => {
  const { user } = useAuth(); 
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterWishlist = async () => {
      if (!user) {
        setLoading(false); 
        return; 
      }
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/products'); 
        const allProducts: Product[] = response.data;

        // 2. Filter produk yang properti wishlisted-nya true
        const filteredItems = allProducts.filter(product => product.wishlisted === true);
        
        setWishlistItems(filteredItems); // Simpan hasil filter ke state

      } catch (err) {
        setError('Gagal memuat data produk.'); // Ubah pesan error jika perlu
        console.error("Error fetching products for wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilterWishlist();
  }, [user]); // Jalankan ulang jika user berubah

  if (!user) {
    return <div className="container mx-auto p-8 text-center">Harap login untuk melihat wishlist Anda.</div>;
  }

  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-1 px-4 py-2">
        <Icon icon="mdi:hanger" className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-gray-800">Wishlist Saya</h1>
      </div>
      

      {loading && (
        <div className="text-center py-12 text-gray-600">Memuat wishlist...</div>
      )}

      {error && (
        <div className="text-center py-12 text-red-600">Error: {error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {wishlistItems.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <Icon icon="mdi:hanger-empty" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Wishlist Anda masih kosong.</p>
              <p className="text-sm">Tambahkan kostum favorit Anda ke sini!</p>
            </div>
          ) : (
            // Render hasil filter menggunakan ProductCard
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  sizes={item.sizes}
                  specification={item.specification}
                  categoryId={item.categoryId}
                  wishlisted={true} // Karena ini halaman wishlist, kita tahu statusnya true
                  // Anda mungkin perlu tombol "Hapus" di sini
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;