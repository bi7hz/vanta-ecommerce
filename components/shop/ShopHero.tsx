import Image from "next/image";
import { Container, Heading } from "@/components/ui";

export function ShopHero() { return <section className="shop-page-hero"><Container className="shop-page-hero__inner"><div className="shop-page-hero__copy"><p className="eyebrow">The VANTA edit</p><Heading as="h1">Shop</Heading><p>Curated streetwear and everyday essentials, built around considered silhouettes and movement.</p><a href="#shop-catalog">Explore the collection <Arrow /></a></div><div className="shop-page-hero__image"><Image src="/campaign/shop-hero.png" alt="VANTA campaign model in a black jacket" fill priority sizes="(max-width: 767px) 100vw, 56vw" /></div></Container></section>; }

function Arrow() { return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>; }
