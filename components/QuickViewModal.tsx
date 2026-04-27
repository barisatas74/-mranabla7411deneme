"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { getCategoryName } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { ArrowRight, Heart, ShoppingBag, X } from "lucide-react";

export default function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      setError(null);
      setImageIndex(0);
      setSelectedColor(product.colors[0]?.name);
      setSelectedSize(product.sizes[0]);
      return;
    }
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose, product]);

  if (!open) return null;

  const isOutOfStock = product.stock === 0;
  const isFavorite = has(product.id);
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  function handleAddToCart() {
    if (!selectedColor) {
      setError("Renk secin.");
      return;
    }
    if (!selectedSize) {
      setError("Beden secin.");
      return;
    }
    setError(null);
    addItem({ product, quantity: 1, size: selectedSize, color: selectedColor });
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} hizli bakis`}
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
    >
      <div
        className="absolute inset-0 bg-ink-950/55 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden bg-bone-50 shadow-luxe md:grid-cols-2">
        <button
          type="button"
          aria-label="Kapat"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bone-50/95 text-ink-700 backdrop-blur transition hover:text-rose-600"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="relative aspect-[4/5] bg-bone-100 md:aspect-auto md:h-full">
          <Image
            src={product.images[imageIndex] ?? product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Gorsel ${i + 1}`}
                  onClick={() => setImageIndex(i)}
                  className={cn(
                    "h-1 transition-all",
                    i === imageIndex ? "w-8 bg-rose-600" : "w-3 bg-white/60"
                  )}
                />
              ))}
            </div>
          )}
          {discount && (
            <span className="absolute left-3 top-3 bg-rose-600 px-2.5 py-1 text-[10px] uppercase tracking-editorial text-white">
              -%{discount}
            </span>
          )}
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-editorial text-rose-600">
            {getCategoryName(product.category)}
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink-900 md:text-3xl">
            {product.name}
          </h2>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl text-ink-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-ink-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-700">
            {product.description}
          </p>

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-editorial text-ink-700">
              Renk:{" "}
              <span className="text-ink-900">
                {selectedColor ?? "Secim yapin"}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  aria-label={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "h-9 w-9 rounded-full transition",
                    selectedColor === color.name
                      ? "ring-2 ring-rose-600 ring-offset-2 ring-offset-bone-50"
                      : "ring-1 ring-ink-900/15 hover:ring-ink-900"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-editorial text-ink-700">
              Beden:{" "}
              <span className="text-ink-900">
                {selectedSize ?? "Secim yapin"}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-[48px] border px-3 py-2.5 text-sm transition",
                    selectedSize === size
                      ? "border-ink-950 bg-ink-950 text-white"
                      : "border-ink-900/15 hover:border-ink-900"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

          <div className="mt-6 flex items-stretch gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn-luxe btn-luxe-dark flex-1 disabled:opacity-60"
            >
              <ShoppingBag strokeWidth={1.5} size={14} />
              {isOutOfStock ? "Tukendi" : "Sepete Ekle"}
            </button>
            <button
              type="button"
              aria-label="Favorilere ekle"
              onClick={() => toggle(product.id)}
              className={cn(
                "flex h-[44px] w-[44px] items-center justify-center border transition",
                isFavorite
                  ? "border-rose-600 bg-rose-600/5 text-rose-600"
                  : "border-ink-900/15 text-ink-700 hover:border-rose-600 hover:text-rose-600"
              )}
            >
              <Heart
                strokeWidth={1.5}
                size={16}
                className={isFavorite ? "fill-rose-600" : ""}
              />
            </button>
          </div>

          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-ink-700 transition hover:text-rose-600"
          >
            Tum detaylari gor <ArrowRight strokeWidth={1.5} size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
