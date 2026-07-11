import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiJson } from '../lib/api';
import { Store, User, Shield } from 'lucide-react';

type Role = 'customer' | 'vendor' | 'admin';

export default function Login() {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'admin') {
        const data = await apiJson('/api/admin/login', {
          method: 'POST',
          body: JSON.stringify({ username: number, password }),
        });
        login({ id: 'admin', name: 'Admin', role: 'admin', token: data.token });
        navigate('/admin');
        return;
      }

      const endpoint = role === 'vendor' ? '/api/vendors/login' : '/api/users/login';
      const data = await apiJson(endpoint, {
        method: 'POST',
        body: JSON.stringify({ number, password }),
      });

      login({ ...data, name: role === 'vendor' ? data.ownerName : data.name });

      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        const origin = (location.state as any)?.from?.pathname || '/';
        navigate(origin);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-zomato-red mb-2 tracking-tight">zomato</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {role === 'vendor'
              ? 'Business Partner Portal'
              : role === 'admin'
              ? 'Admin Console'
              : 'Discover the best food & drinks'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Login in to your account</p>

          <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                role === 'customer' ? 'bg-white dark:bg-gray-800 text-zomato-red shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <User className="w-4 h-4" /> Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                role === 'vendor' ? 'bg-white dark:bg-gray-800 text-zomato-red shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Store className="w-4 h-4" /> Partner
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                role === 'admin' ? 'bg-white dark:bg-gray-800 text-zomato-red shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="Number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {role === 'admin' ? 'Admin Username' : 'Phone Number'}
              </label>
              <input
                id="Number"
                type="text"
                inputMode={role === 'admin' ? 'text' : 'numeric'}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder={role === 'admin' ? 'Enter admin username' : 'Enter your phone number'}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red dark:focus:border-zomato-red focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30 transition placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red dark:focus:border-zomato-red focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30 transition placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-zomato-red text-sm font-medium transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {role !== 'admin' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-zomato-red focus:ring-zomato-red accent-zomato-red" />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-zomato-red hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zomato-red text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {role !== 'admin' && (
            <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-zomato-red hover:text-red-700 dark:hover:text-red-400 font-bold transition-colors">
                Sign up here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
