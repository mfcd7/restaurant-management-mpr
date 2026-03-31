import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Shield, UtensilsCrossed, Utensils } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export default function LoginPage() {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();
  const { login } = useRestaurant();

  const handleLogin = (e) => {
    e.preventDefault();
    login(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'waiter') navigate('/waiter');
    else if (role === 'kitchen') navigate('/kds');
    else navigate('/admin'); // fallback
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
            <ChefHat className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
          Sign in to RMS Pro
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                Select your role
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    role === 'admin' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-200 hover:border-indigo-300 text-slate-500'
                  }`}
                >
                  <Shield className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('kitchen')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    role === 'kitchen' 
                      ? 'border-rose-500 bg-rose-50 text-rose-700' 
                      : 'border-slate-200 hover:border-rose-300 text-slate-500'
                  }`}
                >
                  <Utensils className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Kitchen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('waiter')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    role === 'waiter' 
                      ? 'border-teal-600 bg-teal-50 text-teal-700' 
                      : 'border-slate-200 hover:border-teal-300 text-slate-500'
                  }`}
                >
                  <UtensilsCrossed className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Waiter</span>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mt-6"
              >
                Sign in as {role.charAt(0).toUpperCase() + role.slice(1)} <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            
          </form>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          &larr; Back to website
        </Link>
      </div>
    </div>
  );
}
