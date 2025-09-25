import React from 'react';
import { Outlet } from 'react-router-dom';
import CompNavbar from './Comp_Navbar';
import CompFooter from './Comp_Footer';

const Layout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="kostumkita-top">
        <CompNavbar />
      </header>
      
      <main className="kostumkita-main">
        <Outlet />
      </main>

      <CompFooter />
    </div>
  );
};

export default Layout;