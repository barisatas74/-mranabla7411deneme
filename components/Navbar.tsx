"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, Heart } from "lucide-react";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import SearchOverlay from "./SearchOverlay";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  category?: string;
  filter?: "new" | "sale";
};

const navItems: NavItem[] = [
  { label: "Yeni Sezon", href: "/products?filter=new", filter: "new" },
  { label: "Sutyen", href: "/products?category=sutyenler", category: "sutyenler" },
  { label: "Kulot", href: "/products?category=kulotlar", category: "kulotlar" },
  { label: "Takim", href: "/products?category=takimlar", category: "takimlar" },
  {
    label: "Gecelik",
    href: "/products?category=gecelikler",
    category: "gecelikler",
  },
  { label: "Indirim", href: "/products?filter=sale", filter: "sale" },
];

const announcements = [
  "300 TL uzeri ucretsiz kargo",
  "Ayni gun kargo ve Istanbul ici hizli teslimat",
  "14 gun kosulsuz iade",
  "Yeni sezon koleksiyonu simdi yayinda",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="overflow-hidden bg-ink-950 py-2.5 text-[10.5px] uppercase tracking-editorial text-bone-50">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...announcements, ...announcements, ...announcements].map((text, index) => (
            <span key={`${text}-${index}`} className="px-8 opacity-80">
              {text}
            </span>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500",
          scrolled
            ? "border-b border-ink-900/8 bg-bone-50/92 py-0 backdrop-blur-md"
            : "bg-transparent py-1"
        )}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <Container className="flex h-16 items-center justify-between md:h-[76px]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-ml-2 p-2 text-ink-900 md:hidden"
            aria-label="Menu"
          >
            <Menu strokeWidth={1.4} size={22} />
          </button>

          <div className="hidden flex-1 items-center gap-9 md:flex">
            {navItems.slice(0, 3).map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onHover={setActiveMenu}
                isActive={activeMenu === item.label}
              />
            ))}
          </div>

          <Link href="/" className="flex flex-col items-center group">
            <span className="font-display text-[28px] leading-none text-ink-900 transition-colors duration-500 group-hover:text-rose-600 md:text-[34px]">
              Miss <span className="font-italic-display text-rose-600">Bella</span>
            </span>
            <span className="mt-1.5 hidden text-[9px] uppercase tracking-editorial text-ink-600 md:block">
              Zarafetin en ozel hali
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-9 md:flex">
            {navItems.slice(3).map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onHover={setActiveMenu}
                isActive={activeMenu === item.label}
              />
            ))}
          </div>

          <div className="ml-2 flex items-center gap-0.5 md:ml-8 md:gap-1">
            <button
              type="button"
              aria-label="Ara"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-ink-900 transition-colors hover:text-rose-600"
            >
              <Search strokeWidth={1.4} size={18} />
            </button>
            <Link
              href="/favorilerim"
              aria-label="Favorilerim"
              className="relative hidden p-2.5 text-ink-900 transition hover:text-rose-600 sm:inline-flex"
            >
              <Heart strokeWidth={1.4} size={18} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-rose-600 text-[9px] font-medium text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Sepet"
              className="relative p-2.5 text-ink-900 transition hover:text-rose-600"
            >
              <ShoppingBag strokeWidth={1.4} size={18} />
              {itemCount > 0 && (
                <span className="absolute right-1 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-rose-600 text-[9px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </Container>

        {activeMenu && (
          <MegaMenuPanel
            activeMenu={activeMenu}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={navItems}
        cartCount={itemCount}
      />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function NavLink({
  item,
  onHover,
  isActive,
}: {
  item: NavItem;
  onHover: (label: string | null) => void;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      onMouseEnter={() => onHover(item.label)}
      className={cn(
        "group relative py-2 text-[11.5px] uppercase tracking-editorial transition-colors",
        isActive ? "text-rose-600" : "text-ink-800 hover:text-rose-600"
      )}
    >
      {item.label}
      <span
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px origin-left bg-rose-600 transition-transform duration-500",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

function MegaMenuPanel({
  activeMenu,
  onClose,
}: {
  activeMenu: string;
  onClose: () => void;
}) {
  const item = navItems.find((nav) => nav.label === activeMenu);

  const previewProducts = useMemo(() => {
    if (!item) return [];
    if (item.category) {
      return products
        .filter((product) => product.category === item.category)
        .slice(0, 3);
    }
    if (item.filter === "new") {
      return products.filter((product) => product.isNew).slice(0, 3);
    }
    if (item.filter === "sale") {
      return products
        .filter((product) => product.oldPrice && product.oldPrice > product.price)
        .slice(0, 3);
    }
    return [];
  }, [item]);

  if (!item || previewProducts.length === 0) return null;

  return (
    <div
      className="absolute inset-x-0 top-full hidden border-t border-ink-900/8 bg-bone-50/98 shadow-luxe backdrop-blur md:block"
      onMouseEnter={() => undefined}
    >
      <Container className="grid grid-cols-12 gap-8 py-10">
        <div className="col-span-3">
          <p className="luxe-label plain text-rose-600">{item.label}</p>
          <h3 className="mt-3 font-display text-3xl text-ink-900">
            Kesfet
          </h3>
          <ul className="mt-6 space-y-3 text-sm text-ink-800">
            {categories.slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/products?category=${category.slug}`}
                  onClick={onClose}
                  className="inline-block transition hover:translate-x-1 hover:text-rose-600"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/products"
                onClick={onClose}
                className="inline-block text-[11px] uppercase tracking-editorial text-rose-600"
              >
                Tum Urunler →
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-9 grid grid-cols-3 gap-4">
          {previewProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-bone-100">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-3 truncate font-display text-base text-ink-900 group-hover:text-rose-600">
                {product.name}
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink-900">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
