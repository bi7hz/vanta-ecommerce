"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/components/cart/CartProvider";
import { useCart } from "@/components/cart/CartProvider";

const paypalSdkUrl = "https://www.sandbox.paypal.com/web-sdk/v6/core";
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

type PayPalSession = {
  start: (options: { presentationMode: "auto" }, orderId: Promise<string>) => Promise<void>;
};

type PayPalSdkInstance = {
  findEligibleMethods: (options: { currencyCode: "USD" }) => Promise<{
    isEligible: (method: "paypal") => boolean;
  }>;
  createPayPalOneTimePaymentSession: (options: {
    onApprove: (data: { orderId?: string }) => Promise<void>;
    onCancel: () => void;
    onError: () => void;
  }) => PayPalSession;
};

type PayPalNamespace = {
  createInstance: (options: {
    clientId: string;
    components: ["paypal-payments"];
    pageType: "checkout";
  }) => Promise<PayPalSdkInstance>;
};

declare global {
  interface Window { paypal?: PayPalNamespace }
}

let sdkPromise: Promise<PayPalNamespace> | null = null;

function loadPayPalSdk() {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<PayPalNamespace>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${paypalSdkUrl}"]`);
    const script = existing ?? document.createElement("script");
    const handleLoad = () => window.paypal
      ? resolve(window.paypal)
      : reject(new Error("PayPal SDK did not initialize."));
    const handleError = () => reject(new Error("PayPal SDK could not be loaded."));

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    if (!existing) {
      script.src = paypalSdkUrl;
      script.async = true;
      script.dataset.vantaPaypalSdk = "v6";
      document.head.appendChild(script);
    }
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
}

async function readJson(response: Response) {
  return response.json().catch(() => ({})) as Promise<{ id?: string; orderId?: string; status?: string; error?: string }>;
}

function cartPayload(items: CartItem[]) {
  return items.map(({ productId, slug, quantity, size, color }) => ({
    productId,
    slug,
    quantity,
    size,
    color,
  }));
}

export function PayPalCheckout({ items }: { items: CartItem[] }) {
  const router = useRouter();
  const { clearCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const operationInFlight = useRef(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    let disposed = false;
    let paypalButton: HTMLElement | null = null;
    let handleClick: (() => Promise<void>) | null = null;

    const initialize = async () => {
      if (!paypalClientId) {
        setErrorMessage("PayPal Sandbox is not configured. Add the PayPal client ID to continue.");
        setIsInitializing(false);
        return;
      }

      try {
        const paypal = await loadPayPalSdk();
        const sdk = await paypal.createInstance({
          clientId: paypalClientId,
          components: ["paypal-payments"],
          pageType: "checkout",
        });
        const methods = await sdk.findEligibleMethods({ currencyCode: "USD" });
        if (!methods.isEligible("paypal")) {
          throw new Error("PayPal is not available for this checkout.");
        }
        if (disposed || !container) return;

        const setIdle = () => {
          operationInFlight.current = false;
          setIsPaying(false);
          paypalButton?.removeAttribute("disabled");
          paypalButton?.removeAttribute("aria-disabled");
        };

        const session = sdk.createPayPalOneTimePaymentSession({
          onApprove: async ({ orderId }) => {
            if (!orderId) {
              setErrorMessage("PayPal did not return an order ID. Your cart is unchanged.");
              setIdle();
              return;
            }

            try {
              const response = await fetch("/api/payments/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
              });
              const result = await readJson(response);
              if (!response.ok || result.status !== "COMPLETED") {
                throw new Error(result.error ?? "PayPal could not confirm the payment.");
              }

              window.sessionStorage.setItem("vanta-paypal-completed-order", result.orderId ?? orderId);
              clearCart();
              router.replace("/checkout/success?provider=paypal");
            } catch (error) {
              setErrorMessage(error instanceof Error ? error.message : "PayPal capture failed. Your cart is unchanged.");
              setIdle();
            }
          },
          onCancel: () => {
            setErrorMessage("PayPal checkout was cancelled. Your cart has not changed.");
            setIdle();
          },
          onError: () => {
            setErrorMessage("PayPal could not open checkout. Please try again. Your cart has not changed.");
            setIdle();
          },
        });

        const createOrder = async () => {
          const response = await fetch("/api/payments/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartPayload(items) }),
          });
          const result = await readJson(response);
          if (!response.ok || !result.id) {
            throw new Error(result.error ?? "PayPal could not create the order.");
          }
          return result.id;
        };

        paypalButton = document.createElement("paypal-button");
        paypalButton.setAttribute("type", "pay");
        paypalButton.setAttribute("aria-label", "Pay with PayPal");
        handleClick = async () => {
          if (operationInFlight.current) return;
          operationInFlight.current = true;
          setErrorMessage("");
          setIsPaying(true);
          paypalButton?.setAttribute("disabled", "");
          paypalButton?.setAttribute("aria-disabled", "true");

          try {
            await session.start({ presentationMode: "auto" }, createOrder());
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "PayPal checkout could not start.");
            setIdle();
          }
        };
        paypalButton.addEventListener("click", handleClick);
        container.replaceChildren(paypalButton);
        setErrorMessage("");
        setIsInitializing(false);
      } catch (error) {
        if (disposed) return;
        setErrorMessage(error instanceof Error ? error.message : "PayPal checkout is unavailable.");
        setIsInitializing(false);
      }
    };

    void initialize();
    return () => {
      disposed = true;
      if (paypalButton && handleClick) paypalButton.removeEventListener("click", handleClick);
      container?.replaceChildren();
    };
  }, [clearCart, items, router]);

  return <div className={isPaying ? "paypal-checkout is-busy" : "paypal-checkout"}>
    <div ref={containerRef} className="paypal-button-host" aria-busy={isInitializing || isPaying} />
    {isInitializing ? <p className="checkout-status" role="status">Loading PayPal Sandbox…</p> : null}
    {isPaying ? <p className="checkout-status" role="status">Waiting for PayPal confirmation…</p> : null}
    {errorMessage ? <p className="checkout-error" role="alert">{errorMessage}</p> : null}
    <p className="checkout-secure-note">Sandbox checkout · USD · Your total is verified on the server</p>
  </div>;
}
