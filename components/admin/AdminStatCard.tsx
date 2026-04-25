import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  accent = "default",
  isCurrency,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  accent?: "default" | "rose" | "emerald" | "amber";
  isCurrency?: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {isCurrency ? formatPrice(value) : value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            accent === "rose" && "bg-rose-50 text-rose-600",
            accent === "emerald" && "bg-emerald-50 text-emerald-600",
            accent === "amber" && "bg-amber-50 text-amber-600",
            accent === "default" && "bg-slate-100 text-slate-700"
          )}
        >
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}
