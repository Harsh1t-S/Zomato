import { useState, useEffect } from 'react';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiJson } from '../lib/api';

interface Order {
  Orderid: string;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  orderedItems: any;
  number: string;
}

const STATUS_FLOW = ['placed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

const STATUS_STYLES: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  preparing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  ready: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  out_for_delivery: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

function renderItems(itemsData: any) {
  try {
    const parsed = typeof itemsData === 'string' ? JSON.parse(itemsData) : itemsData;
    return parsed.map((i: any) => `${i.quantity}x ${i.name}`).join(', ');
  } catch {
    return '—';
  }
}

export default function VendorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    if (!user?.restaurantId) return;
    setLoading(true);
    try {
      const data = await apiJson<Order[]>(`/api/orders/restaurant/${user.restaurantId}`);
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.restaurantId]);

  const advanceStatus = async (order: Order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    const next = STATUS_FLOW[idx + 1];
    if (!next) return;

    setUpdatingId(order.Orderid);
    try {
      await apiJson(`/api/orders/${order.Orderid}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: next }),
      });
      setOrders((prev) => prev.map((o) => (o.Orderid === order.Orderid ? { ...o, status: next } : o)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-2">
        <ClipboardList className="text-zomato-red" /> Live Orders
      </h1>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-10 text-center text-gray-500 dark:text-gray-400">
          No orders yet — they'll show up here as soon as customers order from you.
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const nextIdx = STATUS_FLOW.indexOf(order.status) + 1;
            const nextLabel = STATUS_FLOW[nextIdx]?.replace(/_/g, ' ');
            const isFinal = order.status === 'delivered' || order.status === 'cancelled';

            return (
              <div key={order.Orderid} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg dark:text-white">#{order.Orderid}</span>
                    <span className={`capitalize px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[order.status] || STATUS_STYLES.placed}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{renderItems(order.orderedItems)}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-xl dark:text-white mb-3">₹{order.totalAmount}</p>
                  {!isFinal && (
                    <button
                      onClick={() => advanceStatus(order)}
                      disabled={updatingId === order.Orderid}
                      className="bg-zomato-red hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {updatingId === order.Orderid ? 'Updating...' : <>Mark {nextLabel} <ChevronRight className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
