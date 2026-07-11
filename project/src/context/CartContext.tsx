import { createContext, useContext, useState, ReactNode } from 'react';
import type { MenuItem } from '../data/restaurants';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

type AddResult = 'added' | 'different_restaurant';

interface CartContextType {
  items: CartItem[];
  // Returns 'different_restaurant' instead of adding if the cart already has
  // items from a different restaurant. Pass force=true (after confirming
  // with the user) to clear the cart and add anyway.
  addItem: (item: MenuItem, restaurantId: string, restaurantName: string, force?: boolean) => AddResult;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  currentRestaurantId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: MenuItem, restaurantId: string, restaurantName: string, force = false): AddResult => {
    const currentRestaurantId = items.length > 0 ? items[0].restaurantId : null;

    if (currentRestaurantId && currentRestaurantId !== restaurantId && !force) {
      return 'different_restaurant';
    }

    setItems((prev) => {
      const base = force && currentRestaurantId && currentRestaurantId !== restaurantId ? [] : prev;
      const existing = base.find((ci) => ci.item.id === item.id);
      if (existing) {
        return base.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...base, { item, quantity: 1, restaurantId, restaurantName }];
    });

    return 'added';
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: ci.quantity + delta } : ci
        )
        .filter((ci) => ci.quantity > 0);
    });
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalPrice = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const currentRestaurantId = items.length > 0 ? items[0].restaurantId : null;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, currentRestaurantId }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
