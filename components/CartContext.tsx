"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { normalizeCouponCode } from "@/lib/commerce";
import { CartItem, CartLine, Product } from "@/types";

const STORAGE_KEY = "miss-bella-cart";

type StoredCartState = {
  items: CartItem[];
  couponCode: string | null;
  couponDiscountRate: number | null;
};

type ToastState = { line: CartLine } | null;

type AddItemArgs = {
  product: Product;
  quantity?: number;
  size?: string;
  color?: string;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  couponCode: string | null;
  couponDiscountRate: number | null;
  isHydrated: boolean;
  addItem: (args: AddItemArgs) => void;
  updateItemQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discountRate: number) => void;
  removeCoupon: () => void;
  toast: ToastState;
  dismissToast: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function getLineId(productId: string, size: string, color: string) {
  return `${productId}-${size}-${color}`;
}

function normalizeStoredItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.productId !== "string" ||
      typeof entry.quantity !== "number" ||
      typeof entry.size !== "string" ||
      typeof entry.color !== "string" ||
      !entry.product ||
      typeof entry.product !== "object"
    ) {
      return [];
    }

    const item: CartItem = {
      id: getLineId(entry.productId, entry.size, entry.color),
      productId: entry.productId,
      quantity: Math.max(1, Math.floor(entry.quantity)),
      size: entry.size,
      color: entry.color,
      product: entry.product as Product,
    };

    return [item];
  });
}

function normalizeStoredState(value: unknown): StoredCartState {
  if (Array.isArray(value)) {
    return {
      items: normalizeStoredItems(value),
      couponCode: null,
      couponDiscountRate: null,
    };
  }

  if (!value || typeof value !== "object") {
    return { items: [], couponCode: null, couponDiscountRate: null };
  }

  const storedValue = value as {
    items?: unknown;
    couponCode?: unknown;
    couponDiscountRate?: unknown;
  };

  const rawCouponCode =
    typeof storedValue.couponCode === "string"
      ? normalizeCouponCode(storedValue.couponCode)
      : "";
  const rawDiscountRate =
    typeof storedValue.couponDiscountRate === "number"
      ? storedValue.couponDiscountRate
      : 0;
  const couponDiscountRate =
    rawCouponCode && rawDiscountRate > 0 && rawDiscountRate <= 100
      ? rawDiscountRate
      : null;

  return {
    items: normalizeStoredItems(storedValue.items),
    couponCode: couponDiscountRate ? rawCouponCode : null,
    couponDiscountRate,
  };
}

function hydrateLines(items: CartItem[]): CartLine[] {
  return items;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscountRate, setCouponDiscountRate] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const normalized = normalizeStoredState(parsed);
      setItems(normalized.items);
      setCouponCode(normalized.couponCode);
      setCouponDiscountRate(normalized.couponDiscountRate);
    } catch {
      setItems([]);
      setCouponCode(null);
      setCouponDiscountRate(null);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const payload: StoredCartState = {
      items,
      couponCode,
      couponDiscountRate,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [couponCode, couponDiscountRate, isHydrated, items]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const lines = useMemo(() => hydrateLines(items), [items]);
  const itemCount = useMemo(
    () => lines.reduce((total, line) => total + line.quantity, 0),
    [lines]
  );
  const subtotal = useMemo(
    () => lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
    [lines]
  );

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((line: CartLine) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ line });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const addItem = useCallback(
    ({ product, quantity = 1, size, color }: AddItemArgs) => {
      const normalizedSize = size ?? product.sizes[0] ?? "Standart";
      const normalizedColor = color ?? product.colors[0]?.name ?? "Varsayilan";
      const normalizedQuantity = Math.max(1, Math.min(quantity, product.stock));
      const nextItem: CartItem = {
        id: getLineId(product.id, normalizedSize, normalizedColor),
        productId: product.id,
        quantity: normalizedQuantity,
        size: normalizedSize,
        color: normalizedColor,
        product,
      };

      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === nextItem.id);

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === nextItem.id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + normalizedQuantity, product.stock),
                  product,
                }
              : item
          );
        }

        return [...currentItems, nextItem];
      });

      showToast(nextItem);
    },
    [showToast]
  );

  const updateItemQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== lineId) {
          return [item];
        }

        const maxStock = item.product?.stock ?? quantity;
        const nextQuantity = Math.max(0, Math.min(quantity, maxStock));

        if (nextQuantity === 0) {
          return [];
        }

        return [{ ...item, quantity: nextQuantity }];
      })
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(null);
    setCouponDiscountRate(null);
  }, []);

  const applyCoupon = useCallback((code: string, discountRate: number) => {
    const normalizedCode = normalizeCouponCode(code);
    const normalizedRate = Math.max(0, Math.min(100, Number(discountRate) || 0));
    setCouponCode(normalizedCode && normalizedRate > 0 ? normalizedCode : null);
    setCouponDiscountRate(normalizedCode && normalizedRate > 0 ? normalizedRate : null);
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setCouponDiscountRate(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotal,
      couponCode,
      couponDiscountRate,
      isHydrated,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      toast,
      dismissToast,
    }),
    [
      addItem,
      applyCoupon,
      clearCart,
      couponCode,
      couponDiscountRate,
      dismissToast,
      isHydrated,
      itemCount,
      lines,
      removeCoupon,
      removeItem,
      subtotal,
      toast,
      updateItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
