import { NextResponse } from "next/server";
import { CheckoutValidationError, resolveTrustedCart } from "@/lib/checkout";
import {
  createPayPalOrder,
  PayPalConfigurationError,
  PayPalRequestError,
} from "@/lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: object, status = 200) => NextResponse.json(body, {
  status,
  headers: { "Cache-Control": "no-store" },
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const cart = resolveTrustedCart(payload);
    const id = await createPayPalOrder(cart.lines, cart.finalAmountCents);
    return json({ id });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof CheckoutValidationError) {
      return json({ error: error instanceof Error ? error.message : "Invalid cart payload." }, 400);
    }
    if (error instanceof PayPalConfigurationError) {
      return json({ error: "PayPal Sandbox is not configured." }, 503);
    }
    if (error instanceof PayPalRequestError) {
      console.error("PayPal order creation failed.", { status: error.upstreamStatus });
      return json({ error: "PayPal could not create the order. Please try again." }, 502);
    }

    console.error("Unexpected PayPal order creation failure.");
    return json({ error: "Unable to start PayPal checkout." }, 500);
  }
}
