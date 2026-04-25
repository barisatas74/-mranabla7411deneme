import {
  CartLine,
  PaymentMethod,
  Product,
  ShippingMethod,
} from "@/types";

export const FREE_SHIPPING_LIMIT = 300;
export const DEFAULT_COUPON_CODE = "ROSA30";

export const SHIPPING_METHODS: {
  id: ShippingMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "standard",
    label: "Standart Teslimat",
    description: "1-3 is gunu",
  },
  {
    id: "express",
    label: "Hizli Teslimat",
    description: "Ertesi gun teslimat",
  },
];

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
}[] = [
  { id: "card", label: "Kart" },
  { id: "transfer", label: "Havale/EFT" },
  { id: "cod", label: "Kapida Odeme" },
];

export function normalizeCouponCode(code: string | null | undefined) {
  return code?.trim().toUpperCase() ?? "";
}

export function isCouponValid(code: string | null | undefined) {
  return normalizeCouponCode(code) === DEFAULT_COUPON_CODE;
}

export function getShippingPrice(
  subtotal: number,
  shippingMethod: ShippingMethod = "standard"
) {
  if (shippingMethod === "express") {
    return subtotal === 0 ? 0 : 59;
  }

  return subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : 39;
}

export function getDiscountAmount(subtotal: number, couponCode?: string | null) {
  return isCouponValid(couponCode) ? Math.round(subtotal * 0.1) : 0;
}

export function getCartSummary(
  lines: CartLine[],
  options?: {
    couponCode?: string | null;
    shippingMethod?: ShippingMethod;
  }
) {
  const subtotal = lines.reduce(
    (total, line) => total + line.product.price * line.quantity,
    0
  );
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const shipping = getShippingPrice(subtotal, options?.shippingMethod);
  const discount = getDiscountAmount(subtotal, options?.couponCode);
  const total = Math.max(0, subtotal + shipping - discount);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);

  return {
    itemCount,
    subtotal,
    shipping,
    discount,
    total,
    remainingForFreeShipping,
  };
}

export function getProductPriceBounds(items: Product[]) {
  if (items.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = items.map((item) => item.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
