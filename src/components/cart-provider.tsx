import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import type { CartLine } from '@/lib/types';
import type { MenuItem } from '@/config/site.config';
import { cartReducer, cartTotal, makeLineId } from '@/lib/cart';

type CartContextType = {
  lines: CartLine[];
  count: number;
  total: number;
  table: string | null;
  setTable: (table: string | null) => void;
  addItem: (
    item: MenuItem,
    addOns?: { name: string; price: number }[],
    cookingStyle?: string,
    note?: string,
    quantity?: number
  ) => void;
  decrement: (lineId: string) => void;
  remove: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'hacienda_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [table, setTableState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Parse ?table= from URL on initial load and hydrate localStorage
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTable = searchParams.get('table');
      if (urlTable) {
        setTableState(urlTable);
        sessionStorage.setItem('hacienda_table', urlTable);
      } else {
        const storedTable = sessionStorage.getItem('hacienda_table');
        if (storedTable) setTableState(storedTable);
      }

      const storedCart = localStorage.getItem(STORAGE_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'hydrate', lines: parsed });
        }
      }
    } catch {
      // Storage unavailable or blocked; fail gracefully
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore quota errors
    }
  }, [lines, isHydrated]);

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = cartTotal(lines);

  const addItem = (
    item: MenuItem,
    addOns: { name: string; price: number }[] = [],
    cookingStyle = '',
    note = '',
    quantity = 1
  ) => {
    const lineId = makeLineId(item.id, addOns, cookingStyle, note);
    const line: CartLine = {
      lineId,
      itemId: item.id,
      item,
      quantity,
      addOns,
      cookingStyle: cookingStyle || undefined,
      note: note || undefined,
    };
    dispatch({ type: 'add', line });
  };

  const decrement = (lineId: string) => {
    dispatch({ type: 'decrement', lineId });
  };

  const remove = (lineId: string) => {
    dispatch({ type: 'remove', lineId });
  };

  const clear = () => {
    dispatch({ type: 'clear' });
  };

  const setTable = (newTable: string | null) => {
    setTableState(newTable);
    if (newTable) {
      sessionStorage.setItem('hacienda_table', newTable);
    } else {
      sessionStorage.removeItem('hacienda_table');
    }
  };

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        total,
        table,
        setTable,
        addItem,
        decrement,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
