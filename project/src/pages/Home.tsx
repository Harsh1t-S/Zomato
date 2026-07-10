import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Utensils, Leaf, Clock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cities } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import SectionHeader from '../components/SectionHeader';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Delhi NCR');
  const [locationOpen, setLocationOpen] = useState(false);
  
  const [liveRestaurants, setLiveRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://zomato-production-1f03.up.railway.app/api/restraunt/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLiveRestaurants(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredRestaurants = liveRestaurants.filter((r) => r.promoted);
  const trendingRestaurants = [...liveRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="absolute inset-0">
          <video
            src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            autoPlay loop muted
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <img 
            src="https://b.zmtcdn.com/web_assets/8313a97515fcb0447d2d77c276532a511583262271.png" 
            alt="Zomato" 
            className="w-64 md:w-96 mb-6 drop-shadow-2xl"
          />
          <p className="text-2xl md:text-4xl text-white mb-10 font-medium drop-shadow-lg">
            Discover the best food & drinks in {location}
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 w-full max-w-4xl mx-auto">
            <div className="relative md:w-56">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="w-full flex items-center gap-2 px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border-r border-gray-200 dark:border-gray-700 text-left"
              >
                <MapPin className="w-6 h-6 text-zomato-red shrink-0" />
                <span className="text-base font-medium text-gray-700 dark:text-gray-200 truncate">{location}</span>
                <ChevronDown className="w-5 h-5 text-gray-400 ml-auto" />
              </button>
              {locationOpen && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2 max-h-64 overflow-y-auto z-10 animate-slide-down text-left">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setLocation(city); setLocationOpen(false); }}
                      className="w-full text-left px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurant, cuisine or a dish"
                className="w-full pl-14 pr-4 py-3.5 rounded-lg outline-none text-gray-700 dark:text-gray-200 bg-transparent text-base"
              />
            </form>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/search?filter=delivery" className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-red-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6 text-zomato-red" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Order Online</h3>
            <p className="text-sm text-gray-500">Stay home and order to your doorstep</p>
          </Link>
          <Link to="/search?filter=dining" className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Dining Out</h3>
            <p className="text-sm text-gray-500">View the city's favourite dining venues</p>
          </Link>
          <Link to="/search?filter=nightlife" className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Nightlife</h3>
            <p className="text-sm text-gray-500">Explore the city's top nightlife outlets</p>
          </Link>
          <Link to="/search?filter=healthy" className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Healthy Food</h3>
            <p className="text-sm text-gray-500">Discover nutritious and healthy options</p>
          </Link>
        </div>
      </section>

      {!loading && (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SectionHeader title="Trending This Week" subtitle="Most loved restaurants in town right now" link="/search" linkText="See all restaurants" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          </section>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SectionHeader title="Featured Restaurants" subtitle="Handpicked premium dining experiences" link="/search" linkText="See all" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          </section>
        </>
      )}
    </div>
  );
}