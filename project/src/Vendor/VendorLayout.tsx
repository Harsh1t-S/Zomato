import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Store, Utensils, ClipboardList, LayoutDashboard, LogOut, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiFetch } from '../lib/api';

export default function VendorLayout() {
  const location = useLocation();
  const { logout, user, setRestaurantId } = useAuth();
  const { darkMode } = useTheme();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRestaurant = async () => {
      if (!user || user.restaurantId) {
        setChecking(false);
        return;
      }
      try {
        const res = await apiFetch(`/api/restraunt/vendor/${user.id}`);
        if (res.status === 404) {
          if (!cancelled) setChecking(false);
          return;
        }
        const data = await res.json();
        if (!cancelled && data?.id) {
          setRestaurantId(data.id);
        }
      } catch {
        // network error — fall through, VendorSetup / retry will handle it
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    fetchRestaurant();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const links = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Manage Orders', path: '/vendor/orders', icon: ClipboardList },
    { name: 'Menu & Products', path: '/vendor/menu', icon: Utensils },
    { name: 'Restaurant Profile', path: '/vendor/profile', icon: Store },
  ];

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zomato-red"></div>
      </div>
    );
  }

  // No restaurant yet — force onboarding before anything else in the vendor area.
  if (!user?.restaurantId && !location.pathname.startsWith('/vendor/setup')) {
    return <Navigate to="/vendor/setup" replace />;
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-black text-zomato-red tracking-tight">Vendor Panel</h2>
          {user?.businessName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{user.businessName}</p>
          )}
        </div>

        {user && user.isApproved === false && (
          <div className="mx-4 mt-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs px-3 py-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Pending admin approval. Your restaurant won't appear to customers yet.</span>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-900/20 text-zomato-red'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
