import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
import AddFood from './Admin/AddFood';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/cart" element={
                <ProtectRoutes>
                  <Cart />
                </ProtectRoutes>} 
              />
              <Route path="/account" element={
                <ProtectRoutes>
                  <Account />
                </ProtectRoutes>} 
              />
              <Route path="/order/:id" element={
                <ProtectRoutes>
                  <OrderDetails />
                </ProtectRoutes>} 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            <Route path="/admin" element={<UserData />} />
            <Route path="/admin/addFood" element={<AddFood />} /> 
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}