export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-bone-50/90 backdrop-blur-sm">
      <span className="font-display text-4xl text-ink-900">
        Luna <span className="font-italic-display text-rose-600">Rosa</span>
      </span>
      <div className="relative h-px w-24 overflow-hidden bg-ink-900/10">
        <div className="absolute inset-y-0 w-1/3 animate-[marquee_1.4s_ease-in-out_infinite] bg-rose-600" />
      </div>
      <span className="text-[10px] uppercase tracking-editorial text-ink-600">
        Zarafet yukleniyor
      </span>
    </div>
  );
}
