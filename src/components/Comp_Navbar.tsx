import SearchNav from "./Comp_Search";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

const CompNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Definisikan style untuk link aktif agar tidak perlu diulang
  const activeLinkStyle = {
    color: '', 
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
              <NavLink to="/masuk" className="nav-link-masuk-buatakun" style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              onClick={()=>{
                alert("anda perlu login!")
              }}
              >Pesanan</NavLink>
              <div>
                <NavLink to="/masuk" className="nav-link-masuk-buatakun" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Masuk</NavLink>
                <span className="text-white mx-2">|</span>
                <NavLink to="/buat-akun" className='nav-link-masuk-buatakun bg-blue' style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Buat Akun</NavLink>
              </div>
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

      {/* Mobile Menu juga menggunakan NavLink */}
      <div className={`mobile-menu ${isOpen ? '' : 'hidden'}`} id="mobile-menu">
        <div className="mobile-menu-links">
          <SearchNav/>
          <NavLink to="/masuk" className="mobile-nav-link" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={toggleMenu}>Masuk</NavLink>
          <NavLink to="/buat-akun" className='mobile-nav-link'style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={toggleMenu}>Buat Akun</NavLink>
          <NavLink to="/" className="mobile-nav-link" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={toggleMenu}>Beranda</NavLink>
          <NavLink to="/tentang" className="mobile-nav-link" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={toggleMenu}>Tentang</NavLink>
          <NavLink to="/masuk" className="mobile-nav-link" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={toggleMenu}>Pesanan</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default CompNavbar;