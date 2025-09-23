// src/components/Comp_Navbar.tsx
import SearchNav from "./Search";
import { useState } from 'react';

// Nama komponen sebaiknya diawali huruf kapital
const CompNavbar = () => {
  // Gunakan state untuk melacak apakah menu sedang terbuka atau tidak
  const [isOpen, setIsOpen] = useState(false);

  // Fungsi untuk mengubah state saat tombol di-klik
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Mengubah nilai dari false -> true -> false
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          
          <a href="#" className="logo ">
            <p className="font-extrabold">KostumKita</p>
          </a>
          <div> 
            <SearchNav />
          </div>
          <div className="desktop-menu">
            <div className="nav-links-container">
              <a href="#" className="nav-link active" aria-current="page">Beranda</a>
              <a href="#" className="nav-link">Tentang</a>
              <a href="#" className="nav-link">Pesanan</a>
              <a> <a className="nav-link-masuk-buatakun"href="#">Masuk</a><a className="text-white"> | </a><a href="#" className='nav-link-masuk-buatakun bg-blue'>Buat Akun</a></a>
            </div>
          </div>
          
          <div className="mobile-menu-container">
            <button onClick={toggleMenu} type="button" className="mobile-menu-button">
              <span className="sr-only">Buka menu utama</span>
              
              <svg className={`hamburger-icon ${isOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>

              <svg className={`close-icon ${isOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
        </div>
      </div>

      {/* Tampilkan atau sembunyikan menu mobile berdasarkan state 'isOpen' */}
      <div className={`mobile-menu ${isOpen ? '' : 'hidden'}`} id="mobile-menu">
        <div className="mobile-menu-links">
          <a href="" className="mobile-nav-link">Masuk</a>
          <a href="#" className='mobile-nav-link'>Buat Akun</a>
          <a href="#" className="mobile-nav-link active" aria-current="page">Beranda</a>
          <a href="#" className="mobile-nav-link">Tentang</a>
          <a href="#" className="mobile-nav-link">Pesanan</a>
        </div>
      </div>
    </nav>
  );
};

export default CompNavbar;