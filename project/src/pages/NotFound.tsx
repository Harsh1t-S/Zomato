import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-9xl font-extrabold text-zomato-red mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8">Looks like this page took a food break. Let's get you back on track.</p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/" className="flex items-center gap-2 bg-zomato-red text-white font-semibold px-6 py-3 rounded-lg hover:bg-zomato-red-dark transition-colors">
          <Home className="w-5 h-5" />
          Go Home
        </Link>
        <Link to="/search" className="flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Search className="w-5 h-5" />
          Search
        </Link>
      </div>
    </div>
  );
}
