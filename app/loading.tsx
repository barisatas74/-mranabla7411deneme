export default function Loading() {
  return (
    <div
      className="min-h-[4200px] bg-bone-50 md:min-h-[3600px]"
      aria-busy="true"
    >
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-bone-50/95 backdrop-blur-md">
        <div className="absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-rose-300/25 blur-[140px]" />
        <div className="absolute -right-32 bottom-1/3 h-[400px] w-[400px] rounded-full bg-rose-400/20 blur-[140px]" />

        <div className="relative flex flex-col items-center gap-7">
          <span className="font-display text-5xl text-ink-900">
            Miss{" "}
            <span className="font-italic-display text-gradient-fuchsia shimmer-text">
              Bella
            </span>
          </span>

          <div className="relative h-[2px] w-48 overflow-hidden rounded-full bg-rose-600/15">
            <div className="absolute inset-y-0 w-1/3 animate-[marquee_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-rose-600 to-transparent" />
          </div>

          <span className="text-[10px] uppercase tracking-editorial text-ink-600">
            Zarafet yükleniyor...
          </span>
        </div>
      </div>
    </div>
  );
}
