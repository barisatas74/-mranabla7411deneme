import Container from "./Container";
import Reveal from "./Reveal";
import { Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bone-50 via-powder-50 to-bone-100 py-24 md:py-36">
      <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-rose-300/30 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-rose-400/25 blur-[140px]" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-italic-display text-[280px] leading-none text-rose-600/5 md:block">
        Bella
      </span>

      <Container className="relative">
        <Reveal variant="up" className="mx-auto max-w-2xl text-center">
          <span className="luxe-label">Çok Yakında</span>
          <h2 className="mt-6 font-display text-[44px] leading-[1.05] text-ink-900 md:text-[80px]">
            Koleksiyonumuz
            <br />
            <span className="font-italic-display text-gradient-fuchsia shimmer-text">
              hazırlanıyor
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-base font-light leading-[1.8] text-ink-700">
            Özenle seçilmiş kumaşlar, narin dantel detayları ve modern siluetlerle
            hazırladığımız ilk koleksiyonumuz çok yakında sizlerle. Yeni sezonu
            kaçırmamak için bültenimize abone olun.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-rose-600/20 bg-white/70 px-5 py-2.5 text-[11px] uppercase tracking-editorial text-rose-600 backdrop-blur"
            >
              <Sparkles size={14} strokeWidth={1.5} className="text-rose-500" />
              Premium iç giyim koleksiyonu
            </span>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[10px] uppercase tracking-editorial text-ink-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Fransız Danteli
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              El İşçiliği
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Türkiye Üretimi
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Premium Kumaş
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
