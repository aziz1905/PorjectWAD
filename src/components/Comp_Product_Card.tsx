import React, { useState, useEffect } from 'react'; 
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import ProductButton from "./Comp_Button";
import api from '../api'; 
import { useAuth } from './AuthContext';

type ProductProps = {
  id: number | string;
  imageUrl: string;
  name: string;
  price: number;
  description: string;
  sizes?: readonly string[] | "Stok Habis";
  // Ganti tipe ini jadi string jika Pilihan 1 yang dipilih
  age: "Dewasa" | "Remaja" | "Anak-anak"; 
  gender: "Pria" | "Wanita" | "Unisex";
  categoryId: number;
  wishlisted?: boolean;
};

const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  sizes,
  age,
  gender,
  categoryId,
  wishlisted = false, 
}: ProductProps) => {
  const { user } = useAuth(); // Ambil user untuk cek login
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);

  // Sinkronisasi jika prop berubah
  useEffect(() => {
    setIsWishlisted(wishlisted);
  }, [wishlisted]);

  // Fungsi untuk menambah/menghapus dari wishlist
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!user) {
      alert("Harap login untuk menambahkan ke wishlist.");
      // Mungkin arahkan ke halaman login? useNavigate('/masuk');
      return;
    }

    const originalWishlistedStatus = isWishlisted;
    setIsWishlisted(!isWishlisted); // Optimistic update

    try {
      if (!originalWishlistedStatus) {
        // Panggil API untuk MENAMBAHKAN
        await api.post(`/wishlist/${id}`); 
        console.log(`Produk ${id} ditambahkan ke wishlist`);
      } else {
        // Panggil API untuk MENGHAPUS
        await api.delete(`/wishlist/${id}`); 
        console.log(`Produk ${id} dihapus dari wishlist`);
      }
    } catch (error) {
      console.error("Gagal update wishlist:", error);
      setIsWishlisted(originalWishlistedStatus); // Revert UI
      alert("Gagal memperbarui wishlist. Coba lagi.");
    }
  };

  return (
    <Link
      to={`/detail-produk/${id}`}
      className="product-card group block rounded-lg shadow-md hover:shadow-lg transition relative" // Pastikan ada relative
    >
      {/* Tombol Wishlist */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-1.5 bg-white bg-opacity-70 rounded-full text-gray-600 hover:text-red-500 hover:bg-opacity-100 transition duration-200"
        aria-label="Toggle Wishlist"
      >
        <Icon 
          icon={isWishlisted ? "mdi:heart" : "mdi:heart-outline"} 
          className={`w-6 h-6 ${isWishlisted ? 'text-red-500' : ''}`} 
        />
      </button>
      
      {/* Gambar Produk */}
      <img
        src={imageUrl}
        alt={name}
        className="product-image w-full h-48 object-cover rounded-t-lg"
      />

      {/* Info Produk */}
      <div className="product-info p-5">
        {/* Rating Bintang */}
        <div className="flex items-center my-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icon key={index} icon="mdi:star" className="text-yellow-400 mr-1"/>
          ))}
        </div>
        
        <h3 className="product-name text-lg font-semibold group-hover:text-blue-600">{name}</h3>
        <p className="product-description text-sm text-gray-600 mb-2">{description}</p>
        <p className="mb-1">
          <b className="product-price text-red-500">Rp {price.toLocaleString("id-ID")}</b> /hari
        </p>
        <p className="text-sm text-gray-700">Kategori: {age}, {gender}</p>
        <p className="text-sm text-gray-700">
          Ukuran: {Array.isArray(sizes) ? sizes.join(", ") : sizes}
        </p>
        <div className="mt-3">
          <ProductButton
            buttonType="masukanKeranjang"
            logoChild={<Icon icon="mdi:cart-plus" className="text-white text-2xl" />}
            fontChild=""
            onClick={(e: React.MouseEvent) => {
              e.preventDefault(); 
              e.stopPropagation();
              alert(`Menambahkan ${name} ke keranjang`);
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;