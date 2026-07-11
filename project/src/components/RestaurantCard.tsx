import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, IndianRupee } from 'lucide-react';
import type { Restaurant } from '../data/restaurants';

function ratingColor(rating: number) {
  if (rating >= 4.0) return '#267E3E';
  if (rating >= 3.0) return '#E5A800';
  return '#CB202D';
}

export default function RestaurantCard({ restaurant }: { restaurant: Partial<Restaurant> & { id: string; name: string } }) {
  const cuisine: string[] = Array.isArray(restaurant.cuisine)
    ? restaurant.cuisine
    : JSON.parse((restaurant.cuisine as unknown as string) || '[]');

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/800x600/f5f5f5/cccccc?text=${encodeURIComponent(restaurant.name)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        {restaurant.promoted && (
          <span className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            PROMOTED
          </span>
        )}
        {restaurant.pureVeg && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
            <span className="w-2 h-2 border border-white rounded-sm bg-white"></span>
            PURE VEG
          </span>
        )}
        {restaurant.offer && (
          <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur text-zomato-red text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
            {restaurant.offer}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-zomato-red transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-md text-white text-sm font-semibold shrink-0"
            style={{ backgroundColor: ratingColor(Number(restaurant.rating) || 0) }}
          >
            <span>{restaurant.rating}</span>
            <Star className="w-3 h-3 fill-white" />
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
          {cuisine.join(' · ')}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{restaurant.priceForTwo}</span>
            <span className="text-gray-400">for two</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="line-clamp-1">{restaurant.location} · {restaurant.distance}</span>
        </div>
      </div>
    </Link>
  );
}

