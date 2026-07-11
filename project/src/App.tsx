import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import RestaurantDetail from './pages/RestaurantDetail';
import Collections from './pages/Collections';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Signup from './pages/SignUp';
import ProtectRoutes from './ProtectRoutes';
import UserData from './Admin/UserData';
import OrderDetails from './pages/OrderDetails';
import VendorLayout from './Vendor/VendorLayout';
import VendorSetup from './Vendor/VendorSetup';
import VendorDashboard from './Vendor/VendorDashboard';
import VendorMenu from './Vendor/VendorMenu';
import VendorOrders from './Vendor/VendorOrders';
import VendorProfile from './Vendor/VendorProfile';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/cart" element={
                  <ProtectRoutes roles={['user']}>
                    <Cart />
                  </ProtectRoutes>}
                />
                <Route path="/account" element={
                  <ProtectRoutes roles={['user']}>
                    <Account />
                  </ProtectRoutes>}
                />
                <Route path="/order/:id" element={
                  <ProtectRoutes roles={['user']}>
                    <OrderDetails />
                  </ProtectRoutes>}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/vendor/setup" element={
                <ProtectRoutes roles={['vendor']}>
                  <VendorSetup />
                </ProtectRoutes>
              } />

              <Route path="/vendor" element={
                <ProtectRoutes roles={['vendor']}>
                  <VendorLayout />
                </ProtectRoutes>
              }>
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="menu" element={<VendorMenu />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="profile" element={<VendorProfile />} />
              </Route>

              <Route path="/admin" element={
                <ProtectRoutes roles={['admin']}>
                  <UserData />
                </ProtectRoutes>
              } />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
