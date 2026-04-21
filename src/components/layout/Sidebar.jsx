import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ChefHat, UtensilsCrossed, LogOut } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function Sidebar() {
  const { userRole, logout, logoutAuth } = useRestaurant();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Admin', path: '/admin', icon: Users, roles: ['admin'] },
    { name: 'Kitchen (KDS)', path: '/kds', icon: ChefHat, roles: ['admin', 'kitchen'] },
    { name: 'Waiter Tab', path: '/waiter', icon: UtensilsCrossed, roles: ['admin', 'waiter'] },
  ];

  const filteredNavItems = navItems.filter(item => !userRole || item.roles.includes(userRole));

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  const handleSignOutAccount = async (e) => {
    e.preventDefault();
    await logoutAuth();
    navigate('/login');
  };

  return (
    <div className="flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/50 min-h-screen">
      <div className="flex items-center justify-center pt-8 pb-6 border-b border-slate-200/50 px-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <img src="/logo.png" alt="RestoDash Logo" className="w-12 h-12 object-contain drop-shadow-md" />
          <img src="/logo-text.png" alt="RestoDash" className="h-6 object-contain drop-shadow-sm hidden md:block" />
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Users className="w-5 h-5" />
          Switch Role
        </button>
        <button
          onClick={handleSignOutAccount}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out Account
        </button>
      </div>
    </div>
  );
}
