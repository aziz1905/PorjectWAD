import { Outlet } from 'react-router-dom';
import CompNavbar from './Comp_Navbar';
import CompFooter from './Comp_Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <CompNavbar />
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer>
        <CompFooter />
      </footer>
    </div>
  );
};

export default Layout;