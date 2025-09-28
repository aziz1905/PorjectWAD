import { NavLink, Outlet } from 'react-router-dom';

const Pesanan = () => {
  // Style untuk NavLink yang aktif
  const activeLinkStyle = {
    backgroundColor: '#ffffff', // bg-white
    color: '#2563eb', // text-blue-700
    borderBottom: '2px solid #2563eb'
  };

  return (
    <div className="pesanan-bg">
      <div className="pesanan-container">
        <div className="bg-blue-800 rounded-t-lg flex">
          <NavLink 
            to="/pesanan/keranjang" 
            className="text-nav-pesan"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Keranjang
          </NavLink>
          <NavLink 
            to="/pesanan/pengiriman" 
            className="text-nav-pesan"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Status Pengiriman
          </NavLink>
          <NavLink 
            to="/pesanan/histori" 
            className="text-nav-pesan"
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
          >
            Histori
          </NavLink>
        </div>

        {/* Area untuk menampilkan konten sub-halaman */}
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Pesanan;



