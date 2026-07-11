import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VendorOrders() {
  const { user } = useAuth() as any;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrders([
        { id: '#ORD-123', items: '2x Butter Chicken, 4x Naan', total: 850, status: 'Preparing', time: '10 mins ago' }
      ] as any);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-2">
        <ClipboardList className="text-zomato-red" /> Live Orders
      </h1>
      
      <div className="grid gap-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg dark:text-white">{order.id}</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-bold">
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{order.items}</p>
              <p className="text-sm text-gray-500 mt-1">Received: {order.time}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl dark:text-white mb-3">₹{order.total}</p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <CheckCircle className="w-4 h-4" /> Mark Ready
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}