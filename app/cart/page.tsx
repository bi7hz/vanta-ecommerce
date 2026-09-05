import { Suspense } from "react";
import { CartPageClient } from "./CartPageClient";

export default function CartPage() {
  return <Suspense fallback={<main className="cart-page cart-page--loading" aria-busy="true" />}><CartPageClient /></Suspense>;
}
