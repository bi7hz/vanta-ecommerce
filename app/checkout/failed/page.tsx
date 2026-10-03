import type { Metadata } from "next";
import Link from "next/link";
import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Payment unsuccessful — VANTA" };

export default function CheckoutFailedPage() {
  return <main><Announcement /><SiteHeader /><Container><div className="checkout-result">
    <p className="eyebrow">Payment unsuccessful</p>
    <h1>Nothing was charged.</h1>
    <p>Your bag is unchanged. Return to checkout when you are ready to try again.</p>
    <Link href="/checkout">Return to checkout →</Link>
  </div></Container><Footer /></main>;
}
