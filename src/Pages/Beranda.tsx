import React from 'react';
import HeroProduct from '../components/Comp_Hero_Beranda';
import ProductId from '../components/Comp_Product_Grid';
import Reviews from '../components/Comp_Review';
import Kategori from '../components/Comp_Kategori';

const Beranda = () => {
  return (
    // Tambahkan div pembungkus ini kembali
    <div className="kostumkita-main">
      <HeroProduct />
      <Kategori />
      <ProductId />
      <Reviews />
    </div>
  );
};

export default Beranda;
