import { Navigate } from 'react-router-dom';
// 1. Import useAuth dan interface User dari AuthContext
import { useAuth, User } from './AuthContext'; 

// 2. Ubah props, hanya terima 'children'
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // 3. Panggil useAuth() DI DALAM komponen
  const { user } = useAuth(); 

  if (!user) {
    // 4. Jika tidak ada user, tendang ke /masuk
    return <Navigate to="/masuk" replace />;
  }
  
  // Jika ada user, tampilkan halaman
  return <>{children}</>;
};

export default ProtectedRoute;
