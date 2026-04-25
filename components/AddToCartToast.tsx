"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, X, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AddToCartToast() {
  const { toast, dismissToast } = useCart();

  return (
    <div
      className={cn(
        "fixed z-50 top-4 right-4 left-4 md:top-28 md:left-auto md:right-6 md:max-w-md transition-all duration-500",
        toast
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      )}
    >
      {toast && (
        <div className="bg-bone-50 border border-ink-900/10 shadow-luxe overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-ink-950 text-bone-50">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={15} strokeWidth={1.5} className="text-rose-300" />
              <span className="text-[10px] tracking-editorial uppercase">
                Sepete Eklendi
              </span>
            </div>
            <button
              onClick={dismissToast}
              aria-label="Kapat"
              className="text-white/70 hover:text-white"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex gap-4 p-5">
            <div className="relative w-20 h-24 flex-shrink-0 bg-bone-100 overflow-hidden">
              <Image
                src={toast.line.product.images[0]}
                alt={toast.line.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg text-ink-900 leading-tight line-clamp-2">
                {toast.line.product.name}
              </p>
              <p className="text-[11px] text-ink-600 mt-1">
                {toast.line.color} · Beden {toast.line.size} · Adet{" "}
                {toast.line.quantity}
              </p>
              <p className="text-sm font-medium text-ink-900 mt-2">
                {formatPrice(toast.line.product.price * toast.line.quantity)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-0 border-t border-ink-900/8">
            <button
              onClick={dismissToast}
              className="py-3.5 text-[10px] tracking-editorial uppercase hover:bg-bone-100 transition border-r border-ink-900/8"
            >
              Alışverişe Devam
            </button>
            <Link
              href="/cart"
              onClick={dismissToast}
              className="py-3.5 text-[10px] tracking-editorial uppercase bg-ink-950 text-bone-50 hover:bg-rose-600 transition flex items-center justify-center gap-2"
            >
              Sepete Git <ArrowRight strokeWidth={1.5} size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
