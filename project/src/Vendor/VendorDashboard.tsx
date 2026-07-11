import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Utensils, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiJson } from '../lib/api';

interface Order {
  Orderid: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [foodCount, setFoodCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.restaurantId) return;

    const load = async () => {
      try {
        const [ordersData, foodData] = await Promise.all([
          apiJson<Order[]>(`/api/orders/restaurant/${user.restaurantId}`),
          apiJson<any[]>('/api/food'),
        ]);
        setOrders(ordersData);
        setFoodCount(foodData.filter((f) => String(f.restrauntId) === String(user.restaurantId)).length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.restaurantId]);

  const today = new Date().toDateString();
  const todaysOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const pendingOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const stats = [
    { label: "Today's Orders", value: todaysOrders.length, icon: ShoppingBag, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: "Today's Revenue", value: `₹${todaysRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Menu Items', value: foodCount, icon: Utensils, color: 'text-zomato-red bg-red-50 dark:bg-red-900/20' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">Dashboard Overview</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">All-time revenue: ₹{totalRevenue.toLocaleString('en-IN')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '—' : s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/vendor/orders" className="text-sm text-zomato-red font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-6">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm py-6">No orders yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.slice(0, 5).map((o) => (
              <div key={o.Orderid} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">#{o.Orderid}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {o.status.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{o.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
