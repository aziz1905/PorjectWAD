import { Navigate } from 'react-router-dom';
import { User } from '../type';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/masuk" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;