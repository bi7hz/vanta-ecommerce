"use client";

import Image from "next/image";
import Link from "next/link";
import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { Container, Heading } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";

export function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  return <main><Announcement /><SiteHeader /><Container><section className="cart-page"><p className="eyebrow">Shopping bag</p><Heading as="h1">Your edit.</Heading>{items.length ? <div className="cart-page__layout"><div className="cart-lines">{items.map((item) => <article className="cart-line" key={item.key}><div className="cart-line__image"><Image src={item.image} alt={item.name} fill sizes="120px" style={{ objectFit: "contain" }} /></div><div><p>{item.brand}</p><h2>{item.name}</h2><small>{item.color} / {item.size}</small><div className="quantity-control"><button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.key, item.quantity - 1)}>−</button><span>{item.quantity}</span><button type="button" aria-label="Increase quantity" disabled={item.quantity >= item.maxQuantity} onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button></div></div><div className="cart-line__price"><strong>${item.unitPrice * item.quantity}</strong><button type="button" onClick={() => removeItem(item.key)}>Remove</button></div></article>)}</div><aside className="cart-summary"><p>Subtotal</p><strong>${subtotal}</strong><small>Taxes and delivery are calculated at checkout.</small><Link href="/checkout">Checkout</Link><Link className="cart-summary__continue" href="/shop">Continue shopping</Link></aside></div> : <div className="cart-empty"><p>Your bag is currently empty.</p><Link href="/shop">Explore the shop →</Link></div>}</section></Container><Footer /></main>;
}
