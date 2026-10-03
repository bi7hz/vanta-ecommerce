import Image from "next/image";
import Link from "next/link";
import type { ShopProduct } from "@/lib/products";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

export function ProductGrid({ products }: { products: readonly ShopProduct[] }) {
  return <div className="shop-product-grid">{products.map((product) => {
    const hasAlternateHoverImage = product.primaryImage !== product.hoverImage;
    return <article className="shop-product" key={product.id}>
      <div className={`shop-product__image ${hasAlternateHoverImage ? "has-hover-image" : "is-zoom-only"}`}>
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} className="shop-product__image-link">
        <Image className="shop-product__primary" src={product.primaryImage} alt={`${product.brand} ${product.name}`} fill sizes="(max-width: 767px) 47vw, (max-width: 1023px) 30vw, 21vw" />
        {hasAlternateHoverImage ? <Image className="shop-product__secondary" src={product.hoverImage} alt="" aria-hidden="true" fill sizes="(max-width: 767px) 47vw, (max-width: 1023px) 30vw, 21vw" /> : null}
        <div className="shop-product__badges">{product.isNew ? <span>New</span> : null}{product.isSale ? <span>Sale</span> : null}</div>
        <span className="shop-product__quick">Quick view <Arrow /></span>
        </Link>
        <WishlistButton className="shop-product__wish" product={product} />
      </div>
      <Link className="shop-product__details" href={`/product/${product.slug}`}><p>{product.brand}</p><h2>{product.name}</h2><div><strong>${product.price}</strong>{product.originalPrice ? <del>${product.originalPrice}</del> : null}</div><div className="shop-product__colors" aria-label={`${product.name} available colors`}>{product.colors.slice(0, 4).map((color) => <span className={`swatch swatch--${color.toLowerCase().replace(/\s+/g, "-")}`} title={color} key={color} />)}{product.colors.length > 4 ? <small>+</small> : null}</div></Link>
    </article>;
  })}</div>;
}
function Arrow() { return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>; }
