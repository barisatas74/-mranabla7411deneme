"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Shapes,
  ShoppingCart,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Urunler", icon: Package },
  { href: "/admin/categories", label: "Kategoriler", icon: Shapes },
  { href: "/admin/orders", label: "Siparisler", icon: ShoppingCart },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
];

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-slate-800 bg-slate-950 px-5 py-6 text-white transition-transform md:sticky md:z-30 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Miss Bella</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Admin</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-800 p-2 text-slate-300 md:hidden"
            aria-label="Sidebar kapat"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-10 space-y-2">
          {items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mock Mod</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Tum admin akisleri mock data ile calisiyor. Veri katmani ileride Supabase
            veya Firebase baglantisina uygun sekilde ayrildi.
          </p>
        </div>
      </aside>
    </>
  );
}
