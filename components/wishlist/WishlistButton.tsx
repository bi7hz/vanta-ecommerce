"use client";

import type { ShopProduct } from "@/lib/products";
import { useWishlist } from "./WishlistProvider";

export function WishlistButton({ product, className = "" }: { product: ShopProduct; className?: string }) {
  const { toggle, isSaved } = useWishlist();
  const saved = isSaved(product.id);
  return <button className={`wishlist-button ${saved ? "is-saved" : ""} ${className}`} type="button" onClick={() => toggle(product)} aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} aria-pressed={saved}><Heart /></button>;
}

function Heart() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.4a5.4 5.4 0 0 0 0-7.7Z" /></svg>; }
