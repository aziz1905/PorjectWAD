import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroProduct from '../components/Comp_Hero_Beranda';
import ProductGrid from '../components/Comp_Product_Grid'; // Pastikan nama import-nya benar
import Reviews from '../components/Comp_Review';
import Kategori from '../components/Comp_Kategori';

const Beranda = () => {
  const productSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#produk' && productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  return (
    <div className="kostumkita-main">
      <HeroProduct />
      <div ref={productSectionRef}>
        <Kategori />
      </div>
        
        <ProductGrid />
      <Reviews />
    </div>
  );
};

export default Beranda;