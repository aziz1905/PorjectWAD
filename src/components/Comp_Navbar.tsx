import SearchNav from "./Comp_Search";
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { User } from '../type';

// ✅ Tipe data untuk props yang diterima Navbar
interface NavbarProps {
    user: User | null;
    onLogout: () => void;
}

const CompNavbar = ({ user, onLogout }: NavbarProps) => { // ✅ Terima props
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const activeLinkStyle = {
    fontWeight: 'bold',
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <NavLink to="/beranda" className="logo">
            <p className="font-extrabold">KostumKita.</p>
          </NavLink>

          <div> 
            <SearchNav />
          </div>

          <div className="desktop-menu">
            <div className="nav-links-container">
              <NavLink to="/beranda" className="nav-link" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Beranda</NavLink>
              <NavLink to="/tentang" className="nav-link" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Tentang</NavLink>
              
              <NavLink to={user ? "/pesanan" : "/masuk"} className={user? "nav-link":""} style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              onClick={() => {
                if (!user) {
                  alert("Anda harus masuk Akun terlebih dahulu!");
                }
              }}
              >
                Pesanan
              </NavLink>
              
              {user ? (
                // Tampilan JIKA SUDAH LOGIN
                <div className="flex items-center gap-4 ml-4">
                  <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white" />
                  <span className="text-white font-semibold">{user.name}</span>
                  <button 
                    onClick={onLogout} 
                    className="nav-link-masuk-buatakun bg-red-600 hover:bg-red-700"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                // Tampilan JIKA BELUM LOGIN
                <div className="ml-4">
                  <NavLink to="/masuk" className="nav-link-masuk-buatakun" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Masuk</NavLink>
                  <span className="text-white mx-2">|</span>
                  <NavLink to="/buat-akun" className='nav-link-masuk-buatakun bg-blue-600' style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Buat Akun</NavLink>
                </div>
              )}
            </div>
          </div>
          
          {/* Sisa kode untuk menu mobile bisa disesuaikan dengan logika yang sama */}
          
        </div>
      </div>
      
      {/* Kamu bisa menambahkan logika yang sama untuk mobile menu di sini jika diperlukan */}

    </nav>
  );
};

export default CompNavbar;