import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Phone, Shield, Moon, Sun, ShoppingBag, IndianRupee, Store, CheckCircle, Clock, LogOut, Flag, Trash2, Utensils } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiJson } from '../lib/api';

interface User {
    id: number;
    name: string;
    number: string;
}

interface Order {
    Orderid: string;
    number: string;
    totalAmount: number | string;
}

interface Vendor {
    id: number;
    ownerName: string;
    businessName: string;
    number: string;
    isApproved: boolean;
}

interface FoodItem {
    id: number;
    restrauntId: number | string;
    name: string;
    category: string;
    price: number | string;
    isFlagged?: boolean;
}

export default function UserData() {
    const [userData, setUserData] = useState<User[]>([]);
    const [ordersData, setOrdersData] = useState<Order[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [tab, setTab] = useState<'users' | 'vendors' | 'food'>('users');
    const { darkMode, toggleDarkMode } = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const loadData = async () => {
        try {
            const [users, orders, vendorList, food] = await Promise.all([
                apiJson<User[]>('/api/users/all'),
                apiJson<Order[]>('/api/orders/all'),
                apiJson<Vendor[]>('/api/vendors/all'),
                apiJson<FoodItem[]>('/api/food'),
            ]);
            if (Array.isArray(users)) setUserData(users);
            if (Array.isArray(orders)) setOrdersData(orders);
            if (Array.isArray(vendorList)) setVendors(vendorList);
            if (Array.isArray(food)) setFoodItems(food);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const approveVendor = async (id: number) => {
        try {
            await apiJson(`/api/vendors/approve/${id}`, { method: 'PUT' });
            setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, isApproved: true } : v)));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFlagFood = async (id: number, current: boolean) => {
        try {
            const updated = await apiJson<FoodItem>(`/api/food/${id}/flag`, {
                method: 'PATCH',
                body: JSON.stringify({ isFlagged: !current }),
            });
            setFoodItems((prev) => prev.map((f) => (f.id === id ? { ...f, isFlagged: updated.isFlagged } : f)));
        } catch (error) {
            console.error(error);
        }
    };

    const removeFood = async (id: number) => {
        if (!confirm('Remove this food item from the platform?')) return;
        try {
            await apiJson(`/api/food/${id}`, { method: 'DELETE' });
            setFoodItems((prev) => prev.filter((f) => f.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const getUserStats = (number: string) => {
        const userOrders = ordersData.filter(o => o.number === number);
        const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        return { totalOrders: userOrders.length, totalSpent };
    };

    const totalPlatformRevenue = ordersData.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const pendingVendors = vendors.filter((v) => !v.isApproved).length;

    return (
        <div className={`min-h-screen transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className={`text-3xl font-bold flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            <Shield className="w-8 h-8 text-zomato-red" />
                            Admin Dashboard
                        </h1>
                        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage registered users, vendors, and platform activity.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className={`p-3 rounded-xl shadow-sm border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-zomato-red text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/40"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>

                        <div className={`px-5 py-3 rounded-xl shadow-sm border flex items-center gap-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-3 border-r pr-4 border-gray-300/30">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <Users className="w-5 h-5 text-zomato-red" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Users</p>
                                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userData.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <IndianRupee className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Revenue</p>
                                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalPlatformRevenue.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setTab('users')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'users' ? 'bg-zomato-red text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setTab('vendors')}
                        className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'vendors' ? 'bg-zomato-red text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Vendors
                        {pendingVendors > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {pendingVendors}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setTab('food')}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'food' ? 'bg-zomato-red text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Food Items
                    </button>
                </div>

                {tab === 'users' && (
                <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="overflow-x-auto">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={darkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'}>
                                <tr>
                                    <th scope="col" className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        User ID
                                    </th>
                                    <th scope="col" className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Full Name
                                    </th>
                                    <th scope="col" className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Phone Number
                                    </th>
                                    <th scope="col" className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Total Orders
                                    </th>
                                    <th scope="col" className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Total Spent
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-100 bg-white'}`}>
                                {userData.map((user) => {
                                    const stats = getUserStats(user.number);

                                    return (
                                        <tr key={user.id} className={`transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-red-50/30'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                    #{user.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-zomato-red font-bold shrink-0 border border-red-200">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center text-sm font-medium gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    +91 {user.number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    <ShoppingBag className={`w-4 h-4 ${stats.totalOrders > 0 ? 'text-zomato-red' : 'text-gray-400'}`} />
                                                    {stats.totalOrders}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    ₹{stats.totalSpent.toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {userData.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <Users className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No users found</h3>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                    No users have registered on the platform yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                )}

                {tab === 'vendors' && (
                <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="overflow-x-auto">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={darkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'}>
                                <tr>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Business</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Owner</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-100 bg-white'}`}>
                                {vendors.map((vendor) => (
                                    <tr key={vendor.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-red-50/30'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-zomato-red shrink-0 border border-red-200">
                                                    <Store className="w-4 h-4" />
                                                </div>
                                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{vendor.businessName}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{vendor.ownerName}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>+91 {vendor.number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {vendor.isApproved ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                                                    <Clock className="w-3.5 h-3.5" /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {!vendor.isApproved && (
                                                <button
                                                    onClick={() => approveVendor(vendor.id)}
                                                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-zomato-red text-white hover:bg-red-600 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {vendors.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No vendors have registered yet.</p>
                            </div>
                        )}
                    </div>
                </div>
                )}

                {tab === 'food' && (
                <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="overflow-x-auto">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={darkMode ? 'bg-gray-800/80' : 'bg-gray-50/80'}>
                                <tr>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dish</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Restaurant ID</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                                    <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}></th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-100 bg-white'}`}>
                                {foodItems.map((item) => (
                                    <tr key={item.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-red-50/30'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-zomato-red shrink-0 border border-red-200">
                                                    <Utensils className="w-4 h-4" />
                                                </div>
                                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>#{item.restrauntId}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.category}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>₹{item.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.isFlagged ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                                                    <Flag className="w-3.5 h-3.5" /> Flagged
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleFlagFood(item.id, !!item.isFlagged)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${item.isFlagged ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                                                >
                                                    {item.isFlagged ? 'Unflag' : 'Flag'}
                                                </button>
                                                <button
                                                    onClick={() => removeFood(item.id)}
                                                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {foodItems.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No food items on the platform yet.</p>
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
