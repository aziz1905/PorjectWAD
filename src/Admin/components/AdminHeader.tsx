import React from 'react';
import { useAuth } from '../../components/AuthContext'; // Sesuaikan path
import { Icon } from '@iconify/react';

const AdminHeader: React.FC = () => {
  // Asumsi useAuth memiliki fungsi logout dan data user
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    // Navigasi akan ditangani oleh ProtectedRoute
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
      {/* Judul Halaman (bisa dibuat dinamis dengan context jika perlu) */}
      <h1 className="text-xl font-semibold text-gray-800">
        <span className="hidden md:inline">Dashboard</span> Admin
      </h1>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:inline">
          {user?.email || 'admin@kostumkita.com'}
        </span>
        
        {/* Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-gray-400">
          {/* <img src={user?.avatarUrl} alt="Admin" /> */}
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center text-sm text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
          title="Keluar"
        >
          <Icon icon="mdi:logout" className="w-5 h-5" />
          <span className="ml-2 md:hidden">Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;