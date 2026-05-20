"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ProductSearchItem } from "@/types";

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || hasLoaded || isLoading) return;

    let cancelled = false;
    setIsLoading(true);
    fetch("/api/products/search")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { products?: ProductSearchItem[] } | null) => {
        if (cancelled) return;
        setProducts(Array.isArray(data?.products) ? data.products : []);
        setHasLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setHasLoaded(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hasLoaded, isLoading, open]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    const normalizedQuery = trimmed.toLocaleLowerCase("tr");
    return products
      .filter((product) => product.searchText.includes(normalizedQuery))
      .slice(0, 6);
  }, [query, products]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-auto mt-16 max-w-2xl bg-bone-50 shadow-luxe md:mt-24">
        <div className="flex items-center gap-3 border-b border-ink-900/10 px-5 py-4">
          <Search size={18} strokeWidth={1.4} className="text-ink-600" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün, kategori veya renk ara..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-ink-500"
          />
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="text-ink-600 transition hover:text-rose-600"
          >
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length < 2 && (
            <p className="px-5 py-6 text-sm text-ink-700">
              {isLoading
                ? "Arama hazırlanıyor..."
                : "En az 2 karakter girerek aramaya başlayabilirsiniz."}
            </p>
          )}
          {query.trim().length >= 2 && isLoading && (
            <p className="px-5 py-6 text-sm text-ink-700">
              Arama hazırlanıyor...
            </p>
          )}
          {query.trim().length >= 2 && !isLoading && results.length === 0 && (
            <p className="px-5 py-6 text-sm text-ink-700">
              &quot;{query}&quot; ile eşleşen ürün bulunamadı.
            </p>
          )}
          {results.length > 0 && (
            <ul className="divide-y divide-ink-900/8">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 transition hover:bg-bone-100"
                  >
                    <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden bg-bone-100">
                      {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base text-ink-900">
                        {product.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-editorial text-ink-600">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-ink-900">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
