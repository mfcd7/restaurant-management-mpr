import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ChefHat, UtensilsCrossed, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Admin', path: '/admin', icon: Users },
    { name: 'Kitchen (KDS)', path: '/kds', icon: ChefHat },
    { name: 'Waiter Tab', path: '/waiter', icon: UtensilsCrossed },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-slate-200 px-4">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <ChefHat className="w-6 h-6" />
          RMS Pro
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
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
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Exit to Website
        </NavLink>
      </div>
    </div>
  );
}
