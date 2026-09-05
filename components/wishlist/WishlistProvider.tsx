"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ShopProduct } from "@/lib/products";

export type WishlistItem = Pick<ShopProduct, "id" | "slug" | "name" | "brand" | "price" | "primaryImage" | "category">;

type WishlistContextValue = {
  items: WishlistItem[];
  toggle: (product: ShopProduct) => void;
  isSaved: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const storageKey = "vanta-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setItems(JSON.parse(saved) as WishlistItem[]);
    } catch { window.localStorage.removeItem(storageKey); } finally { setHasLoaded(true); }
  }, []);
  useEffect(() => {
    if (!hasLoaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(items)); } catch { /* storage may be unavailable */ }
  }, [hasLoaded, items]);

  const value = useMemo<WishlistContextValue>(() => ({
    items,
    toggle: (product) => setItems((current) => current.some((item) => item.id === product.id)
      ? current.filter((item) => item.id !== product.id)
      : [...current, { id: product.id, slug: product.slug, name: product.name, brand: product.brand, price: product.price, primaryImage: product.primaryImage, category: product.category }]),
    isSaved: (productId) => items.some((item) => item.id === productId),
  }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
