import React from 'react';
import { useAuth } from '../../components/AuthContext'; // Sesuaikan path
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Arahkan ke halaman utama setelah logout
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">KostumKita.</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium hidden sm:block">{user?.fullName || 'Admin'}</span>
        {/* Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-bold text-gray-800">
          {user?.fullName?.charAt(0).toUpperCase() || 'A'}
        </div>
        
        {/* Tombol Logout dari desain image_13fa9f.png */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded-md text-gray-300 hover:bg-gray-700"
          title="Keluar"
        >
          <span className="hidden sm:block">Keluar</span>
          <Icon icon="mdi:logout" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;