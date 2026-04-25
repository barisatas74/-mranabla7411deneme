import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  passive: "bg-slate-100 text-slate-600 ring-slate-200",
  beklemede: "bg-amber-50 text-amber-700 ring-amber-200",
  hazirlaniyor: "bg-sky-50 text-sky-700 ring-sky-200",
  "kargoya-verildi": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  tamamlandi: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "iptal-edildi": "bg-rose-50 text-rose-700 ring-rose-200",
  bekleniyor: "bg-amber-50 text-amber-700 ring-amber-200",
  odendi: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "iade-edildi": "bg-rose-50 text-rose-700 ring-rose-200",
  paketlendi: "bg-violet-50 text-violet-700 ring-violet-200",
  yolda: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "teslim-edildi": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  in: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  low: "bg-amber-50 text-amber-700 ring-amber-200",
  out: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function AdminStatusBadge({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
        toneMap[value] ?? "bg-slate-100 text-slate-700 ring-slate-200"
      )}
    >
      {label ?? value.replace(/-/g, " ")}
    </span>
  );
}
