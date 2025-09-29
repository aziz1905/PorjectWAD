import SearchNav from "./Comp_Search";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Pastikan path ini benar

// 1. AuthLinks TIDAK PERLU PROPS lagi
const AuthLinks = () => {
  // Ia mengambil data langsung dari context
  const { user, logout } = useAuth();

  if (user) {
    // Tampilan JIKA SUDAH LOGIN
    return (
      <div className="flex items-center gap-4">
        <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white" />
        <span className="text-white font-semibold hidden md:block">{user.name}</span>
        <button 
          onClick={logout} // ✅ Gunakan fungsi `logout` dari context
          className="nav-link-masuk-buatakun bg-red-600 hover:bg-red-700"
        >
          Keluar
        </button>
      </div>
    );
  }

  // Tampilan JIKA BELUM LOGIN
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
};


// 2. CompNavbar juga TIDAK PERLU PROPS lagi
const CompNavbar = () => { 
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `nav-link ${isActive ? 'font-bold' : ''}`;
  
  // Custom handler untuk mobile logout + menutup menu
  const { logout } = useAuth(); // Ambil fungsi logout untuk mobile menu
  const handleMobileLogout = () => {
    logout();
    setIsOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <NavLink to="/beranda" className="logo">
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
            
            {/* 3. Panggil AuthLinks tanpa props */}
            <AuthLinks />
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
            
            {/* Kita perlu sedikit modifikasi di sini karena ada aksi tambahan (menutup menu) */}
            {/* Daripada memanggil AuthLinks, kita bisa duplikasi logikanya atau memanggil logout langsung */}
            <AuthLinks />
          </div>
        )}
      </div>
    </nav>
  );
};

export default CompNavbar;