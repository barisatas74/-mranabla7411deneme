"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Instagram, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileMenu({
  open,
  onClose,
  items,
  cartCount,
}: {
  open: boolean;
  onClose: () => void;
  items: { label: string; href: string }[];
  cartCount: number;
}) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-ink-950/50 backdrop-blur-sm transition-opacity duration-500 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-bone-50 shadow-luxe transition-transform duration-500 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-ink-900/8 px-6">
          <div className="flex flex-col">
            <span className="font-display text-[26px] leading-none text-ink-900">
              Luna <span className="font-italic-display text-rose-600">Rosa</span>
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-editorial text-ink-600">
              Boutique
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 text-ink-900 transition hover:text-rose-600"
          >
            <X strokeWidth={1.4} size={22} />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="flex h-11 items-center gap-3 border border-ink-900/8 bg-white px-4">
            <Search strokeWidth={1.4} size={16} className="text-ink-600" />
            <input
              placeholder="Ara..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-500"
            />
          </div>
        </div>

        <nav className="flex flex-col px-6 py-4">
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex items-baseline justify-between border-b border-ink-900/6 py-4 last:border-0"
            >
              <span className="font-display text-2xl text-ink-900 transition group-hover:text-rose-600">
                {item.label}
              </span>
              <span className="text-[10px] tracking-editorial text-ink-500">
                0{index + 1}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-4 space-y-1 border-t border-ink-900/8 px-6 pt-5">
          <MobileLink
            icon={<ShoppingBag strokeWidth={1.4} size={16} />}
            label={`Sepetim${cartCount > 0 ? ` (${cartCount})` : ""}`}
            href="/cart"
            onClose={onClose}
          />
          <MobileLink label="Hakkimizda" href="/hakkimizda" onClose={onClose} />
          <MobileLink label="Iletisim" href="/iletisim" onClose={onClose} />
        </div>

        <div className="mt-auto px-6 py-6">
          <div className="mb-3 flex items-center gap-4 text-ink-700">
            <a
              href={
                process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
                "https://instagram.com/lunarosa"
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition hover:text-rose-600"
            >
              <Instagram strokeWidth={1.4} size={18} />
            </a>
          </div>
          <p className="text-[10px] uppercase tracking-editorial text-ink-500">
            © Luna Rosa · Est. 2020
          </p>
        </div>
      </aside>
    </>
  );
}

function MobileLink({
  icon,
  label,
  href = "#",
  onClose,
}: {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  onClose?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 py-2.5 text-sm text-ink-800 transition hover:text-rose-600"
    >
      {icon && <span className="text-rose-600">{icon}</span>}
      {label}
    </Link>
  );
}
