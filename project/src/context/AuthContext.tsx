import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'user' | 'vendor' | 'admin';

interface AuthUser {
  id: number | string;
  name?: string;
  ownerName?: string;
  number?: string;
  businessName?: string;
  gstNumber?: string;
  isApproved?: boolean;
  role: Role;
  token: string;
  // Populated after a vendor's restaurant is looked up post-login.
  restaurantId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (userData: AuthUser) => void;
  logout: () => void;
  setRestaurantId: (restaurantId: string | undefined) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'zomato_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage so logins survive page refreshes
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = !!user;

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const setRestaurantId = (restaurantId: string | undefined) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, restaurantId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateUser = (patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, setRestaurantId, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
