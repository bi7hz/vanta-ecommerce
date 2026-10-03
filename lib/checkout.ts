import { products, type ShopProduct } from "@/lib/products";

export const checkoutCurrency = "USD" as const;

export type CheckoutLineInput = {
  productId?: string;
  slug?: string;
  quantity?: number;
  size?: string;
  color?: string;
};

export type TrustedCheckoutLine = {
  product: ShopProduct;
  quantity: number;
  size: string;
  color: string;
  unitAmountCents: number;
};

export class CheckoutValidationError extends Error {}

function readLine(value: unknown): CheckoutLineInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CheckoutValidationError("Each cart item must be an object.");
  }

  const line = value as Record<string, unknown>;
  return {
    productId: typeof line.productId === "string" ? line.productId : undefined,
    slug: typeof line.slug === "string" ? line.slug : undefined,
    quantity: typeof line.quantity === "number" ? line.quantity : undefined,
    size: typeof line.size === "string" ? line.size : undefined,
    color: typeof line.color === "string" ? line.color : undefined,
  };
}

export function resolveTrustedCart(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new CheckoutValidationError("A cart payload is required.");
  }

  const rawItems = (payload as Record<string, unknown>).items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutValidationError("The cart is empty.");
  }
  if (rawItems.length > 50) {
    throw new CheckoutValidationError("The cart contains too many line items.");
  }

  const merged = new Map<string, TrustedCheckoutLine>();

  for (const rawItem of rawItems) {
    const item = readLine(rawItem);
    const requestedQuantity = item.quantity;
    if (typeof requestedQuantity !== "number" || !Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      throw new CheckoutValidationError("Cart quantities must be positive whole numbers.");
    }

    const byId = item.productId ? products.find((product) => product.id === item.productId) : undefined;
    const bySlug = item.slug ? products.find((product) => product.slug === item.slug) : undefined;
    const product = byId ?? bySlug;

    if (!product || (byId && bySlug && byId.id !== bySlug.id)) {
      throw new CheckoutValidationError("A cart product could not be validated.");
    }
    if (!item.size || !product.sizes.includes(item.size)) {
      throw new CheckoutValidationError(`Invalid size for ${product.name}.`);
    }
    if (!item.color || !product.colors.includes(item.color)) {
      throw new CheckoutValidationError(`Invalid color for ${product.name}.`);
    }

    const key = `${product.id}\u0000${item.size}\u0000${item.color}`;
    const existing = merged.get(key);
    const quantity = (existing?.quantity ?? 0) + requestedQuantity;
    merged.set(key, {
      product,
      quantity,
      size: item.size,
      color: item.color,
      unitAmountCents: Math.round(product.price * 100),
    });
  }

  const trustedLines = [...merged.values()];
  const quantitiesByProduct = new Map<string, number>();
  for (const line of trustedLines) {
    const totalQuantity = (quantitiesByProduct.get(line.product.id) ?? 0) + line.quantity;
    if (totalQuantity > line.product.stock) {
      throw new CheckoutValidationError(`Requested quantity is unavailable for ${line.product.name}.`);
    }
    quantitiesByProduct.set(line.product.id, totalQuantity);
  }

  const subtotalCents = trustedLines.reduce(
    (total, line) => total + line.unitAmountCents * line.quantity,
    0,
  );

  if (!Number.isSafeInteger(subtotalCents) || subtotalCents <= 0) {
    throw new CheckoutValidationError("The cart total is invalid.");
  }

  return {
    lines: trustedLines,
    subtotalCents,
    finalAmountCents: subtotalCents,
    currency: checkoutCurrency,
  };
}

export function formatCents(cents: number) {
  return (cents / 100).toFixed(2);
}
