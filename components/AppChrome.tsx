"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CategoryNavItem } from "@/types";

const FloatingWhatsApp = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
});
const AddToCartToast = dynamic(() => import("@/components/AddToCartToast"), {
  ssr: false,
});
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), {
  ssr: false,
});
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), {
  ssr: false,
});

export default function AppChrome({
  children,
  initialCategoryNavItems,
}: {
  children: React.ReactNode;
  initialCategoryNavItems: CategoryNavItem[];
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
      <Navbar initialCategoryNavItems={initialCategoryNavItems} />
      <main id="main-content">{children}</main>
      <Footer initialCategoryNavItems={initialCategoryNavItems} />
      <FloatingWhatsApp />
      <ScrollToTop />
      <AddToCartToast />
      <CookieConsent />
    </>
  );
}
