import {
  CartLine,
  PaymentMethod,
  Product,
  ShippingMethod,
} from "@/types";

export const FREE_SHIPPING_LIMIT = 300;
export const DEFAULT_COUPON_CODE = "ROSA30";
export const TAX_RATE = 0.1;

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
    label: "Hızlı Teslimat",
    description: "Ertesi gün teslimat",
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
  return getCouponDiscountRate(code) > 0;
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

export const DEFAULT_COUPON_DISCOUNT_RATE = 0.3;

export function getCouponDiscountRate(code: string | null | undefined) {
  const normalized = normalizeCouponCode(code);
  if (normalized === DEFAULT_COUPON_CODE) return DEFAULT_COUPON_DISCOUNT_RATE;

  const match = /^MB(\d{1,2})-[A-Z0-9]{4,}$/.exec(normalized);
  if (!match) return 0;

  const rate = Number(match[1]);
  if (!Number.isFinite(rate) || rate < 5 || rate > 50) return 0;
  return rate / 100;
}

export function getDiscountAmount(subtotal: number, couponCode?: string | null) {
  const rate = getCouponDiscountRate(couponCode);
  return rate > 0 ? Math.round(subtotal * rate) : 0;
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
  const includedTax = Math.round((total * TAX_RATE) / (1 + TAX_RATE));

  return {
    itemCount,
    subtotal,
    shipping,
    discount,
    total,
    includedTax,
    taxRate: TAX_RATE,
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
