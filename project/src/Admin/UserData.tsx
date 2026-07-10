import { useState, useEffect } from 'react';
import { Users, Phone, Shield, Moon, Sun, ShoppingBag, IndianRupee } from 'lucide-react';

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

export default function UserData() {
    const [userData, setUserData] = useState<User[]>([]);
    const [ordersData, setOrdersData] = useState<Order[]>([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, orderRes] = await Promise.all([
                    fetch('https://zomato-production-1f03.up.railway.app/api/users/all'),
                    fetch('https://zomato-production-1f03.up.railway.app/api/orders/all')
                ]);
                
                const users = await userRes.json();
                const orders = await orderRes.json();
                
                if (Array.isArray(users)) setUserData(users);
                if (Array.isArray(orders)) setOrdersData(orders);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const getUserStats = (number: string) => {
        const userOrders = ordersData.filter(o => o.number === number);
        const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        return { totalOrders: userOrders.length, totalSpent };
    };

    const totalPlatformRevenue = ordersData.reduce((sum, o) => sum + Number(o.totalAmount), 0);

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
                            Manage your registered users and their order histories.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-3 rounded-xl shadow-sm border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
            </div>
        </div>
    );
}