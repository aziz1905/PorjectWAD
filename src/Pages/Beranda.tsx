import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroProduct from '../components/Comp_Hero_Beranda';
import ProductGrid from '../components/Comp_Product_Grid'; // Pastikan nama import-nya benar
import Reviews from '../components/Comp_Review';
import Kategori from '../components/Comp_Kategori';
import { useAuth } from '../components/AuthContext';
import api from '../api';

const Beranda = () => {
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set<number>());
  const { isAuthenticated } = useAuth();
  const productSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#produk' && productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  useEffect(() => {
    const fetchWishlist = async () => {
      // Hanya ambil jika user login
      if (isAuthenticated) { 
        try {
          // Panggil API wishlist
          const response = await api.get('/wishlist'); //
          const items: Product[] = response.data || [];
          
          // Buat Set berisi ID
          const ids = items.map((item: Product) => item.id);
          setWishlistProductIds(new Set(ids));

        } catch (err) {
          console.error("Gagal memuat wishlist di Beranda:", err);
          setWishlistProductIds(new Set<number>()); 
        }
      } else {
        // Jika user logout, kosongkan Set
        setWishlistProductIds(new Set<number>());
      }
    };
    
    fetchWishlist();
  }, [isAuthenticated]);

  return (
    <div className="kostumkita-main">
      <HeroProduct />
      <div ref={productSectionRef}>
        <Kategori />
      </div>
        <ProductGrid wishlistProductIds={wishlistProductIds} />
      <Reviews />
    </div>
  );
};

export default Beranda;