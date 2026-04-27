import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { ArrowRight } from "lucide-react";

const editorialShots = [
  {
    src: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1200&q=85",
    alt: "Bella Edition lookbook karesi",
    label: "Look 01",
    title: "Dantel & Saten",
    href: "/products?category=takimlar",
    span: "md:col-span-7 md:row-span-2",
    aspect: "aspect-[3/4] md:aspect-auto",
  },
  {
    src: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=900&q=85",
    alt: "Saten gecelik lookbook karesi",
    label: "Look 02",
    title: "Ipek Saten",
    href: "/products?category=gecelikler",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    src: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=900&q=85",
    alt: "Sortlu takim lookbook karesi",
    label: "Look 03",
    title: "Loungewear",
    href: "/products?category=sortlu-takimlar",
    span: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
];

export default function Lookbook() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-bone-50 md:py-28">
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-rose-600/10 blur-[160px]" />
      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-rose-300/10 blur-[160px]" />

      <Container className="relative">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-2 md:items-end">
          <div>
            <span className="luxe-label plain !text-rose-300">
              Spring Edition 2026
            </span>
            <h2 className="mt-5 font-display text-[40px] leading-[1.02] text-bone-50 md:text-[68px]">
              Bella{" "}
              <span className="font-italic-display text-rose-300">Lookbook</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base md:justify-self-end">
            Yeni sezonun yumusak siluetlerini, narin dantellerini ve saten
            dokunuslarini bir araya getiren editorial seri.
          </p>
        </div>

        <div className="grid gap-3 md:auto-rows-[280px] md:grid-cols-12 md:gap-4">
          {editorialShots.map((shot) => (
            <Link
              key={shot.label}
              href={shot.href}
              className={`group relative block overflow-hidden bg-ink-900 ${shot.span} ${shot.aspect}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />

              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-editorial text-rose-300">
                    {shot.label}
                  </p>
                  <p className="mt-1 font-display text-2xl text-bone-50 md:text-3xl">
                    {shot.title}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition group-hover:border-rose-300 group-hover:text-rose-300">
                  <ArrowRight strokeWidth={1.5} size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products?filter=new"
            className="btn-luxe border border-white/30 text-white hover:bg-white/10"
          >
            Tum Lookbook&apos;u Kesfet <ArrowRight strokeWidth={1.5} size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
