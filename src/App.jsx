import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import KDSPage from './pages/KDSPage';
import WaiterPage from './pages/WaiterPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { RestaurantProvider } from './context/RestaurantContext';

function App() {
  return (
    <RestaurantProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Internal Dashboard Routes */}
          <Route element={<Layout />}>
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
            <Route path="/kds" element={<ProtectedRoute allowedRoles={['admin', 'kitchen']}><KDSPage /></ProtectedRoute>} />
            <Route path="/waiter" element={<ProtectedRoute allowedRoles={['admin', 'waiter']}><WaiterPage /></ProtectedRoute>} />
          </Route>
          
          {/* Catch-all route mapping to home or login might also be good, but we leave it default for now */}
        </Routes>
      </Router>
    </RestaurantProvider>
  );
}

export default App;
