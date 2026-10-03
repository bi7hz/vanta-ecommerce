import "server-only";

import type { TrustedCheckoutLine } from "@/lib/checkout";
import { checkoutCurrency, formatCents } from "@/lib/checkout";

const paypalApiBase = "https://api-m.sandbox.paypal.com";
const requestTimeoutMs = 15_000;

type PayPalOrderResponse = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{ id?: string; status?: string }>;
    };
  }>;
};

export class PayPalConfigurationError extends Error {}

export class PayPalRequestError extends Error {
  constructor(public readonly upstreamStatus: number) {
    super("PayPal request failed.");
  }
}

function getCredentials() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new PayPalConfigurationError("PayPal sandbox credentials are not configured.");
  }
  return { clientId, clientSecret };
}

async function getAccessToken() {
  const { clientId, clientSecret } = getCredentials();
  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  if (!response.ok) throw new PayPalRequestError(response.status);
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new PayPalRequestError(response.status);
  return data.access_token;
}

async function paypalRequest(path: string, body: unknown) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${paypalApiBase}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": crypto.randomUUID(),
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  if (!response.ok) throw new PayPalRequestError(response.status);
  return response.json() as Promise<PayPalOrderResponse>;
}

export async function createPayPalOrder(lines: TrustedCheckoutLine[], finalAmountCents: number) {
  const order = await paypalRequest("/v2/checkout/orders", {
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code: checkoutCurrency,
        value: formatCents(finalAmountCents),
        breakdown: {
          item_total: {
            currency_code: checkoutCurrency,
            value: formatCents(finalAmountCents),
          },
        },
      },
      items: lines.map((line) => ({
        name: line.product.name.slice(0, 127),
        sku: `${line.product.id}-${line.size}-${line.color}`.slice(0, 127),
        quantity: String(line.quantity),
        category: "PHYSICAL_GOODS",
        unit_amount: {
          currency_code: checkoutCurrency,
          value: formatCents(line.unitAmountCents),
        },
      })),
    }],
  });

  if (!order.id) throw new PayPalRequestError(502);
  return order.id;
}

export async function capturePayPalOrder(orderId: string) {
  const order = await paypalRequest(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {},
  );
  const captures = order.purchase_units?.flatMap((unit) => unit.payments?.captures ?? []) ?? [];
  const completed = order.status === "COMPLETED"
    && captures.length > 0
    && captures.every((capture) => capture.status === "COMPLETED");

  return { orderId: order.id ?? orderId, completed, status: order.status ?? "UNKNOWN" };
}
