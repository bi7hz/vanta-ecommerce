import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { Button, Container, Heading, IconButton, Section, SectionHeader } from "@/components/ui";
import { getProductBySlug, products as shopProducts, type ShopCategory, type ShopProduct } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";

const categories: readonly { category: ShopCategory; label: string; Icon: () => React.ReactNode }[] = [
  { category: "sneakers", label: "Sneakers", Icon: SneakerIcon },
  { category: "t-shirts", label: "T-Shirts", Icon: TeeIcon },
  { category: "hoodies", label: "Hoodies", Icon: HoodieIcon },
  { category: "pants", label: "Pants", Icon: PantsIcon },
];
const getShopProduct = (slug: string) => {
  const product = getProductBySlug(slug);
  if (!product) throw new Error("Missing homepage Fresh Picks product: " + slug);
  return product;
};
const oliveHoodie = getShopProduct("vanta-washed-olive-v-graphic-hoodie");
const contrastTee = getShopProduct("vanta-black-contrast-panel-tee");
const graffitiPants = getShopProduct("vanta-black-graffiti-fleece-pants");
const salomon = getShopProduct("salomon-xt-6-expanse");
const freshPickProducts = [oliveHoodie, contrastTee, graffitiPants, salomon] as const;
const benefits = [["Free shipping", "On orders over $175", <Truck key="truck" />], ["Easy returns", "30-day return policy", <Return key="return" />], ["Authenticity", "100% authentic products", <Shield key="shield" />], ["Customer support", "We're here to help", <Headset key="headset" />]] as const;

export default function Home() {
  return <main>
    <Announcement /><SiteHeader />
    <section className="shop-hero" aria-labelledby="hero-title"><Container className="shop-hero__layout"><div className="shop-hero__copy reveal reveal--one"><p className="eyebrow">New season / 2026</p><Heading as="h1" size="hero" id="hero-title">Defined by<br />Design.<br /><em>Built to Last.</em></Heading><p>Premium sneakers and apparel curated for those who value quality, detail, and individuality.</p><Button href="/shop">Shop the collection <Arrow /></Button><span className="hero-side-label">Curated / considered</span></div><MediaSlot className="hero-media reveal reveal--two" src="/campaign/hero.png" alt="Model in black outerwear wearing white New Balance sneakers" priority /></Container></section>
    <section className="category-rail" aria-label="Shop by category"><Container><div className="category-rail__grid">{categories.map(({ category, label, Icon }) => { const count = shopProducts.filter((product) => product.category === category).length; return <Link className="category-tile" href={`/shop?category=${category}`} key={category}><Icon /><span><strong>{label}</strong><small>{count} products</small></span><Arrow /></Link>; })}</div></Container></section>
    <Section id="new-arrivals" className="products-section"><Container><SectionHeader eyebrow="New arrivals" title="Fresh Picks" action="View all" actionHref="/shop" /><div className="product-grid">{freshPickProducts.map((product) => <FreshPickCard key={product.id} product={product} />)}</div></Container></Section>
    <Section className="collection-section"><Container><div className="collection-grid"><article className="collection-feature collection-feature--main"><MediaSlot className="collection-feature__media" src="/campaign/collection-main.png" alt="Represent Owners' Club campaign featuring a model in black" /><div className="collection-feature__copy"><p className="eyebrow">Collection</p><Heading as="h2">Represent<br />Owners' Club</Heading><p>A collection built for the doers, the creators, the ones who move differently.</p><Button href="/shop">Explore collection <Arrow /></Button></div></article><article className="collection-feature collection-feature--small collection-feature--samba"><MediaSlot className="collection-feature__media" src="/campaign/collection-secondary-01.png" alt="Black Adidas Samba sneakers" objectPosition="75% center" /></article><article className="collection-feature collection-feature--small collection-feature--nb"><MediaSlot className="collection-feature__media" src="/campaign/collection-secondary-02.png" alt="White New Balance 550 sneakers" objectPosition="75% center" /><div className="collection-feature__copy"><h3>New Balance 550</h3><p>Classic court style.<br />Everyday versatility.</p><a href="/shop?category=sneakers">Shop now <Arrow /></a></div></article></div></Container></Section>
    <section className="sale-banner"><Container><article className="sale-banner__inner"><div><p className="eyebrow">Limited time offer</p><Heading as="h2">Up to 40% Off</Heading><p>Selected styles. Limited quantities.</p><Button href="/shop?sale=true">Shop sale <Arrow /></Button></div><MediaSlot src="/campaign/sale.png" alt="Model in a light VANTA jacket for the sale collection" objectPosition="right center" /></article></Container></section>
    <Section className="benefits"><Container><div className="benefits__grid">{benefits.map(([title, copy, icon]) => <article key={title}>{icon}<div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></Container></Section>
    <Section className="story"><Container><article className="story__layout"><div className="story__copy"><p className="eyebrow">Our story</p><Heading as="h2">More Than<br />Products</Heading><p>VANTA is built on the belief that quality, craftsmanship, and culture should always stand out.</p><a href="#">Learn more <Arrow /></a></div><MediaSlot src="/campaign/story.png" alt="Warm VANTA boutique interior with footwear and apparel" /></article></Container></Section>
    <section className="newsletter"><Container className="newsletter__inner"><div><p className="eyebrow">Stay in the know</p><Heading as="h2">Join the VANTA Club.</Heading><p>Get early access to new drops, exclusive offers and more.</p></div><form className="newsletter__form"><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Enter your email" /><button type="submit">Subscribe</button></form></Container></section>
    <Footer />
  </main>;
}

function FreshPickCard({ product }: { product: ShopProduct }) {
  const hasAlternateHoverImage = product.primaryImage !== product.hoverImage;
  return <article className="product"><Link aria-label={`View ${product.name}`} className={"product__media media-slot media-slot--image " + (hasAlternateHoverImage ? "product__media--swap" : "product__media--zoom")} href={`/product/${product.slug}`}><Image className="product__primary-image" src={product.primaryImage} alt={product.brand + " " + product.name} fill sizes="(max-width: 767px) 46vw, (max-width: 1023px) 23vw, 20vw" style={{ objectFit: "contain" }} />{hasAlternateHoverImage ? <Image className="product__hover-image" src={product.hoverImage} alt="" aria-hidden="true" fill sizes="(max-width: 767px) 46vw, (max-width: 1023px) 23vw, 20vw" style={{ objectFit: "contain" }} /> : null}{product.isNew || product.isSale ? <span className="product__badge">{product.isSale ? "Sale" : "New"}</span> : null}</Link><IconButton label={"Add " + product.name + " to wishlist"} className="product__heart"><Heart /></IconButton><Link className="product__details" href={`/product/${product.slug}`}><p>{product.brand}</p><h3>{product.name}</h3><strong>${product.price}</strong>{product.originalPrice ? <del>${product.originalPrice}</del> : null}</Link></article>;
}

function MediaSlot({ className = "", src, alt, priority = false, objectPosition = "center" }: { className?: string; src: string; alt: string; priority?: boolean; objectPosition?: string }) {
  return <div className={"media-slot media-slot--image " + className}><Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 767px) 100vw, 60vw" style={{ objectFit: "cover", objectPosition }} /></div>;
}
function Arrow() { return <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h11M9 3l5 5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>; }
function Heart() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.4a5.4 5.4 0 0 0 0-7.7Z" /></svg>; }
function SneakerIcon() { return <svg className="category-tile__icon" viewBox="0 0 36 28" aria-hidden="true"><path d="M3 19c5 0 9-3 11-8l5 5c4 3 8 4 14 4v5H3v-6Z" /><path d="M11 19h4m2 0h4m2 0h4" /></svg>; }
function TeeIcon() { return <svg className="category-tile__icon" viewBox="0 0 36 28" aria-hidden="true"><path d="m12 4 6 3 6-3 8 7-4 5-4-3v11H12V13l-4 3-4-5 8-7Z" /></svg>; }
function HoodieIcon() { return <svg className="category-tile__icon" viewBox="0 0 36 28" aria-hidden="true"><path d="M12 7c0-4 3-6 6-6s6 2 6 6l7 5-3 5-4-2v10H12V15l-4 2-3-5 7-5Z" /><path d="M14 7c1 2 7 2 8 0" /></svg>; }
function PantsIcon() { return <svg className="category-tile__icon" viewBox="0 0 36 28" aria-hidden="true"><path d="M9 3h18l-2 22h-7l-1-12-2 12H8L9 3Z" /><path d="M9 8h18" /></svg>; }
function Truck() { return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 7h14v12H3zM17 11h4l4 4v4h-8zM7 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>; }
function Return() { return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M8 10H4v-4M4 10c2-4 5-6 10-6 6 0 10 4 10 10M20 18h4v4M24 18c-2 4-5 6-10 6-6 0-10-4-10-10" /></svg>; }
function Shield() { return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 3 24 7v6c0 6-4.2 10-10 12C8.2 23 4 19 4 13V7l10-4Z" /><path d="m9 14 3 3 6-6" /></svg>; }
function Headset() { return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M5 16v-2a9 9 0 0 1 18 0v2M5 16h4v6H6a1 1 0 0 1-1-1v-5ZM23 16h-4v6h3a1 1 0 0 0 1-1v-5ZM19 23c-1 2-3 2-5 2" /></svg>; }
