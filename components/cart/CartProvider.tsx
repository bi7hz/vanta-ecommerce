"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  image: string;
  maxQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "key">) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "vanta-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    let savedItems: CartItem[] = [];
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) savedItems = JSON.parse(saved) as CartItem[];
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    queueMicrotask(() => {
      if (!active) return;
      setItems(savedItems);
      setHasLoaded(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(items)); } catch { /* storage can be unavailable */ }
  }, [hasLoaded, items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    isHydrated: hasLoaded,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    addItem: (nextItem) => setItems((current) => {
      const key = `${nextItem.productId}-${nextItem.size}-${nextItem.color}`;
      const existing = current.find((item) => item.key === key);
      return existing
        ? current.map((item) => item.key === key ? { ...item, quantity: Math.min(item.maxQuantity, item.quantity + nextItem.quantity) } : item)
        : [...current, { ...nextItem, key }];
    }),
    updateQuantity: (key, quantity) => setItems((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.max(1, Math.min(item.maxQuantity ?? 99, quantity)) } : item)),
    removeItem: (key) => setItems((current) => current.filter((item) => item.key !== key)),
    clearCart: () => {
      setItems([]);
      try { window.localStorage.setItem(storageKey, "[]"); } catch { /* storage can be unavailable */ }
    },
  }), [hasLoaded, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
