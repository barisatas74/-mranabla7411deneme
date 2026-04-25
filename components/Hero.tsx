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
        L<span className="font-italic-display">R</span>
      </span>
      <span className="pointer-events-none absolute bottom-16 right-10 hidden select-none font-display text-[120px] italic leading-none text-ink-900/4 md:block">
        couture
      </span>

      <Container className="relative grid min-h-[calc(100vh-120px)] items-center gap-10 py-14 md:grid-cols-12 md:gap-16 md:py-28">
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

          <div className="mt-8 flex max-w-md items-start gap-5">
            <span className="mt-2 h-px w-10 flex-shrink-0 bg-ink-900/30" />
            <p className="text-[15px] font-light leading-[1.75] text-ink-700 md:text-[16px]">
              Fransiz danteli, yumusak satenler ve guclu siluetlerle hazirlanan
              secili parcalar. Her tasarim, gunluk konforu premium bir hisle
              birlestirir.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="btn-luxe btn-luxe-dark shadow-soft">
              Koleksiyonu Kesfet <ArrowRight strokeWidth={1.5} size={15} />
            </Link>
            <Link href="/products?filter=new" className="btn-luxe btn-luxe-outline">
              Yeni Gelenler
            </Link>
          </div>

          <div className="mt-14 grid max-w-md grid-cols-3 gap-4">
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
        </div>

        <div className="relative h-[480px] md:col-span-6 md:h-[680px]">
          <div className="absolute right-0 top-0 h-[88%] w-[72%] overflow-hidden bg-powder-100 shadow-luxe img-reveal">
            <Image
              src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1400&q=90"
              alt="Luna Rosa koleksiyonundan bir secki"
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
              src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&q=90"
              alt="Yakin cekim detay gorseli"
              fill
              sizes="(max-width: 768px) 0vw, 25vw"
              className="object-cover"
            />
          </div>

          <div className="absolute left-4 top-8 hidden flex-col items-center gap-3 text-ink-900 md:flex">
            <span className="writing-vertical rotate-180 text-[10px] uppercase tracking-editorial [writing-mode:vertical-rl]">
              No 001 Rosa Edition
            </span>
            <span className="h-16 w-px bg-ink-900/25" />
          </div>

          <div className="fade-up absolute -bottom-2 right-4 max-w-[200px] bg-bone-50 px-5 py-4 shadow-card md:right-0">
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
