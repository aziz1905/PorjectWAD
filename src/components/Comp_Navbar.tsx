import SearchNav from "./Comp_Search";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Komponen ini HANYA untuk Desktop, agar lebih rapi.
const DesktopAuthLinks = () => {
  const { user, logout } = useAuth();

  // 1. Logika diubah: !user (Jika TIDAK ada user)
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <NavLink 
          to="/masuk" 
          className={({ isActive }) => `nav-link-masuk-buatakun ${isActive ? 'font-bold' : ''}`}
        >
          Masuk
        </NavLink>
        <span className="text-white hidden sm:block">|</span>
        <NavLink 
          to="/buat-akun" 
          className={({ isActive }) => `nav-link-masuk-buatakun bg-blue-600 ${isActive ? 'font-bold' : ''}`}
        >
          Buat Akun
        </NavLink>
      </div>
    );
  } else { // Jika ADA user
    return (
      <div className="flex items-center gap-4">
        <img src={user.profileImageUrl || 'https://via.placeholder.com/40'} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
        <span className="text-white font-semibold hidden md:block">{user.name}</span>
        <button 
          onClick={logout} 
          className="nav-link-masuk-buatakun bg-red-600 hover:bg-red-700"
        >
          Keluar
        </button>
      </div>
    );
  }
};

const CompNavbar = () => { 
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Ambil user dan logout di sini untuk menu mobile

  const navLinkClass = ({ isActive }) => 
    `nav-link ${isActive ? 'font-bold' : ''}`;
  
  // Fungsi untuk menangani logout dari mobile dan menutup menu
  const handleMobileLogout = () => {
    logout();
    setIsOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <NavLink to="/" className="logo">
            <p className="font-extrabold">KostumKita.</p>
          </NavLink>

          <div className="hidden md:block"> 
            <SearchNav />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/beranda" className={navLinkClass}>Beranda</NavLink>
            <NavLink to="/tentang" className={navLinkClass}>Tentang</NavLink>
            <NavLink to="/pesanan" className={navLinkClass}>Pesanan</NavLink>
            <DesktopAuthLinks /> {/* Gunakan komponen khusus desktop */}
          </div>
          
          {/* Tombol untuk Mobile Menu */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-gray-800 p-4 rounded-lg flex flex-col items-center gap-4">
            <SearchNav />
            <NavLink to="/beranda" className={navLinkClass} onClick={() => setIsOpen(false)}>Beranda</NavLink>
            <NavLink to="/tentang" className={navLinkClass} onClick={() => setIsOpen(false)}>Tentang</NavLink>
            <NavLink to="/pesanan" className={navLinkClass} onClick={() => setIsOpen(false)}>Pesanan</NavLink>
            <hr className="w-full border-gray-600"/>
            
            {/* 2. Logika otentikasi untuk MOBILE ditangani di sini */}
            {!user ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <NavLink to="/masuk" className="nav-link-masuk-buatakun w-full text-center" onClick={() => setIsOpen(false)}>
                  Masuk
                </NavLink>
                <NavLink to="/buat-akun" className="nav-link-masuk-buatakun bg-blue-600 w-full text-center" onClick={() => setIsOpen(false)}>
                  Buat Akun
                </NavLink>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                 <div className="flex items-center gap-2">
                    <img src={user.profileImageUrl || 'https://via.placeholder.com/40'} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    <span className="text-white font-semibold">{user.name}</span>
                 </div>
                <button onClick={handleMobileLogout} className="nav-link-masuk-buatakun bg-red-600 hover:bg-red-700 w-full text-center">
                  Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default CompNavbar;