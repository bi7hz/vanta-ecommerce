"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CheckoutSuccess() {
  const [orderId, setOrderId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const completedOrder = window.sessionStorage.getItem("vanta-paypal-completed-order");
    queueMicrotask(() => {
      if (active) setOrderId(completedOrder);
    });
    return () => { active = false; };
  }, []);

  if (orderId === undefined) {
    return <div className="checkout-result" aria-busy="true"><p>Confirming your order…</p></div>;
  }

  if (!orderId) {
    return <div className="checkout-result">
      <p className="eyebrow">Checkout</p>
      <h1>No confirmed payment.</h1>
      <p>We could not find a completed PayPal payment in this browser session.</p>
      <Link href="/checkout">Return to checkout →</Link>
    </div>;
  }

  return <div className="checkout-result">
    <p className="eyebrow">Payment confirmed</p>
    <h1>Thank you.</h1>
    <p>Your PayPal payment was captured successfully. Your order reference is <strong>{orderId}</strong>.</p>
    <Link href="/shop">Continue shopping →</Link>
  </div>;
}
