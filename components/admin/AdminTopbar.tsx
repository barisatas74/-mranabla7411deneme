"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Urun Yonetimi",
  "/admin/categories": "Kategori Yonetimi",
  "/admin/orders": "Siparis Yonetimi",
  "/admin/settings": "Genel Ayarlar",
};

export default function AdminTopbar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const pathname = usePathname();
  const title = useMemo(() => {
    if (pathname.includes("/products/new")) {
      return "Yeni Urun";
    }

    if (pathname.includes("/products/") && pathname.includes("/edit")) {
      return "Urun Duzenle";
    }

    if (pathname.includes("/orders/") && pathname !== "/admin/orders") {
      return "Siparis Detayi";
    }

    return titleMap[pathname] ?? "Admin";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-[#f7f5f1]/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 md:hidden"
          aria-label="Sidebar ac"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Luna Rosa</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-950 md:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 md:flex">
          <Search size={15} className="text-slate-400" />
          <span className="text-sm text-slate-400">Hizli arama yakinda</span>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-700"
          aria-label="Bildirimler"
        >
          <Bell size={17} />
        </button>
        <div className="hidden rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white md:block">
          Admin
        </div>
      </div>
    </header>
  );
}
