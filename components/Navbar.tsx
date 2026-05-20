"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { LogOut, Menu, Search, ShoppingBag, Heart, User as UserIcon } from "lucide-react";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import SearchOverlay from "./SearchOverlay";
import { cn } from "@/lib/utils";
import { CategoryNavItem, User } from "@/types";
import { logoutAction } from "@/lib/actions/auth";

type NavEffect = "pulse" | "stretch" | "slide" | "lift" | "moon" | "flash";

type NavItem = {
  label: string;
  href: string;
  category?: string;
  filter?: "new" | "sale";
  effect: NavEffect;
};

const fallbackCategoryNavItems: CategoryNavItem[] = [
  { id: "sutyenler", name: "Sütyen", slug: "sutyenler" },
  { id: "kulotlar", name: "Külot", slug: "kulotlar" },
  { id: "takimlar", name: "Takım", slug: "takimlar" },
  { id: "gecelikler", name: "Gecelik", slug: "gecelikler" },
];

const categoryEffects: NavEffect[] = ["stretch", "slide", "lift", "moon"];

const announcements = [
  "300 TL üzeri ücretsiz kargo",
  "Aynı gün kargo ve İstanbul içi hızlı teslimat",
  "14 gün koşulsuz iade",
  "Yeni sezon koleksiyonu şimdi yayında",
];

type CurrentUserResponse = {
  user: User | null;
};

type CategoryNavResponse = {
  categories?: CategoryNavItem[];
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categoryNavItems, setCategoryNavItems] = useState<CategoryNavItem[]>(
    fallbackCategoryNavItems
  );
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const refreshCurrentUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as CurrentUserResponse;
      setCurrentUser(data.user ?? null);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    void refreshCurrentUser();
    window.addEventListener("miss-bella-auth-changed", refreshCurrentUser);
    return () =>
      window.removeEventListener("miss-bella-auth-changed", refreshCurrentUser);
  }, [refreshCurrentUser]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories/nav");
        if (!response.ok) return;
        const data = (await response.json()) as CategoryNavResponse;
        if (!cancelled && data.categories?.length) {
          setCategoryNavItems(data.categories);
        }
      } catch {
        if (!cancelled) setCategoryNavItems(fallbackCategoryNavItems);
      }
    }

    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryItems: NavItem[] = categoryNavItems.slice(0, 4).map((category, index) => ({
    label: category.name,
    href: `/products?category=${category.slug}`,
    category: category.slug,
    effect: categoryEffects[index] ?? "stretch",
  }));
  const navItems: NavItem[] = [
    { label: "Yeni Sezon", href: "/products?filter=new", filter: "new", effect: "pulse" },
    ...categoryItems,
    { label: "İndirim", href: "/products?filter=sale", filter: "sale", effect: "flash" },
  ];
  const splitIndex = Math.min(3, navItems.length);

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
            {navItems.slice(0, splitIndex).map((item) => (
              <NavLink key={item.href} item={item} />
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
            {navItems.slice(splitIndex).map((item) => (
              <NavLink key={item.href} item={item} />
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

function NavLink({ item }: { item: NavItem }) {
  const effectClass = `nav-effect-${item.effect}`;

  return (
    <Link href={item.href} className={cn("nav-link", effectClass)}>
      {item.effect === "slide" ? <span>{item.label}</span> : item.label}
    </Link>
  );
}
