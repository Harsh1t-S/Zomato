import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, Store, Receipt } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://zomato-production-1f03.up.railway.app/api/orders/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'user-number': user?.number || ''
          }
        });

        if (response.status === 403) {
          setError('You do not have permission to view this order.');
          return;
        }

        if (!response.ok) {
          setError('Order not found.');
          return;
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Failed to fetch order details.');
      }
    };

    if (id && user?.number) {
      fetchOrderDetails();
    }
  }, [id, user]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
        <Link to="/account" className="text-zomato-red font-medium hover:underline">
          Go back to Account
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center">Loading...</div>;
  }

  const renderItemsAndPrices = () => {
    try {
      const items = typeof order.orderedItems === 'string' ? JSON.parse(order.orderedItems) : order.orderedItems;
      const prices = typeof order.ItemPrices === 'string' ? JSON.parse(order.ItemPrices) : order.ItemPrices;

      return items.map((item: any, index: number) => {
        const priceObj = prices[index];
        return (
          <div key={index} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex gap-3">
              <span className="font-medium text-gray-500 w-6">{item.quantity}x</span>
              <span className="text-gray-900">{item.name}</span>
            </div>
            <span className="font-medium text-gray-900">₹{priceObj?.price || 0}</span>
          </div>
        );
      });
    } catch (e) {
      return <div className="text-gray-500 py-3">Could not load items</div>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/account" className="flex items-center gap-2 text-sm text-gray-500 hover:text-zomato-red mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.Orderid}</h1>
            <p className="text-gray-500 mt-1">Status: Delivered</p>
          </div>
        </div>

        <div className="mb-8 pb-8 border-b border-gray-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
            <Store className="w-5 h-5 text-gray-400" />
            {order.restrauntName || 'Restaurant Details'}
          </h2>
          <div className="bg-gray-50 rounded-xl p-6">
            {order.orderedItems ? renderItemsAndPrices() : null}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
            <Receipt className="w-5 h-5 text-gray-400" />
            Bill Summary
          </h2>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone Number</span>
            <span className="font-medium text-gray-900">{order.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date</span>
            <span className="font-medium text-gray-900">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
            <span className="font-bold text-gray-900 text-lg">Grand Total</span>
            <span className="font-bold text-zomato-red text-lg">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}