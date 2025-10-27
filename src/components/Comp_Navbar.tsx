import { useState, useRef, useEffect } from 'react'; // 1. Import useRef dan useEffect
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Search, { useSearch } from './Comp_Search';
import {Icon} from '@iconify/react';

// Komponen ini tidak perlu diubah
const DesktopAuthLinks = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);


  if (!user) {
    return (
      <div className="flex items-center gap-2" >
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
  }  else { 
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-4 focus:outline-none"
        >
          <span className="text-white font-semibold hidden md:block">{user.fullName}</span>
          <img src={user.profileImageUrl} alt={user.fullName} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
        </button>

        {isDropdownOpen && (
          <div 
            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50"
          >
           <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
              <img src={user.profileImageUrl} alt={user.fullName} className="outline w-10 h-10 rounded-full object-cover flex-shrink-0"/>
  
              {/* Add the classes below to the span */}
              <span className="truncate min-w-0">{user.email}</span>
           </div>
            <NavLink 
              to="/settings" 
              className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)} // Tutup dropdown saat diklik
            >
             <Icon icon="mdi:account-cog-outline" className="w-5 h-5 text-gray-500" />
             <span>Setting Akun</span> 
            </NavLink>
            <NavLink 
              to="/wishlist" 
              className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <Icon icon="mdi:hanger" className="w-5 h-5 text-gray-500" />
              <span>Wishlist</span>
            </NavLink>
            <button 
              onClick={() => {
                logout();
                setDropdownOpen(false);
                window.location.reload();
              }} 
              className="flex items-center gap-1 text-left w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Icon icon="mdi:logout" className="w-5 h-5 text-red-500" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    );
  }
};

const CompNavbar = () => { 
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { setSearchTerm } = useSearch();

  // 2. Definisikan ref untuk menunjuk ke wrapper search bar
  const searchRef = useRef<HTMLDivElement>(null);

  // State dan fungsi untuk mobile, biarkan apa adanya
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); 

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };
  
  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchTerm('');
  };

  // 3. useEffect untuk mendeteksi klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        handleSearchClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]); 

  const navLinkClass = ({ isActive }) => 
    `nav-link ${isActive ? 'font-bold underline-offset-7 underline text-white' : ''}`;
  
  const handleMobileLogout = () => {
    logout();
    setIsOpen(false);
  }



  return (
    <nav className="navbar relative z-30">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* BAGIAN KIRI: Logo */}
          <div className={`flex-shrink-0 transition-opacity duration-300 ${isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <NavLink to="/" className="logo">
              <p className="font-extrabold">KostumKita.</p>
            </NavLink>
          </div>
          
          {/* BAGIAN TENGAH: Navigasi dan Search Bar */}
          <div className="hidden md:flex flex-grow items-center justify-center relative">
            
            {/* Navigasi Links (akan menghilang) */}
           

            {/* Search Bar (akan membesar) */}
            <div 
              ref={searchRef} // 4. Pasang ref di sini
              className={`flex items-center transition-all duration-500 ease-in-out ${
                isSearchActive 
                ? ' absolute w-full max-w-100' // State Aktif
                : 'relative w-64 ml-8'      // State Normal
              }`}
            >
              <div onFocusCapture={handleSearchFocus} className="w-full">
                  <NavLink to="/beranda#produk" style={{ display: 'block' }}>
                    <Search/>
                  </NavLink>
              </div>
            </div>

            <div className={`flex items-center gap-6 transition-opacity duration-300 ${isSearchActive ? 'opacity-0 pointer-events-none' : 'ml-10 opacity-100'}`}>
              <NavLink to="/beranda" className={navLinkClass}>Beranda</NavLink>
              <NavLink to="/tentang" className={navLinkClass}>Tentang</NavLink>
              <NavLink to="/pesanan" className={navLinkClass}>Pesanan</NavLink>
            </div>

          </div>
          
          {/* BAGIAN KANAN: Auth Links */}
          <div className={`hidden md:flex items-center flex-shrink-0 transition-opacity duration-300 ${isSearchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <DesktopAuthLinks />
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
            <Search />
            <NavLink to="/beranda" className={navLinkClass} onClick={() => setIsOpen(false)}>Beranda</NavLink>
            <NavLink to="/tentang" className={navLinkClass} onClick={() => setIsOpen(false)}>Tentang</NavLink>
            <NavLink to="/pesanan" className={navLinkClass} onClick={() => setIsOpen(false)}>Pesanan</NavLink>
            <hr className="w-full border-gray-600"/>
            
            {/* Logika otentikasi untuk MOBILE */}
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
                <button onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <img src={user.profileImageUrl} alt={user.fullName} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    <span className="text-white font-semibold">{user.fullName}</span>
                  </div>  
                </button>
                
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