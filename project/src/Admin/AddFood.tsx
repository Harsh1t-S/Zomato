import { useState, useEffect } from 'react';
import { Utensils, PlusCircle, Image as ImageIcon, FileText, IndianRupee, Store, Tag, CheckCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AddFood() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    restrauntId: '',
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetch('https://zomato-production-1f03.up.railway.app/api/restraunt/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRestaurants(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        restrauntId: parseInt(formData.restrauntId)
      };

      const response = await fetch('https://zomato-production-1f03.up.railway.app/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add food item');

      setSuccess(true);
      setFormData({
        restrauntId: formData.restrauntId,
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <Utensils className="w-8 h-8 text-zomato-red" />
              Add Menu Item
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Create new food items and assign them to existing restaurants.
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-8 transition-colors duration-300">
          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Food item added successfully to database!
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                <Store className="w-4 h-4 text-gray-400" />
                Select Restaurant
              </label>
              <select
                required
                value={formData.restrauntId}
                onChange={e => setFormData({...formData, restrauntId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-zomato-red dark:focus:border-zomato-red outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="" disabled className="text-gray-500">Choose a restaurant...</option>
                {restaurants.map(r => (
                  <option key={r.id} value={r.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    {r.name} (ID: {r.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  <Utensils className="w-4 h-4 text-gray-400" />
                  Food Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Butter Chicken"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-zomato-red dark:focus:border-zomato-red outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  <IndianRupee className="w-4 h-4 text-gray-400" />
                  Price (₹)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-zomato-red dark:focus:border-zomato-red outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  <Tag className="w-4 h-4 text-gray-400" />
                  Category
                </label>
                <input
                  required
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g. Main Course, Starter"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-zomato-red dark:focus:border-zomato-red outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                  Image URL
                </label>
                <input
                  required
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-zomato-red dark:focus:border-zomato-red outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                <FileText className="w-4 h-4 text-gray-400" />
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the dish ingredients and flavor..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-zomato-red dark:focus:border-zomato-red outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zomato-red text-white font-bold py-3.5 rounded-xl hover:bg-zomato-red-dark transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Adding Food...' : <><PlusCircle className="w-5 h-5" /> Submit to Database</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}