import { Link } from 'react-router-dom';
import { collections, restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { ChevronRight } from 'lucide-react';

export default function Collections() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Collections</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Collections</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore curated lists of top restaurants, cafes, pubs, and bars in Delhi NCR,
            based on trends, themes, and occasions
          </p>
        </div>
      </div>

      {/* Collections grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              to="/search"
              className="group relative h-64 rounded-2xl overflow-hidden"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x400/1a1a1a/ffffff?text=${encodeURIComponent(col.title)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{col.title}</h3>
                <p className="text-sm text-white/80 mb-2">{col.description}</p>
                <p className="text-sm font-medium text-white/90">{col.places} Places →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All restaurants */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
