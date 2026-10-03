import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout — VANTA",
  description: "Secure VANTA checkout.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
