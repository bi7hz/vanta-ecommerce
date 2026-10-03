"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "./WishlistProvider";

export function WishlistPageClient() {
  const { items, isHydrated, remove } = useWishlist();

  if (!isHydrated) return <div className="wishlist-loading" aria-busy="true"><span className="sr-only">Loading wishlist</span></div>;

  if (!items.length) {
    return <div className="wishlist-empty"><h2>YOUR WISHLIST IS EMPTY</h2><Link href="/shop">SHOP THE COLLECTION <span aria-hidden="true">→</span></Link></div>;
  }

  return <div className="shop-product-grid wishlist-grid">{items.map((product) => <article className="shop-product wishlist-card" key={product.id}>
    <div className="shop-product__image wishlist-card__image is-zoom-only">
      <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} className="shop-product__image-link"><Image className="shop-product__primary" src={product.primaryImage} alt={`${product.brand} ${product.name}`} fill sizes="(max-width: 767px) 47vw, (max-width: 1023px) 30vw, 21vw" /></Link>
      <button className="wishlist-card__remove" type="button" onClick={() => remove(product.id)} aria-label={`Remove ${product.name} from wishlist`}>Remove</button>
    </div>
    <Link className="shop-product__details" href={`/product/${product.slug}`}><p>{product.brand}</p><h2>{product.name}</h2><div><strong>${product.price}</strong>{product.originalPrice ? <del>${product.originalPrice}</del> : null}</div></Link>
  </article>)}</div>;
}
