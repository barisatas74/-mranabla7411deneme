"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import QuickViewModal from "@/components/QuickViewModal";
import { getCategoryName } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Product } from "@/types";
import { Eye, Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle, isHydrated: wishlistHydrated } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;
  const isOutOfStock = product.stock === 0;
  const isFavorite = wishlistHydrated && has(product.id);

  function handleQuickAdd(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (isOutOfStock) return;
    addItem({
      product,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0]?.name,
    });
  }

  function handleToggleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggle(product.id);
  }

  function handleQuickView(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setQuickViewOpen(true);
  }

  return (
    <>
      <div className="group relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-bone-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-900/0 transition duration-500 group-hover:ring-ink-900/10" />

            <div className="absolute left-3.5 top-3.5 flex flex-col gap-1.5">
              {isOutOfStock && (
                <span className="bg-ink-950 px-2.5 py-1 text-[9px] font-medium uppercase tracking-editorial text-white">
                  Tukendi
                </span>
              )}
              {!isOutOfStock && product.isNew && (
                <span className="bg-bone-50/95 px-2.5 py-1 text-[9px] font-medium uppercase tracking-editorial text-ink-900 backdrop-blur">
                  Yeni
                </span>
              )}
              {!isOutOfStock && discount && (
                <span className="bg-ink-900 px-2.5 py-1 text-[9px] font-medium uppercase tracking-editorial text-white">
                  -%{discount}
                </span>
              )}
            </div>

            <div className="absolute right-3.5 top-3.5 flex flex-col gap-2">
              <button
                type="button"
                aria-label={isFavorite ? "Favorilerden cikar" : "Favorilere ekle"}
                onClick={handleToggleFavorite}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-bone-50/95 backdrop-blur transition",
                  isFavorite
                    ? "text-rose-600"
                    : "text-ink-700 hover:text-rose-600"
                )}
              >
                <Heart
                  strokeWidth={1.5}
                  size={15}
                  className={isFavorite ? "fill-rose-600" : ""}
                />
              </button>
              <button
                type="button"
                aria-label="Hizli bakis"
                onClick={handleQuickView}
                className="hidden h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-bone-50/95 text-ink-700 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:hover:text-rose-600 md:flex"
              >
                <Eye strokeWidth={1.5} size={15} />
              </button>
            </div>

            {isOutOfStock && (
              <div className="pointer-events-none absolute inset-0 bg-bone-50/40" />
            )}

            {!isOutOfStock && (
              <div className="absolute inset-x-3 bottom-3 flex translate-y-0 items-stretch gap-1.5 opacity-100 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="flex-1 bg-ink-950/92 py-3 text-[10px] uppercase tracking-editorial text-white backdrop-blur transition-colors hover:bg-rose-600"
                >
                  Sepete Ekle
                </button>
              </div>
            )}
          </div>

          <div className="pb-1 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-1.5 text-[9.5px] uppercase tracking-editorial text-rose-600">
                  {getCategoryName(product.category)}
                </p>
                <h3 className="truncate font-display text-[19px] leading-tight text-ink-900 transition-colors duration-500 group-hover:text-rose-600">
                  {product.name}
                </h3>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium tracking-wide text-ink-900">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-[11px] text-ink-500 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((color) => (
                  <span
                    key={color.name}
                    title={color.name}
                    className="h-3 w-3 rounded-full ring-1 ring-inset ring-ink-900/15"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="ml-0.5 text-[10px] text-ink-500">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
