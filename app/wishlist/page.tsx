import type { Metadata } from "next";
import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { Container, Heading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Wishlist — VANTA",
  description: "Your saved VANTA pieces.",
};

export default function WishlistPage() {
  return <main><Announcement /><SiteHeader /><Container><section className="wishlist-page" aria-labelledby="wishlist-title"><p className="eyebrow">Saved pieces</p><Heading as="h1" id="wishlist-title">WISHLIST</Heading><WishlistPageClient /></section></Container><Footer /></main>;
}
