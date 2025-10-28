import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
          {/* Outlet akan merender halaman (LogTransaksi, StatusProduk, EditProduk) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;