import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { User } from "../type";


interface FooterProps{
  user: User | null;
}

const CompFooter = ({user}:FooterProps) => {
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

          {/* Kolom 2: Link Cepat */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Halaman</h3>
            <ul className="mt-4 space-y-2">
              <Link>Beranda</Link>              
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Tentang</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Pesanan</a></li>
              <>
                {!user && (
                 <>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Masuk</a></li>
                  <div className="mt-2 space-y-2">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Buat Akun</a></li>
                  </div>
                 </>
                   
                )}

                {user && (
                  <li><a href="#" className="text-base text-gray-300 hover:text-white">Keluar Akun</a></li>
                )}
              </>
            </ul>
          </div>

           {/* Kolom 3: Link Cepat */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Link Cepat</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Pesta</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Acara Kantor</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Wisuda</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Lainnya</a></li>
              
            </ul>
          </div>

          {/* Kolom 4: Link Dukungan */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Layanan</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Hubungi Kami</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Cara Pesan</a></li>
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