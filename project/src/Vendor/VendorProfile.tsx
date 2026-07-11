import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiJson } from '../lib/api';
import { Store, Phone, FileText, Building2, MapPin, Clock, IndianRupee, Pencil, Check, X, AlertTriangle } from 'lucide-react';

interface RestaurantData {
  id: string;
  name: string;
  location: string;
  address: string;
  cuisine: string[];
  phone: string;
  hours: string;
  priceForTwo: number;
  image: string;
}

export default function VendorProfile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<RestaurantData & { cuisineText: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [accountEditing, setAccountEditing] = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountForm, setAccountForm] = useState({
    ownerName: user?.ownerName || user?.name || '',
    businessName: user?.businessName || '',
    gstNumber: user?.gstNumber || '',
  });

  useEffect(() => {
    if (!user?.restaurantId) return;
    apiJson<RestaurantData>(`/api/restraunt/${user.restaurantId}`)
      .then((data) => {
        setRestaurant(data);
        setForm({ ...data, cuisineText: (data.cuisine || []).join(', ') });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.restaurantId]);

  const handleSave = async () => {
    if (!restaurant) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        cuisine: (form.cuisineText || '').split(',').map((c) => c.trim()).filter(Boolean),
      };
      delete (payload as any).cuisineText;

      const updated = await apiJson<RestaurantData>(`/api/restraunt/update/${restaurant.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setRestaurant(updated);
      setEditing(false);
      setSuccess('Profile updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleAccountSave = async () => {
    if (!user) return;
    setAccountSaving(true);
    setError('');
    try {
      const data = await apiJson<any>(`/api/vendors/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(accountForm),
      });
      updateUser({
        ownerName: data.ownerName,
        businessName: data.businessName,
        gstNumber: data.gstNumber,
        isApproved: data.isApproved,
        name: data.ownerName,
      });
      setAccountEditing(false);
      if (data.reapprovalRequired) {
        showToast('Saved. Since you changed your business name or GST number, your listing needs admin re-approval and will be hidden from customers until then.', 'info');
      } else {
        showToast('Account details updated.', 'success');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setAccountSaving(false);
    }
  };

  const field = (label: string, icon: React.ReactNode, key: keyof RestaurantData, value: string | number | undefined) => (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      {editing ? (
        <input
          value={(form as any)[key] ?? ''}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none"
        />
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          {icon}
          <span className="text-gray-900 dark:text-white font-medium">{value || 'Not provided'}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Store className="text-zomato-red" /> Restaurant Profile
        </h1>
        {restaurant && !loading && (
          editing ? (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setForm({ ...restaurant, cuisineText: (restaurant.cuisine || []).join(', ') }); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zomato-red text-white hover:bg-red-600 text-sm font-medium disabled:opacity-70">
                <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zomato-red text-white hover:bg-red-600 text-sm font-medium">
              <Pencil className="w-4 h-4" /> Edit
            </button>
          )
        )}
      </div>

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Business Account</h2>
            {accountEditing ? (
              <div className="flex gap-2">
                <button onClick={() => {
                  setAccountEditing(false);
                  setAccountForm({ ownerName: user?.ownerName || user?.name || '', businessName: user?.businessName || '', gstNumber: user?.gstNumber || '' });
                }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-medium">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button onClick={handleAccountSave} disabled={accountSaving}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zomato-red text-white hover:bg-red-600 text-xs font-medium disabled:opacity-70">
                  <Check className="w-3.5 h-3.5" /> {accountSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            ) : (
              <button onClick={() => setAccountEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-medium">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          {accountEditing && (
            <div className="mb-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs px-3 py-2.5 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Changing your business name or GST number will re-trigger admin approval — your restaurant will be temporarily hidden from customers until reviewed.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Business / Restaurant Name</label>
              {accountEditing ? (
                <input
                  value={accountForm.businessName}
                  onChange={(e) => setAccountForm({ ...accountForm, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white font-medium">{user?.businessName || 'Not Provided'}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Owner Name</label>
              {accountEditing ? (
                <input
                  value={accountForm.ownerName}
                  onChange={(e) => setAccountForm({ ...accountForm, ownerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white font-medium">{user?.ownerName || user?.name || 'Not Provided'}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Registered Phone</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">{user?.number || 'Not Provided'}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">GST Number</label>
              {accountEditing ? (
                <input
                  value={accountForm.gstNumber}
                  onChange={(e) => setAccountForm({ ...accountForm, gstNumber: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white font-medium">{user?.gstNumber || 'N/A'}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Phone number is your login ID and can't be changed here — contact support if it needs to change.</p>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">Restaurant Listing</h2>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          ) : !restaurant ? (
            <p className="text-gray-500 dark:text-gray-400">No restaurant found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {field('Restaurant Name', <Store className="w-5 h-5 text-gray-400" />, 'name', restaurant.name)}
              {field('Area / Locality', <MapPin className="w-5 h-5 text-gray-400" />, 'location', restaurant.location)}
              {field('Full Address', <MapPin className="w-5 h-5 text-gray-400" />, 'address', restaurant.address)}
              {field('Contact Phone', <Phone className="w-5 h-5 text-gray-400" />, 'phone', restaurant.phone)}
              {field('Operating Hours', <Clock className="w-5 h-5 text-gray-400" />, 'hours', restaurant.hours)}
              {field('Cost for Two (₹)', <IndianRupee className="w-5 h-5 text-gray-400" />, 'priceForTwo', restaurant.priceForTwo)}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Cuisines</label>
                {editing ? (
                  <input
                    value={form.cuisineText || ''}
                    onChange={(e) => setForm({ ...form, cuisineText: e.target.value })}
                    placeholder="North Indian, Chinese"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-zomato-red outline-none"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(restaurant.cuisine || []).map((c) => (
                      <span key={c} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
