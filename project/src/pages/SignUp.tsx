import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Building2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  // Shared State
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  
  // Customer State
  const [name, setName] = useState('');

  // Vendor State
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth() as any;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isVendor 
        ? 'https://zomato-production-1f03.up.railway.app/api/vendors/register' // Or http://localhost:8000 for local dev
        : 'https://zomato-production-1f03.up.railway.app/api/users';

      const payload = isVendor 
        ? { ownerName, number, password, businessName, gstNumber }
        : { name, number, password };

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || 'Failed to register account');
      }

      // Automatically log them in after successful registration
      login(isVendor ? { ...data, role: 'vendor' } : data);
      
      // Route them based on their account type
      if (isVendor) {
        navigate('/vendor/dashboard');
      } else {
        navigate('/');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-zomato-red mb-2 tracking-tight">zomato</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isVendor ? 'Partner with us and grow your business' : 'Create an account to continue'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          
          {/* Account Type Toggle */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsVendor(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                !isVendor ? 'bg-white dark:bg-gray-800 text-zomato-red shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <User className="w-4 h-4" /> Customer
            </button>
            <button
              type="button"
              onClick={() => { setIsVendor(true); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${
                isVendor ? 'bg-white dark:bg-gray-800 text-zomato-red shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Store className="w-4 h-4" /> Restaurant Partner
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Conditional Fields based on Account Type */}
            {!isVendor ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner Name</label>
                    <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                       <FileText className="w-4 h-4 text-gray-400" /> GST Number
                    </label>
                    <input type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="22AAAAA0000A1Z5" className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-gray-400" /> Business / Restaurant Name
                  </label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Harshit's Pizza" className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required />
                </div>
              </>
            )}

            {/* Shared Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="10-digit mobile number" className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-zomato-red" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-zomato-red text-sm font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-zomato-red text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-75 flex items-center justify-center">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-zomato-red hover:text-red-700 font-bold">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}