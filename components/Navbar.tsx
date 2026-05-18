"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, Search, ShoppingBag, Heart, User as UserIcon } from "lucide-react";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import SearchOverlay from "./SearchOverlay";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AdminCategory, Product, User } from "@/types";
import { logoutAction } from "@/lib/actions/auth";

type NavEffect = "pulse" | "stretch" | "slide" | "lift" | "moon" | "flash";

type NavItem = {
  label: string;
  href: string;
  category?: string;
  filter?: "new" | "sale";
  effect: NavEffect;
};

const navItems: NavItem[] = [
  { label: "Yeni Sezon", href: "/products?filter=new", filter: "new", effect: "pulse" },
  { label: "Sütyen", href: "/products?category=sutyenler", category: "sutyenler", effect: "stretch" },
  { label: "Külot", href: "/products?category=kulotlar", category: "kulotlar", effect: "slide" },
  { label: "Takım", href: "/products?category=takimlar", category: "takimlar", effect: "lift" },
  {
    label: "Gecelik",
    href: "/products?category=gecelikler",
    category: "gecelikler",
    effect: "moon",
  },
  { label: "İndirim", href: "/products?filter=sale", filter: "sale", effect: "flash" },
];

const announcements = [
  "300 TL üzeri ücretsiz kargo",
  "Aynı gün kargo ve İstanbul içi hızlı teslimat",
  "14 gün koşulsuz iade",
  "Yeni sezon koleksiyonu şimdi yayında",
];

type NavbarProps = {
  categories: AdminCategory[];
  products: Product[];
  currentUser: User | null;
};

export default function Navbar({ categories, products, currentUser }: NavbarProps) {
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
      <div className="overflow-hidden bg-vivid-gradient py-2.5 text-[10.5px] uppercase tracking-editorial text-white">
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
              Miss <span className="font-italic-display text-gradient-fuchsia">Bella</span>
            </span>
            <span className="mt-1.5 hidden text-[9px] uppercase tracking-editorial text-ink-600 md:block">
              Zarafetin en özel hali
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
            <UserMenu currentUser={currentUser} />
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
            categories={categories}
            products={products}
          />
        )}
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={navItems}
        cartCount={itemCount}
        currentUser={currentUser}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
      />
    </>
  );
}

function UserMenu({ currentUser }: { currentUser: User | null }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={currentUser ? "Hesabım" : "Giriş yap"}
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2.5 text-ink-900 transition hover:text-rose-600"
      >
        <UserIcon strokeWidth={1.4} size={18} />
        {currentUser && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-600" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 border border-ink-900/10 bg-white p-3 shadow-luxe">
          {currentUser ? (
            <>
              <div className="border-b border-ink-900/8 px-2 pb-3">
                <p className="text-[10px] uppercase tracking-luxe text-ink-600">
                  Hoş geldiniz
                </p>
                <p className="mt-1 truncate text-sm font-medium text-ink-900">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-ink-600">
                  {currentUser.email}
                </p>
              </div>
              <div className="mt-2 space-y-0.5">
                <Link
                  href="/hesabim"
                  onClick={() => setOpen(false)}
                  className="block rounded px-2 py-2 text-sm text-ink-900 transition hover:bg-bone-50 hover:text-rose-600"
                >
                  Hesabım
                </Link>
                <Link
                  href="/favorilerim"
                  onClick={() => setOpen(false)}
                  className="block rounded px-2 py-2 text-sm text-ink-900 transition hover:bg-bone-50 hover:text-rose-600"
                >
                  Favorilerim
                </Link>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setOpen(false);
                    startTransition(() => logoutAction());
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm text-ink-900 transition hover:bg-bone-50 hover:text-rose-600 disabled:opacity-60"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  {pending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="px-2 py-2 text-[11px] uppercase tracking-luxe text-ink-600">
                Hesap
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/giris"
                  onClick={() => setOpen(false)}
                  className="block rounded px-2 py-2 text-sm text-ink-900 transition hover:bg-bone-50 hover:text-rose-600"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/uye-ol"
                  onClick={() => setOpen(false)}
                  className="block rounded bg-rose-600 px-2 py-2 text-center text-sm text-white transition hover:bg-rose-700"
                >
                  Üye Ol
                </Link>
              </div>
              <p className="mt-3 border-t border-ink-900/8 px-2 pt-3 text-[11px] text-ink-600">
                Üyelik ile siparişlerinizi takip edin ve favorilerinizi
                senkronlayın.
              </p>
            </>
          )}
        </div>
      )}
    </div>
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
  const effectClass = `nav-effect-${item.effect}`;

  return (
    <Link
      href={item.href}
      onMouseEnter={() => onHover(item.label)}
      className={cn("nav-link", effectClass, isActive && "is-active")}
    >
      {item.effect === "slide" ? <span>{item.label}</span> : item.label}
    </Link>
  );
}

function MegaMenuPanel({
  activeMenu,
  onClose,
  categories,
  products,
}: {
  activeMenu: string;
  onClose: () => void;
  categories: AdminCategory[];
  products: Product[];
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
  }, [item, products]);

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
            Keşfet
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
                Tüm Ürünler →
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
