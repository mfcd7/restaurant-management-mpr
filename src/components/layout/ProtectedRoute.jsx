import { Navigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { userRole, loading } = useRestaurant();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect logic based on role if they try to access unauthorized pages
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    if (userRole === 'waiter') return <Navigate to="/waiter" replace />;
    if (userRole === 'kitchen') return <Navigate to="/kds" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
