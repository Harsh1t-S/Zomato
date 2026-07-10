import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cities } from '../data/restaurants';

export default function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useAuth();
  
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState('Delhi NCR');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileMenu(false);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold text-zomato-red tracking-tight">zomato</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-3xl items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 border-r border-gray-200"
              >
                <MapPin className="w-5 h-5 text-zomato-red" />
                <span className="text-sm font-medium text-gray-700">{location}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {locationOpen && (
                <div className="absolute top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 max-h-64 overflow-y-auto animate-slide-down">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocation(city);
                        setLocationOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurant, cuisine or a dish"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-zomato-red focus:ring-1 focus:ring-zomato-red outline-none text-sm bg-transparent"
              />
            </form>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-zomato-red rounded-full hover:bg-gray-50 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/collections" className="text-sm font-medium text-gray-700 hover:text-zomato-red transition-colors">
              Collections
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/cart" className="relative flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-zomato-red transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden lg:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zomato-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <Link to="/account" className="ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-zomato-red font-bold text-sm hover:bg-red-200 transition">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Link>
              ) : (
                <Link to="/login" className="ml-1 inline-flex items-center px-3 py-1.5 border border-zomato-red text-zomato-red rounded-lg text-sm font-medium hover:bg-zomato-red/10 transition">
                  Login
                </Link>
              )}
            </div>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-gray-700">
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurant, cuisine or a dish"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none text-sm bg-transparent text-gray-900"
              />
            </form>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { toggleTheme(); setMobileMenu(false); }}
                className="text-sm font-medium text-gray-700 py-2 flex items-center gap-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              <Link to="/collections" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-gray-700 py-2">
                Collections
              </Link>
              <div className="flex items-center gap-3">
                <Link to="/cart" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-gray-700 py-2 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Cart ({totalItems})
                </Link>
                {isLoggedIn ? (
                  <Link to="/account" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-zomato-red py-2 border border-zomato-red rounded-lg px-3">
                    Account
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenu(false)} className="text-sm font-medium text-zomato-red py-2 border border-zomato-red rounded-lg px-3">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}