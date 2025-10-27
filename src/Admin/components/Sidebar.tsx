import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';


const AdminNavLink = ({ to, icon, label }: { to: string, icon: string, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={`
        flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-150
        ${isActive ? 'bg-gray-900 text-white shadow-inner' : ''}
      `}
    >
      <Icon icon={icon} className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-gray-900 shadow-md">
        <h1 className="text-2xl font-bold text-white tracking-wider">KostumKita.</h1>
      </div>
      
      {/* Navigasi */}
      <nav className="flex-1 mt-5 px-3 space-y-2">
        {/* Sesuai wireframe, "Edit Produk" adalah untuk manajemen stok */}
        <AdminNavLink 
          to="/admin/edit-produk" 
          icon="mdi:pencil"
          label="Edit Produk" 
        />
        {/* "Status Produk" adalah untuk status penyewaan */}
        <AdminNavLink 
          to="/admin/status-produk" 
          icon="mdi:clipboard-check-outline"
          label="Status Produk" 
        />
        <AdminNavLink 
          to="/admin/log-transaksi" 
          icon="mdi:clipboard-list-outline"
          label="Log Transaksi" 
        />
      </nav>
      
      {/* Footer Sidebar (Optional) */}
      <div className="p-4 text-center text-xs text-gray-500">
        © 2025 KostumKita
      </div>
    </div>
  );
};

export default Sidebar;
