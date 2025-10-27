import React from 'react';
import { useAuth } from '../../components/AuthContext'; 
import { Icon } from '@iconify/react';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">
        <span className="hidden md:inline">Dashboard</span> Admin
      </h1>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:inline">
          {user?.email || 'admin@kostumkita.com'}
        </span>
        
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-gray-400">
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