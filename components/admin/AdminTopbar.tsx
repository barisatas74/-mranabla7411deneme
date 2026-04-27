"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

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
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin-giris");
      router.refresh();
    }
  }

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
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Miss Bella</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-950 md:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          <LogOut size={14} />
          {isLoggingOut ? "Cikiliyor..." : "Cikis"}
        </button>
      </div>
    </header>
  );
}
