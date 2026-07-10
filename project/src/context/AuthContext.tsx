import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  number: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage so logins survive page refreshes
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zomato_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = !!user;

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('zomato_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zomato_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}