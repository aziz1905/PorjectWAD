import { Outlet, Navigate } from 'react-router-dom';
import CompNavbar from './Comp_Navbar';
import CompFooter from './Comp_Footer';
import { useAuth } from './AuthContext'; // Import useAuth

const Layout = () => {
  // Panggil useAuth di sini
  const { user } = useAuth();

  // Jika user login sebagai admin, tendang dari layout customer
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="kostumkita-top">
        <CompNavbar />
      </header>
      
      <main className="kostumkita-main">
        <Outlet />
      </main>

      <footer>
        <CompFooter />
      </footer>
    </div>
  );
};

export default Layout;