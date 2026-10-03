"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { products, type ShopProduct } from "@/lib/products";

export type WishlistItem = Pick<ShopProduct, "id" | "slug" | "name" | "brand" | "price" | "originalPrice" | "primaryImage" | "category">;

type WishlistContextValue = {
  items: WishlistItem[];
  isHydrated: boolean;
  add: (product: ShopProduct) => void;
  remove: (productId: string) => void;
  toggle: (product: ShopProduct) => void;
  isSaved: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const storageKey = "vanta-wishlist";
const productsById = new Map(products.map((product) => [product.id, product]));

function parseSavedProductIds(value: string): string[] {
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) return [];

  const ids = parsed.flatMap((entry) => {
    if (typeof entry === "string") return [entry];
    if (entry && typeof entry === "object" && "id" in entry && typeof entry.id === "string") return [entry.id];
    return [];
  });
  return [...new Set(ids)].filter((id) => productsById.has(id));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setProductIds(parseSavedProductIds(saved));
    } catch {
      try { window.localStorage.removeItem(storageKey); } catch { /* storage may be unavailable */ }
    } finally { setIsHydrated(true); }
  }, []);
  useEffect(() => {
    if (!isHydrated) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(productIds)); } catch { /* storage may be unavailable */ }
  }, [isHydrated, productIds]);

  const items = useMemo(() => productIds.flatMap((id) => {
    const product = productsById.get(id);
    return product ? [{ id: product.id, slug: product.slug, name: product.name, brand: product.brand, price: product.price, originalPrice: product.originalPrice, primaryImage: product.primaryImage, category: product.category }] : [];
  }), [productIds]);

  const value = useMemo<WishlistContextValue>(() => ({
    items,
    isHydrated,
    add: (product) => setProductIds((current) => current.includes(product.id) ? current : [...current, product.id]),
    remove: (productId) => setProductIds((current) => current.filter((id) => id !== productId)),
    toggle: (product) => setProductIds((current) => current.includes(product.id)
      ? current.filter((id) => id !== product.id)
      : [...current, product.id]),
    isSaved: (productId) => productIds.includes(productId),
  }), [isHydrated, items, productIds]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
