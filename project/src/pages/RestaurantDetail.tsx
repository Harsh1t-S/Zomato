import { useParams } from 'react-router-dom';
import { Clock, MapPin, Info, IndianRupee, Plus, Minus, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { apiJson } from '../lib/api';
import RatingBadge from '../components/RatingBadge';

export default function RestaurantDetail() {
  const { id } = useParams();
  const { items, addItem, updateQuantity } = useCart();
  const { showToast } = useToast();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<{ [category: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiJson<any[]>('/api/restraunt/all'),
      apiJson<any[]>('/api/food'),
    ])
      .then(([restaurantsData, foodsData]) => {
        const currentRes = restaurantsData.find((r: any) => r.id.toString() === id);
        setRestaurant(currentRes);

        const restaurantFoods = foodsData.filter((f: any) => f.restrauntId.toString() === id);

        const groupedMenu = restaurantFoods.reduce((acc: any, item: any) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {});

        setMenu(groupedMenu);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAdd = (item: any) => {
    if (!restaurant) return;
    const cartItem = {
      id: item.id.toString(),
      name: item.name,
      price: Number(item.price),
      description: item.description || '',
      image: item.imageUrl || '',
      category: item.category || '',
      veg: !!item.veg,
    };

    const result = addItem(cartItem, restaurant.id.toString(), restaurant.name);

    if (result === 'different_restaurant') {
      const existingName = items[0]?.restaurantName;
      const confirmed = window.confirm(
        `Your cart has items from ${existingName}. Starting an order here will clear it. Continue?`
      );
      if (confirmed) {
        addItem(cartItem, restaurant.id.toString(), restaurant.name, true);
        showToast(`Cart cleared — started a new order from ${restaurant.name}`, 'info');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zomato-red"></div></div>;
  }

  if (!restaurant) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold dark:bg-gray-900 dark:text-white">Restaurant not found</div>;
  }

  const cuisines = Array.isArray(restaurant.cuisine)
    ? restaurant.cuisine
    : JSON.parse(restaurant.cuisine || '[]');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900">
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-lg text-white/90 mb-4">{cuisines.join(', ')}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                <RatingBadge rating={restaurant.rating} size="lg" />
                <span className="flex items-center gap-1"><Clock className="w-5 h-5" /> {restaurant.deliveryTime}</span>
                <span className="flex items-center gap-1"><MapPin className="w-5 h-5" /> {restaurant.location}</span>
                <span className="flex items-center gap-1"><IndianRupee className="w-5 h-5" /> {restaurant.priceForTwo} for two</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <Info className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">Address:</span> {restaurant.address}
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Order Online</h2>

        {Object.keys(menu).length === 0 ? (
          <p className="text-gray-500 text-lg py-10">No food items added for this restaurant yet. Check back soon!</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(menu).map(([category, itemsData]) => (
              <div key={category} className="scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  {category}
                  <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                    {itemsData.length}
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itemsData.map((item) => {
                    const cartItem = items.find(i => i.item.id === item.id.toString());
                    const quantity = cartItem?.quantity || 0;

                    return (
                      <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 group">
                        <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' }}
                          />
                        </div>
                        <div className="flex-1 py-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                {item.veg && (
                                  <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-green-600 rounded-sm shrink-0" title="Vegetarian">
                                    <Leaf className="w-2.5 h-2.5 text-green-600 fill-green-600" />
                                  </span>
                                )}
                                {item.name}
                              </h4>
                            </div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center text-base">
                              <IndianRupee className="w-4 h-4" />{item.price}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                          </div>

                          <div className="mt-4 flex justify-end">
                            {quantity === 0 ? (
                              <button
                                onClick={() => handleAdd(item)}
                                className="bg-red-50 text-zomato-red border border-red-200 dark:bg-red-900/20 dark:border-red-900 font-bold px-8 py-2 rounded-lg hover:bg-red-100 transition-colors uppercase text-sm tracking-wide"
                              >
                                Add
                              </button>
                            ) : (
                              <div className="flex items-center gap-3 bg-zomato-red text-white px-3 py-1.5 rounded-lg border border-zomato-red">
                                <button onClick={() => updateQuantity(item.id.toString(), -1)} className="p-1 hover:bg-white/20 rounded">
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold w-4 text-center">{quantity}</span>
                                <button onClick={() => updateQuantity(item.id.toString(), 1)} className="p-1 hover:bg-white/20 rounded">
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
