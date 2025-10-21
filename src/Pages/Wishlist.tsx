import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext'; // Sesuaikan path jika perlu
import { Icon } from '@iconify/react';
// import api from '../api'; // Anda akan memerlukan ini nanti untuk mengambil data wishlist
// import { Product } from '../type'; // Import tipe data Product jika perlu

const Wishlist = () => {
  const { user } = useAuth(); // Ambil data user jika diperlukan
  const [wishlistItems, setWishlistItems] = useState<any[]>([]); // Ganti 'any[]' dengan tipe data item wishlist Anda
  const [loading, setLoading] = useState(false); // State untuk loading
  const [error, setError] = useState<string | null>(null);

  // TODO: Tambahkan useEffect untuk mengambil data wishlist dari backend
  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     if (!user) return; // Jangan fetch jika user tidak login
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       // Ganti '/users/wishlist' dengan endpoint API Anda yang sebenarnya
  //       const response = await api.get('/users/wishlist');
  //       setWishlistItems(response.data);
  //     } catch (err) {
  //       setError('Gagal memuat wishlist.');
  //       console.error("Error fetching wishlist:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchWishlist();
  // }, [user]); // Jalankan ulang jika user berubah

  if (!user) {
    return <div className="container mx-auto p-8 text-center">Harap login untuk melihat wishlist Anda.</div>;
  }

  return (
    <div className="container mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        Wishlist Saya
      </h1>

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
              <Icon icon="mdi:hanger" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Wishlist Anda masih kosong.</p>
              <p className="text-sm">Tambahkan kostum favorit Anda ke sini!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TODO: Ganti bagian ini untuk me-render item wishlist */}
              {wishlistItems.map((item) => (
                <div key={item.id} className="border p-4 rounded-md shadow">
                  {/* Tampilkan detail item wishlist di sini (misal: gambar, nama produk) */}
                  <p>Item ID: {item.id}</p>
                  <p>Nama Produk: {item.product?.name || 'Nama Produk Tidak Tersedia'}</p>
                  {/* Tambahkan tombol untuk menghapus dari wishlist */}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;