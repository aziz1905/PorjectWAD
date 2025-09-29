// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { User } from '../type';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    // Jika tidak ada user, arahkan ke halaman login
    return <Navigate to="/masuk" replace />;
  }
  // Jika ada user, tampilkan halaman yang diminta
  return <>{children}</>;
};

export default ProtectedRoute;