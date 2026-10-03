import { NextResponse } from "next/server";
import {
  capturePayPalOrder,
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
    const payload = await request.json() as { orderId?: unknown };
    const orderId = typeof payload?.orderId === "string" ? payload.orderId.trim() : "";
    if (!/^[A-Z0-9]{10,32}$/.test(orderId)) {
      return json({ error: "A valid PayPal order ID is required." }, 400);
    }

    const capture = await capturePayPalOrder(orderId);
    if (!capture.completed) {
      console.error("PayPal capture was not completed.", { status: capture.status });
      return json({ error: "PayPal did not complete the payment." }, 502);
    }

    return json({ orderId: capture.orderId, status: "COMPLETED" });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return json({ error: "A valid PayPal order ID is required." }, 400);
    }
    if (error instanceof PayPalConfigurationError) {
      return json({ error: "PayPal Sandbox is not configured." }, 503);
    }
    if (error instanceof PayPalRequestError) {
      console.error("PayPal capture failed.", { status: error.upstreamStatus });
      return json({ error: "PayPal could not capture the payment. Your cart is unchanged." }, 502);
    }

    console.error("Unexpected PayPal capture failure.");
    return json({ error: "Unable to confirm the PayPal payment. Your cart is unchanged." }, 500);
  }
}
