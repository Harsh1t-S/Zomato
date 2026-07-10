import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { SlidersHorizontal, Leaf, X, Search } from 'lucide-react';
import { restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'time' | 'cost-low' | 'cost-high'>('relevance');
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [filterCost, setFilterCost] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const activeQuery = searchInput || query;

  const filtered = useMemo(() => {
    let result = [...restaurants];

    if (activeQuery) {
      const q = activeQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
          r.popularDishes.some((d) => d.toLowerCase().includes(q))
      );
    }

    if (filterVeg) result = result.filter((r) => r.pureVeg);
    if (filterRating > 0) result = result.filter((r) => r.rating >= filterRating);

    if (filterCost === 'low') result = result.filter((r) => r.priceForTwo <= 500);
    else if (filterCost === 'mid') result = result.filter((r) => r.priceForTwo > 500 && r.priceForTwo <= 1500);
    else if (filterCost === 'high') result = result.filter((r) => r.priceForTwo > 1500);

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'time':
        result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case 'cost-low':
        result.sort((a, b) => a.priceForTwo - b.priceForTwo);
        break;
      case 'cost-high':
        result.sort((a, b) => b.priceForTwo - a.priceForTwo);
        break;
    }

    return result;
  }, [activeQuery, filterVeg, filterRating, filterCost, sortBy]);

  const activeFilters = (filterVeg ? 1 : 0) + (filterRating > 0 ? 1 : 0) + (filterCost !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setFilterVeg(false);
    setFilterRating(0);
    setFilterCost('all');
    setSortBy('relevance');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for restaurants, cuisines or dishes"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-zomato-red focus:ring-1 focus:ring-zomato-red outline-none"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'} lg:block lg:relative lg:bg-transparent lg:z-auto`}>
          {showFilters && <div className="fixed inset-0" onClick={() => setShowFilters(false)} />}
          <div className={`${showFilters ? 'fixed right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto z-50 animate-slide-down' : ''} lg:static lg:w-64 lg:bg-transparent lg:p-0`}>
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <div className="flex items-center gap-3">
                  {activeFilters > 0 && (
                    <button onClick={clearFilters} className="text-sm text-zomato-red font-medium hover:underline">
                      Clear all
                    </button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="lg:hidden">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Sort by</h4>
                <div className="space-y-2">
                  {[
                    { key: 'relevance', label: 'Relevance' },
                    { key: 'rating', label: 'Rating: High to Low' },
                    { key: 'time', label: 'Delivery Time' },
                    { key: 'cost-low', label: 'Cost: Low to High' },
                    { key: 'cost-high', label: 'Cost: High to Low' },
                  ].map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-zomato-red">
                      <input
                        type="radio"
                        name="sort"
                        checked={sortBy === opt.key}
                        onChange={() => setSortBy(opt.key as typeof sortBy)}
                        className="accent-zomato-red"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Veg */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Dietary</h4>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-zomato-red">
                  <input
                    type="checkbox"
                    checked={filterVeg}
                    onChange={(e) => setFilterVeg(e.target.checked)}
                    className="accent-zomato-red"
                  />
                  <Leaf className="w-4 h-4 text-green-500" />
                  Pure Veg
                </label>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 0].map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-zomato-red">
                      <input
                        type="radio"
                        name="rating"
                        checked={filterRating === r}
                        onChange={() => setFilterRating(r)}
                        className="accent-zomato-red"
                      />
                      {r === 0 ? 'All ratings' : `${r}+ rated`}
                    </label>
                  ))}
                </div>
              </div>

              {/* Cost */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Cost for two</h4>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: 'Any cost' },
                    { key: 'low', label: '₹500 or less' },
                    { key: 'mid', label: '₹500 - ₹1500' },
                    { key: 'high', label: '₹1500+' },
                  ].map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-zomato-red">
                      <input
                        type="radio"
                        name="cost"
                        checked={filterCost === opt.key}
                        onChange={() => setFilterCost(opt.key as typeof filterCost)}
                        className="accent-zomato-red"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeQuery ? `Results for "${activeQuery}"` : 'All Restaurants'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{filtered.length} restaurants found</p>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters > 0 && (
                <span className="bg-zomato-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="text-zomato-red font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
