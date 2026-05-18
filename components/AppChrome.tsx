"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/WhatsAppButton";
import AddToCartToast from "@/components/AddToCartToast";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import { AdminCategory, Product, User } from "@/types";

export default function AppChrome({
  children,
  categories,
  products,
  currentUser,
}: {
  children: React.ReactNode;
  categories: AdminCategory[];
  products: Product[];
  currentUser: User | null;
}) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/admin-giris");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:text-bone-50"
      >
        İçeriğe geç
      </a>
      <Navbar
        categories={categories}
        products={products}
        currentUser={currentUser}
      />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTop />
      <AddToCartToast />
      <CookieConsent />
    </>
  );
}
