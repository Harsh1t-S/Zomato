import { Link, useNavigate } from 'react-router-dom';
import { User, Heart, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Package, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://zomato-production-1f03.up.railway.app/api/orders/all');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const userOrders = data.filter((o: any) => o.number === user?.number);
          setOrders(userOrders.reverse());
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    if (user?.number) {
      fetchOrders();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'orders', icon: Package, label: 'My Orders', desc: 'View your order history' },
    { id: 'favorites', icon: Heart, label: 'Favorites', desc: 'Your saved restaurants' },
    { id: 'addresses', icon: MapPin, label: 'Addresses', desc: 'Manage delivery addresses' },
    { id: 'payments', icon: CreditCard, label: 'Payments', desc: 'Saved cards & wallets' },
    { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Manage your alerts' },
    { id: 'rewards', icon: Gift, label: 'Zomato Gold', desc: 'Your membership benefits' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', desc: 'Get help with your orders' },
  ];

  const renderItems = (itemsData: any) => {
    if (!itemsData) return null;
    try {
      const parsed = typeof itemsData === 'string' ? JSON.parse(itemsData) : itemsData;
      return parsed.map((i: any) => `${i.name} x${i.quantity}`).join(', ');
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-zomato-red to-zomato-red-dark rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-white/80 text-sm mt-1">+91 {user?.number}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-white/70">Orders</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-white/70">Favorites</div>
          </div>
          <div>
            <div className="text-2xl font-bold">₹0</div>
            <div className="text-sm text-white/70">Wallet</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {menuItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors ${
                  idx !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                } ${activeTab === item.id ? 'bg-red-50' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeTab === item.id ? 'bg-zomato-red text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">{item.label}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors text-zomato-red"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Logout</h3>
              </div>
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-500">
                    No recent orders found.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.Orderid} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {order.restrauntName || 'Restaurant Order'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Order #{order.Orderid} • {new Date(order.createdAt).toLocaleString()}
                          </p>
                          {order.orderedItems && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                              {renderItems(order.orderedItems)}
                            </p>
                          )}
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full shrink-0">
                          Delivered
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                        <span className="font-bold text-gray-900 text-lg">₹{order.totalAmount}</span>
                        <Link to={`/order/${order.Orderid}`} className="text-sm text-white bg-zomato-red font-medium px-4 py-2 rounded-lg hover:bg-zomato-red-dark transition-colors">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Favorite Restaurants</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-500 sm:col-span-2">
                  No favorite restaurants saved yet.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Addresses</h2>
              <div className="space-y-4">
                <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-5 text-gray-500 hover:border-zomato-red hover:text-zomato-red transition-colors">
                  + Add new address
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-4">
                <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-5 text-gray-500 hover:border-zomato-red hover:text-zomato-red transition-colors">
                  + Add payment method
                </button>
              </div>
            </div>
          )}

          {(activeTab === 'profile' || activeTab === 'notifications' || activeTab === 'rewards' || activeTab === 'help') && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-500">This section is under development. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}