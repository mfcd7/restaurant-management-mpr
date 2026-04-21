import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Shield, UtensilsCrossed, Utensils, Mail, Lock, AlertCircle, LogOut } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export default function LoginPage() {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();
  const { authUser, login, loginWithEmail, signUpWithEmail, loginWithGoogle, logoutAuth } = useRestaurant();

  // Auth Form State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleLogin = (e) => {
    e.preventDefault();
    login(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'waiter') navigate('/waiter');
    else if (role === 'kitchen') navigate('/kds');
    else navigate('/admin');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();
      if (isLoginMode) {
        await loginWithEmail(cleanEmail, password);
      } else {
        await signUpWithEmail(cleanEmail, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center justify-center mb-6">
          <img src="/logo.png" alt="RestoDash Logo" className="w-24 h-24 object-contain drop-shadow-xl mb-6" />
          <img src="/logo-text.png" alt="RestoDash" className="h-10 object-contain drop-shadow-md" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-black text-slate-900 tracking-tight drop-shadow-sm">
          {!authUser ? 'Sign in to your account' : 'Select your workspace'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-xl border border-white/50 sm:rounded-2xl sm:px-10">

          {!authUser ? (
            // ==================== AUTHENTICATION UI ====================
            <form className="space-y-5" onSubmit={handleAuthSubmit}>
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-xl text-xs font-medium mb-4 text-center">
                Demo Database unlocked <br />Password is <strong className="font-black border-b border-indigo-300">admin123</strong> for testing!
              </div> */}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 focus:bg-white transition-colors outline-none"
                    placeholder="admin@restodash.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/50 focus:bg-white transition-colors outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white transition-all ${isLoading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                    }`}
                >
                  {isLoading ? 'Authenticating...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
                </button>

                <div className="relative flex items-center justify-center text-sm py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative bg-white/80 px-4 text-slate-500 font-medium">Or</span>
                </div>

                <button
                  type="button"
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // ==================== ROLE SELECTION UI ====================
            <form className="space-y-6" onSubmit={handleRoleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                  Logged in as <span className="font-bold text-indigo-600">{authUser.email}</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'admin'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    <Shield className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('kitchen')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'kitchen'
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-slate-200 hover:border-rose-300 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    <Utensils className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Kitchen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('waiter')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'waiter'
                        ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                        : 'border-slate-200 hover:border-teal-300 text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    <UtensilsCrossed className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Waiter</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => logoutAuth()}
                  className="flex items-center justify-center px-4 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                  title="Sign out from this account"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="flex-1 flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 transition-all"
                >
                  Enter as {role.charAt(0).toUpperCase() + role.slice(1)} <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/" className="text-sm font-medium text-slate-700 bg-white/50 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/80 hover:text-slate-900 transition-colors shadow-sm">
          &larr; Back to website
        </Link>
      </div>
    </div>
  );
}
