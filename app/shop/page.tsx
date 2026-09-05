import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopClient } from "@/components/shop/ShopClient";
import { Suspense } from "react";

export default function ShopPage() { return <main><Announcement /><SiteHeader /><ShopHero /><Suspense fallback={<section className="shop-catalog" aria-busy="true" />}><ShopClient /></Suspense><section className="shop-newsletter"><div><p className="eyebrow">Private access</p><h2>First to know.</h2><p>New arrivals, considered releases, and exclusive invitations.</p></div><label><span className="sr-only">Email address</span><input type="email" placeholder="Enter your email" /><button type="button">Subscribe</button></label></section><Footer /></main>; }
