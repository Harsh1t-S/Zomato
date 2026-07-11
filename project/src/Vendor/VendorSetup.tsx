import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Phone, Clock, IndianRupee, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiJson } from '../lib/api';

export default function VendorSetup() {
  const { user, setRestaurantId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: user?.businessName || '',
    location: '',
    address: '',
    cuisine: '',
    phone: '',
    hours: '11:00 AM - 11:00 PM',
    priceForTwo: '',
    image: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        id: `v${user?.id}-${Date.now()}`,
        name: form.name,
        location: form.location,
        address: form.address,
        cuisine: form.cuisine.split(',').map((c) => c.trim()).filter(Boolean),
        phone: form.phone,
        hours: form.hours,
        priceForTwo: Number(form.priceForTwo) || 0,
        image: form.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        rating: 0,
        deliveryTime: '30-40 min',
        distance: '—',
        menu: [],
        reviews: [],
      };

      const restaurant = await apiJson('/api/restraunt/add', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setRestaurantId(restaurant.id);
      navigate('/vendor/menu');
    } catch (err: any) {
      setError(err.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Store className="text-zomato-red" /> Set Up Your Restaurant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          This profile is what customers will see. You can add menu items right after.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Restaurant Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-gray-400" /> Area / Locality
            </label>
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Hazratganj" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              <Phone className="w-4 h-4 text-gray-400" /> Contact Phone
            </label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Full Address</label>
          <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Cuisines (comma separated)</label>
          <input required value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
            placeholder="North Indian, Chinese" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 text-gray-400" /> Operating Hours
            </label>
            <input required value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              <IndianRupee className="w-4 h-4 text-gray-400" /> Cost for Two (₹)
            </label>
            <input required type="number" value={form.priceForTwo} onChange={(e) => setForm({ ...form, priceForTwo: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            <ImageIcon className="w-4 h-4 text-gray-400" /> Cover Image URL <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-zomato-red text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-75">
          {loading ? 'Creating...' : 'Create Restaurant & Continue'}
        </button>
      </form>
    </div>
  );
}
