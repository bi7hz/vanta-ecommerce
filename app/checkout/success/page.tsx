import type { Metadata } from "next";
import { Announcement, Footer, SiteHeader } from "@/components/shell";
import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Payment confirmed — VANTA" };

export default function CheckoutSuccessPage() {
  return <main><Announcement /><SiteHeader /><Container><CheckoutSuccess /></Container><Footer /></main>;
}
