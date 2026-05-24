import Link from "next/link";
import Container from "./Container";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bone-50">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffe8f1_0%,#fffafc_44%,#ffd0e5_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_60%,rgba(238,42,139,0.22)_0%,rgba(238,42,139,0.08)_28%,transparent_60%)]" />

      <span className="pointer-events-none absolute left-10 top-24 hidden select-none font-display text-[200px] leading-none text-rose-600/[0.06] md:block">
        M<span className="font-italic-display">B</span>
      </span>
      <span className="pointer-events-none absolute right-10 bottom-32 hidden select-none font-italic-display text-[120px] leading-none text-rose-600/[0.06] md:block lg:text-[160px]">
        Bella
      </span>

      <Container className="relative grid min-h-[calc(100svh-126px)] items-center gap-8 py-10 md:min-h-[calc(100vh-120px)] md:gap-10 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2 md:mb-6 md:gap-3">
            <span className="h-px w-8 bg-rose-600/40 md:w-12" />
            <span className="luxe-label plain text-rose-600">
              <Sparkles size={13} strokeWidth={1.5} className="text-rose-500" />
              Spring Collection 2026
            </span>
            <span className="h-px w-8 bg-rose-600/40 md:w-12" />
          </div>

          <h1 className="font-display text-[52px] leading-[0.93] tracking-tight text-ink-900 md:text-[110px] md:leading-[0.95]">
            Zarafetin
            <br />
            <span className="font-italic-display text-gradient-fuchsia">
              en özel
            </span>
            <br />
            hâli.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[14px] font-light leading-[1.7] text-ink-700 md:mt-9 md:text-[17px] md:leading-[1.85]">
            Fransız danteli, yumuşak satenler ve modern siluetlerle hazırlanan
            premium iç giyim koleksiyonu. Her parça, günlük konforu zarafetle
            birleştirir.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-10">
            <Link
              href="/products"
              className="btn-luxe btn-luxe-rose shadow-luxe"
            >
              Koleksiyonu Keşfet{" "}
              <ArrowRight strokeWidth={1.5} size={15} />
            </Link>
            <Link
              href="/products?filter=new"
              className="btn-luxe btn-luxe-outline"
            >
              Yeni Gelenler
            </Link>
          </div>

          <div className="mx-auto mt-9 grid max-w-2xl grid-cols-3 gap-3 md:mt-14 md:gap-8">
            {[
              ["Fransız", "Danteli"],
              ["El", "İşçiliği"],
              ["Türkiye", "Üretimi"],
            ].map(([title, subtitle]) => (
              <div
                key={title}
                className="border-l border-rose-600/30 pl-3 text-left md:pl-5"
              >
                <p className="font-display text-lg leading-tight text-ink-900 md:text-2xl">
                  {title}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-editorial text-ink-600">
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="relative border-t border-ink-900/8 bg-bone-50/60 backdrop-blur">
        <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-5 text-[10px] uppercase tracking-editorial text-ink-700 md:justify-between">
          <span>Ücretsiz kargo 300 TL+</span>
          <span className="hidden md:inline">14 gün iade</span>
          <span>Güvenli ödeme</span>
          <span className="hidden md:inline">İstanbul aynı gün</span>
          <span>Özel paketleme</span>
        </Container>
      </div>
    </section>
  );
}
