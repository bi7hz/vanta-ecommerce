import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";

export const metadata: Metadata = {
  title: "VANTA — The Art of the Everyday",
  description: "A considered edit of modern footwear and apparel."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><CartProvider><WishlistProvider>{children}</WishlistProvider></CartProvider></body></html>; }
