import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

// Terima prop 'onTambahProdukClick' dari AdminLayout
interface SidebarProps {
  onTambahProdukClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTambahProdukClick }) => {
  
  // Styling untuk NavLink
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-gray-800 text-white font-semibold' // Style Aktif
        : 'text-gray-600 hover:bg-gray-100' // Style Normal
    }`;

  return (
    <aside className="w-64 bg-white p-5 shadow-lg flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <Icon icon="mdi:store-cog-outline" className="w-8 h-8 text-gray-800" />
        <h1 className="text-xl font-bold text-gray-800">Dashboard admin</h1>
      </div>
      
      <nav className="space-y-3">
        {/* Tombol Tambah Produk (bukan NavLink) */}
        <button
          onClick={onTambahProdukClick} // Panggil fungsi dari prop
          className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg w-full text-left"
        >
          <Icon icon="mdi:plus-box-outline" className="w-6 h-6" />
          <span>Tambahkan Produk</span>
        </button>

        {/* Link Status Produk */}
        <NavLink to="/admin/status-produk" className={navLinkClass}>
          <Icon icon="mdi:clipboard-list-outline" className="w-6 h-6" />
          <span>Status Produk</span>
        </NavLink>
        
        {/* Link Log Transaksi (Dashboard) */}
        <NavLink to="/admin/log-transaksi" className={navLinkClass} end>
          <Icon icon="mdi:chart-bar" className="w-6 h-6" />
          <span>Log Transaksi</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;