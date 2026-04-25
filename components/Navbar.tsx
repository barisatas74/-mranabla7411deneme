"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import { useCart } from "./CartContext";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Yeni Sezon", href: "/products?filter=new" },
  { label: "Sutyen", href: "/products?category=sutyenler" },
  { label: "Kulot", href: "/products?category=kulotlar" },
  { label: "Takim", href: "/products?category=takimlar" },
  { label: "Gecelik", href: "/products?category=gecelikler" },
  { label: "Indirim", href: "/products?filter=sale" },
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
  const { itemCount } = useCart();

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
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <Link href="/" className="flex flex-col items-center group">
            <span className="font-display text-[28px] leading-none text-ink-900 transition-colors duration-500 group-hover:text-rose-600 md:text-[34px]">
              Luna <span className="font-italic-display text-rose-600">Rosa</span>
            </span>
            <span className="mt-1.5 hidden text-[9px] uppercase tracking-editorial text-ink-600 md:block">
              Zarafetin en ozel hali
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-9 md:flex">
            {navItems.slice(3).map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="ml-2 flex items-center gap-0.5 md:ml-8 md:gap-1">
            <IconButton label="Ara">
              <Search strokeWidth={1.4} size={18} />
            </IconButton>
            <IconButton label="Hesabim" className="hidden md:inline-flex">
              <User strokeWidth={1.4} size={18} />
            </IconButton>
            <IconButton label="Favoriler" className="hidden sm:inline-flex">
              <Heart strokeWidth={1.4} size={18} />
            </IconButton>
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
      />
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative py-2 text-[11.5px] uppercase tracking-editorial text-ink-800 transition-colors hover:text-rose-600"
    >
      {children}
      <span className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-rose-600 transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
  );
}

function IconButton({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn("p-2.5 text-ink-900 transition-colors hover:text-rose-600", className)}
    >
      {children}
    </button>
  );
}
