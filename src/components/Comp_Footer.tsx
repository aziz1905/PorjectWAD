import React, { useState, useEffect } from 'react'; // Import React hooks
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { User } from "../type";
import api from '../api'; // Import instance API Anda
// Asumsi path ke KategoriProvider, sesuaikan jika perlu
import { useCategory } from './Comp_Kategori'; 

// Tipe data untuk kategori dari API
type Category = {
  id: number;
  name: string;
};

// Perbarui props untuk menerima fungsi logout
interface FooterProps{
  user: User | null;
  logout: () => void; // Tambahkan fungsi logout
}

const CompFooter = ({ user, logout }: FooterProps) => {
  // State untuk menyimpan kategori
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Ambil setter dari Kategori Context
  // Kita akan gunakan ini untuk MENGUBAH kategori saat link diklik
  const { setSelectCategoryId } = useCategory();

  // Ambil kategori dari API saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories'); // [cite: backend/routes/categoryRoutes.js]
        setCategories(response.data || []);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };

    fetchCategories();
  }, []); // [] berarti hanya dijalankan sekali saat mount

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Kolom 1: Branding */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-2">KostumKita</h2>
            <p className="text-sm">
              Solusi penyewaan kostum terlengkap untuk segala acaramu.
            </p>
          </div>

          {/* Kolom 2: Link Halaman (DIPERBAIKI) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Halaman</h3>
            <ul className="mt-4 space-y-2">
              {/* Ganti <a> dengan <Link> untuk navigasi internal */}
              <li><Link to="/beranda" className="text-base text-gray-300 hover:text-white">Beranda</Link></li>              
              <li><Link to="/tentang" className="text-base text-gray-300 hover:text-white">Tentang</Link></li>
              <li><Link to="/pesanan" className="text-base text-gray-300 hover:text-white">Pesanan</Link></li>
              <>
                {!user && (
                 <>
                    <li><Link to="/masuk" className="text-base text-gray-300 hover:text-white">Masuk</Link></li>
                    <li><Link to="/buat-akun" className="text-base text-gray-300 hover:text-white">Buat Akun</Link></li>
                 </>
                )}

                {user && (
                  // Ganti <a> dengan <button> untuk aksi
                  <li>
                      <button 
                        onClick={logout} 
                        className="text-base text-gray-300 hover:text-white text-left"
                      >
                        Keluar Akun
                      </button>
                    </li>
                )}
              </>
            </ul>
          </div>

           {/* Kolom 3: Link Cepat (DIPERBAIKI DARI API) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Kategori</h3>
            <ul className="mt-4 space-y-2">
              {/* Ambil 4 kategori pertama dari state */}
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  {/* Link ini akan:
                    1. Pindah ke halaman /beranda
                    2. Mengatur ID kategori yang dipilih di Context
                  */}
                  <Link 
                    to="/beranda#produk"
                    onClick={() => setSelectCategoryId(category.id)}
                    className="text-base text-gray-300 hover:text-white duration-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Link Dukungan (DIPERBAIKI) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Layanan</h3>
            <ul className="mt-4 space-y-2">
              {/* Kita gunakan link #kontak-kami (lihat Layout.tsx) */}
              <li><a href="#kontak-kami" className="text-base text-gray-300 hover:text-white">Hubungi Kami</a></li>
            	{/* Tautkan ke halaman yang relevan jika ada */}
              <li><Link to="/tentang" className="text-base text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link to="/pesanan" className="text-base text-gray-300 hover:text-white">Cara Pesan</Link></li>
            </ul>
          </div>

          {/* Kolom 5: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Syarat & Ketentuan</a></li>
            </ul>
          </div>

        </div>

        {/* Bagian Bawah: Copyright & Social Media */}
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-base text-gray-400 md:order-1">&copy; 2025 KostumKita. Semua Hak Cipta Dilindungi.</p>
          <div className="flex space-x-6 md:order-2 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-300"><span className="sr-only"></span>
            <Icon icon="mdi:facebook" className="text-2xl mx-2.5" /></a>
            <a href="#" className="text-gray-400 hover:text-gray-300"><span className="sr-only">Instagram</span>
            <Icon icon="mdi:instagram" className="text-2xl mx-2.5" /></a>
            <a href="#" className="text-gray-400 hover:text-gray-300"><span className="sr-only">Twitter</span>
            <Icon icon="mdi:email" className="text-2xl mx-2.5" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default CompFooter;