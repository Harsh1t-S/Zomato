import { useState, useEffect } from 'react';
import { Utensils, PlusCircle, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiJson } from '../lib/api';

interface FoodItem {
  id: number;
  restrauntId: number | string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  imageUrl: string;
  veg: boolean;
}

const emptyForm = { name: '', description: '', price: '', category: '', imageUrl: '', veg: false };

export default function VendorMenu() {
  const { user } = useAuth();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const restaurantId = user?.restaurantId;

  const loadItems = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const all = await apiJson<FoodItem[]>('/api/food');
      setItems(all.filter((f) => String(f.restrauntId) === String(restaurantId)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const startEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category: item.category || '',
      imageUrl: item.imageUrl || '',
      veg: !!item.veg,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = { ...formData, price: parseFloat(formData.price) };

      if (editingId) {
        await apiJson(`/api/food/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
        setSuccess('Dish updated.');
      } else {
        await apiJson('/api/food', { method: 'POST', body: JSON.stringify({ ...payload, restrauntId: restaurantId }) });
        setSuccess('Dish added to your menu.');
      }

      resetForm();
      loadItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this dish from your menu?')) return;
    try {
      await apiJson(`/api/food/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const grouped = items.reduce<Record<string, FoodItem[]>>((acc, item) => {
    const cat = item.category || 'Other';
    (acc[cat] = acc[cat] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Utensils className="text-zomato-red" /> Manage Menu
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} dish{items.length !== 1 ? 'es' : ''} on your menu</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Dish' : 'Add New Dish'}</h2>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-gray-500 hover:text-zomato-red flex items-center gap-1">
              <X className="w-4 h-4" /> Cancel edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Food Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Price (₹)</label>
              <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Category</label>
              <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Starters, Mains" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Image URL</label>
              <input required type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={formData.veg} onChange={e => setFormData({...formData, veg: e.target.checked})} className="w-4 h-4 accent-green-600" />
            This is a vegetarian dish
          </label>
          <button type="submit" disabled={submitting} className="bg-zomato-red text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-75">
            {submitting ? 'Saving...' : <><PlusCircle className="w-5 h-5" /> {editingId ? 'Save Changes' : 'Add to Menu'}</>}
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Dishes</h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading menu...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No dishes yet — add your first one above.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, dishes]) => (
            <div key={category}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dishes.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/100x100/f5f5f5/cccccc?text=${encodeURIComponent(item.name)}`; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                        {item.veg && (
                          <span className="inline-flex items-center justify-center w-3.5 h-3.5 border-2 border-green-600 rounded-sm shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          </span>
                        )}
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-zomato-red">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
