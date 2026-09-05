"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Container, IconButton } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Contact", href: "/contact" },
] as const;

const footerGroups = [["Shop", "All Products", "Sneakers", "Apparel", "Accessories", "Sale"], ["Help", "Customer Service", "Shipping", "Returns", "Size Guide", "FAQ"], ["Company", "About Us", "Journal", "Careers", "Contact"], ["Legal", "Terms & Conditions", "Privacy Policy", "Refund Policy", "Cookies"]];

export function Announcement() {
  return <div className="announcement"><p>Complimentary delivery on orders over $175 <span>—</span> New season now in view</p></div>;
}

export function SiteHeader() {
  return <Suspense fallback={<SiteHeaderFallback />}><SiteHeaderContent /></Suspense>;
}

function SiteHeaderContent() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const isActive = (label: (typeof navItems)[number]["label"]) => {
    if (label === "Home") return pathname === "/";
    if (label === "Sale") return pathname === "/shop" && searchParams.get("sale") === "true";
    if (label === "Shop") return pathname === "/shop" && searchParams.get("sale") !== "true";
    return pathname === "/contact";
  };

  return <header className="site-header">
    <Container className="site-header__inner">
      <IconButton label={open ? "Close menu" : "Open menu"} className="menu-toggle" onClick={() => setOpen(!open)}><span className={open ? "menu-mark menu-mark--open" : "menu-mark"} /></IconButton>
      <Link className="wordmark" href="/">VANTA</Link>
      <nav className="desktop-nav" aria-label="Primary">
        {navItems.map((item) => <Link key={item.label} href={item.href} className={isActive(item.label) ? "is-active" : undefined} aria-current={isActive(item.label) ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <div className="header-actions">
        <IconButton label="Search"><Search /></IconButton>
        <IconButton label="Account" className="desktop-action"><User /></IconButton>
        <Link className="icon-button desktop-action" href="/wishlist" aria-label={`Wishlist, ${wishlistItems.length} items`}><Heart />{wishlistItems.length ? <small>{wishlistItems.length}</small> : null}</Link>
        <Link className="icon-button" href="/cart" aria-label={`Shopping bag, ${itemCount} items`}><Bag /><small>{itemCount}</small></Link>
      </div>
    </Container>
    <div className={open ? "mobile-menu mobile-menu--open" : "mobile-menu"}>
      {navItems.map((item, index) => <Link onClick={() => setOpen(false)} style={{ transitionDelay: (index * 45) + "ms" }} key={item.label} href={item.href} className={isActive(item.label) ? "is-active" : undefined} aria-current={isActive(item.label) ? "page" : undefined}>{item.label}<span>↗</span></Link>)}
    </div>
  </header>;
}

function SiteHeaderFallback() {
  return <header className="site-header" aria-hidden="true"><Container className="site-header__inner"><span className="wordmark">VANTA</span></Container></header>;
}

export function Footer() {
  return <footer className="footer"><Container><div className="footer__grid"><div className="footer__brand"><Link className="wordmark" href="/">VANTA</Link><p>Premium sneakers and apparel curated for those who value quality, detail and individuality.</p><div className="socials"><a href="#" aria-label="Instagram">ig</a><a href="#" aria-label="TikTok">tk</a><a href="#" aria-label="X">x</a><a href="#" aria-label="YouTube">yt</a></div></div>{footerGroups.map(([title, ...links]) => <div className="footer__links" key={title}><h2>{title}</h2>{links.map((link) => <a href="#" key={link}>{link}</a>)}</div>)}</div><div className="footer__base"><p>© 2026 VANTA. All rights reserved.</p><div className="payments"><span>VISA</span><span>MC</span><span>PayPal</span><span>Apple Pay</span></div></div></Container></footer>;
}

function Search() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.7" cy="10.7" r="5.8" /><path d="m15.1 15.1 4.4 4.4" /></svg>; }
function User() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.6-3.5 3-5.3 7-5.3s6.4 1.8 7 5.3" /></svg>; }
function Heart() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.4a5.4 5.4 0 0 0 0-7.7Z" /></svg>; }
function Bag() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8.5h14l-1 11H6l-1-11Z" /><path d="M9 9V6.5a3 3 0 0 1 6 0V9" /></svg>; }
