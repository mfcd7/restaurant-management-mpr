import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ChefHat, UtensilsCrossed, LogOut } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function Sidebar() {
  const { userRole, logout } = useRestaurant();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin'] },
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

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-slate-200 px-4">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <ChefHat className="w-6 h-6" />
          RMS Pro
        </h1>
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

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Exit to Website
        </button>
      </div>
    </div>
  );
}
