import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bone-50">
      <div className="absolute inset-0 bg-gradient-to-br from-powder-100 via-bone-50 to-bone-100" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-rose-200/35 blur-[140px]" />
      <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full bg-champagne-100/80 blur-[140px]" />

      <span className="pointer-events-none absolute left-10 top-24 hidden select-none font-display text-[180px] leading-none text-rose-600/5 md:block">
        M<span className="font-italic-display">B</span>
      </span>
      <span className="pointer-events-none absolute right-8 top-[62%] hidden -translate-y-1/2 select-none font-italic-display text-[92px] leading-none text-rose-600/8 md:block lg:right-14 lg:top-[68%] lg:text-[118px]">
        dantel
      </span>

      <Container className="relative grid min-h-[calc(100vh-120px)] items-center gap-10 py-12 md:grid-cols-12 md:gap-14 md:py-20">
        <div className="fade-up md:col-span-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="luxe-label plain text-rose-600">
              Spring Collection
            </span>
            <span className="h-px w-16 bg-rose-600/40" />
          </div>

          <h1 className="font-display text-[56px] leading-[0.95] tracking-tight text-ink-900 md:text-[92px]">
            Zarafetin
            <br />
            <span className="font-italic-display text-rose-600">en ozel</span>
            <br />
            hali.
          </h1>

          <div className="mt-7 flex max-w-md items-start gap-5">
            <span className="mt-2 h-px w-10 flex-shrink-0 bg-ink-900/30" />
            <p className="text-[15px] font-light leading-[1.75] text-ink-700 md:text-[16px]">
              Fransiz danteli, yumusak satenler ve guclu siluetlerle hazirlanan
              secili parcalar. Her tasarim, gunluk konforu premium bir hisle
              birlestirir.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="btn-luxe btn-luxe-dark shadow-soft">
              Koleksiyonu Kesfet <ArrowRight strokeWidth={1.5} size={15} />
            </Link>
            <Link href="/products?filter=new" className="btn-luxe btn-luxe-outline">
              Yeni Gelenler
            </Link>
          </div>

          <div className="mt-9 grid max-w-md grid-cols-3 gap-4">
            {[
              ["Fransiz", "Danteli"],
              ["El", "Isciligi"],
              ["Turkiye", "Uretimi"],
            ].map(([title, subtitle]) => (
              <div key={title} className="border-l border-rose-600/30 pl-3">
                <p className="font-display text-lg leading-tight text-ink-900">
                  {title}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-editorial text-ink-600">
                  {subtitle}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="border border-rose-600/15 bg-white/55 px-4 py-3.5 backdrop-blur">
              <p className="text-[10px] uppercase tracking-editorial text-rose-600">
                Editor Secimi
              </p>
              <p className="mt-1.5 font-display text-lg leading-tight text-ink-900">
                Rosa Dantel Takimi
              </p>
              <p className="mt-1.5 text-xs leading-5 text-ink-700">
                Pudra ve siyah renk secenekleriyle yeni sezonun imza parcasi.
              </p>
            </div>
            <div className="border border-ink-900/10 bg-bone-50/70 px-4 py-3.5 backdrop-blur">
              <p className="text-[10px] uppercase tracking-editorial text-ink-600">
                Koleksiyon Notu
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-[#f5c2cd] ring-1 ring-ink-900/10" />
                <span className="h-4 w-4 rounded-full bg-[#0c0c0d] ring-1 ring-ink-900/10" />
                <span className="h-px flex-1 bg-ink-900/15" />
                <span className="text-[11px] font-medium text-ink-900">
                  XS - L
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-700">
                Gunluk konforu dantel detaylariyla birlestiren yumusak form.
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-[480px] md:col-span-6 md:h-[620px]">
          <div className="absolute -left-2 top-2 z-10 hidden w-[180px] border border-rose-600/15 bg-bone-50/90 px-4 py-3 shadow-card backdrop-blur md:block">
            <p className="text-[9px] uppercase tracking-editorial text-rose-600">
              Bella Edition
            </p>
            <p className="mt-1 font-display text-[22px] leading-none text-ink-900">
              No 001
            </p>
          </div>

          <div className="absolute right-0 top-0 h-[88%] w-[72%] overflow-hidden bg-powder-100 shadow-luxe img-reveal">
            <Image
              src="https://images.unsplash.com/photo-1762195020450-4447ebcf8de5?w=1400&q=90&auto=format&fit=crop"
              alt="Rosa Dantel Sutyen Takimi"
              fill
              priority
              sizes="(max-width: 768px) 75vw, 45vw"
              placeholder="empty"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/20 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-4 left-0 hidden h-[48%] w-[42%] overflow-hidden border-[6px] border-bone-50 bg-bone-100 shadow-card img-reveal md:block">
            <Image
              src="https://images.unsplash.com/photo-1762195025289-f6b87a0fef14?w=800&q=90&auto=format&fit=crop"
              alt="Rosa Dantel Takimi detay gorseli"
              fill
              sizes="(max-width: 768px) 0vw, 25vw"
              className="object-cover"
            />
          </div>

          <div className="absolute left-4 top-8 hidden flex-col items-center gap-3 text-ink-900 md:flex">
            <span className="writing-vertical rotate-180 text-[10px] uppercase tracking-editorial [writing-mode:vertical-rl]">
              No 001 Bella Edition
            </span>
            <span className="h-16 w-px bg-ink-900/25" />
          </div>

          <div className="fade-up absolute -bottom-2 right-4 max-w-[220px] bg-bone-50 px-5 py-4 shadow-card md:right-0">
            <p className="text-[10px] uppercase tracking-editorial text-rose-600">
              Editor&apos;s Pick
            </p>
            <p className="mt-1 font-display text-base leading-tight text-ink-900">
              Rosa Dantel Takimi
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-medium text-ink-900">1.290 TL</span>
              <span className="text-[11px] text-ink-500 line-through">
                1.590 TL
              </span>
            </div>
          </div>

          <div className="absolute bottom-16 left-8 hidden max-w-[220px] border border-white/70 bg-bone-50/85 px-5 py-4 shadow-soft backdrop-blur md:block">
            <p className="text-[10px] uppercase tracking-editorial text-ink-600">
              Dantel Detayi
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-800">
              Hafif destek, yumusak astar ve zarif cizgiler.
            </p>
          </div>
        </div>
      </Container>

      <div className="relative border-t border-ink-900/8 bg-bone-50/60 backdrop-blur">
        <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-5 text-[10px] uppercase tracking-editorial text-ink-700 md:justify-between">
          <span>Ucretsiz kargo 300 TL+</span>
          <span className="hidden md:inline">14 gun iade</span>
          <span>Guvenli odeme</span>
          <span className="hidden md:inline">Istanbul ayni gun</span>
          <span>Ozel paketleme</span>
        </Container>
      </div>
    </section>
  );
}
