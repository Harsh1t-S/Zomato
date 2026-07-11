import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, User } from 'lucide-react';

export default function Login() {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth() as any;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Dynamically choose the API endpoint based on the toggle
    const endpoint = isVendor 
      ? 'https://zomato-production-1f03.up.railway.app/api/vendors/login'
      : 'https://zomato-production-1f03.up.railway.app/api/users/login';

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, password })
      });

      if (!resp.ok) {
        setError('Invalid phone number or password.');
      } else {
        const data = await resp.json();
        login(data);
        
        // Redirect logic based on role
        if (data.role === 'vendor') {
            navigate('/vendor/dashboard');
        } else {
            const origin = location.state?.from?.pathname || '/';
            navigate(origin);
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
            {isVendor ? 'Business Partner Portal' : 'Discover the best food & drinks'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          
          {/* Toggle Switch */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setIsVendor(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                !isVendor ? 'bg-white dark:bg-gray-800 text-zomato-red shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <User className="w-4 h-4" /> Customer
            </button>
            <button
              type="button"
              onClick={() => setIsVendor(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                isVendor ? 'bg-white dark:bg-gray-800 text-zomato-red shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Store className="w-4 h-4" /> Restaurant Partner
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-zomato-red text-sm font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-zomato-red text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-75">
              {loading ? 'Logging in...' : 'Login In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}