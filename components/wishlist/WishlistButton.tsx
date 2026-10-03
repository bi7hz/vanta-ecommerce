"use client";

import { useRouter } from "next/navigation";
import type { ShopProduct } from "@/lib/products";
import { useWishlist } from "./WishlistProvider";

export function WishlistButton({ product, className = "", navigateTo }: { product: ShopProduct; className?: string; navigateTo?: string }) {
  const router = useRouter();
  const { add, toggle, isSaved } = useWishlist();
  const saved = isSaved(product.id);
  const handleClick = () => {
    if (navigateTo) {
      add(product);
      router.push(navigateTo);
      return;
    }
    toggle(product);
  };
  const label = navigateTo && saved ? "View wishlist" : `${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`;

  return <button className={`wishlist-button ${saved ? "is-saved" : ""} ${className}`} type="button" onClick={handleClick} aria-label={label} aria-pressed={saved}><Heart /></button>;
}

function Heart() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.4a5.4 5.4 0 0 0 0-7.7Z" /></svg>; }
