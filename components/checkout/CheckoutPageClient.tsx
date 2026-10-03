"use client";

import Image from "next/image";
import Link from "next/link";
import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { useCart } from "@/components/cart/CartProvider";
import { Container, Heading } from "@/components/ui";
import { PayPalCheckout } from "@/components/checkout/PayPalCheckout";

export function CheckoutPageClient() {
  const { items, isHydrated, subtotal } = useCart();

  return <main>
    <Announcement />
    <SiteHeader />
    <Container>
      <section className="checkout-page">
        <p className="eyebrow">Secure checkout</p>
        <Heading as="h1">Checkout.</Heading>

        {!isHydrated ? <div className="checkout-loading" aria-busy="true">Loading your bag…</div> : items.length === 0 ? <div className="cart-empty">
          <p>Your bag is currently empty.</p>
          <Link href="/shop">Shop the collection →</Link>
        </div> : <div className="checkout-layout">
          <div className="checkout-main">
            <fieldset className="payment-methods">
              <legend>Payment method</legend>
              <label className="payment-choice is-disabled" aria-disabled="true">
                <input type="radio" name="payment-method" value="paymob" disabled />
                <span><strong>Paymob <em>Coming soon</em></strong><small>Secure hosted payment</small></span>
              </label>
              <label className="payment-choice is-selected">
                <input type="radio" name="payment-method" value="paypal" defaultChecked />
                <span><strong>PayPal</strong><small>PayPal Sandbox</small></span>
              </label>
            </fieldset>

            <div className="payment-panel payment-panel--paypal">
              <PayPalCheckout items={items} />
            </div>
          </div>

          <aside className="checkout-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <div className="checkout-summary__items">
              {items.map((item) => <article key={item.key} className="checkout-line">
                <div className="checkout-line__image"><Image src={item.image} alt="" fill sizes="64px" /></div>
                <div><strong>{item.name}</strong><small>{item.color} / {item.size} · Qty {item.quantity}</small></div>
                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </article>)}
            </div>
            <dl className="checkout-totals">
              <div><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div><dt>Delivery</dt><dd>Included</dd></div>
              <div className="checkout-total"><dt>Total</dt><dd>USD ${subtotal.toFixed(2)}</dd></div>
            </dl>
            <p>The PayPal total is recalculated from the VANTA catalog before the order is created.</p>
          </aside>
        </div>}
      </section>
    </Container>
    <Footer />
  </main>;
}
