import { Outlet } from 'react-router-dom';
import CompNavbar from './Comp_Navbar';
import CompFooter from './Comp_Footer';


import { User } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

const Layout = ({ user, onLogout }: LayoutProps) => {
  return (
    <div >
      <header className="kostumkita-top">
      <CompNavbar user={user} onLogout={onLogout} />
      </header>
      
      
      <main className="kostumkita-main">
        <Outlet />
      </main>

      <CompFooter />
    </div>
  );
};

export default Layout;


