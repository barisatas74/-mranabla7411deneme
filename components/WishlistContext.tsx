"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "miss-bella-wishlist";

type WishlistContextValue = {
  ids: string[];
  count: number;
  isHydrated: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function normalize(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setIds(normalize(parsed));
    } catch {
      setIds([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids, isHydrated]);

  const has = useCallback(
    (productId: string) => ids.includes(productId),
    [ids]
  );

  const toggle = useCallback((productId: string) => {
    setIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((current) => current.filter((id) => id !== productId));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      count: ids.length,
      isHydrated,
      has,
      toggle,
      remove,
      clear,
    }),
    [ids, isHydrated, has, toggle, remove, clear]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
