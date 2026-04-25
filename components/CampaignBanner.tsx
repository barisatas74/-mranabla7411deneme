import Link from "next/link";
import Image from "next/image";
import Container from "./Container";

export default function CampaignBanner() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white grain">
      <div className="absolute inset-0 opacity-40">
        <Image
          src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1600&q=80"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/40" />
      </div>

      <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-rose-600/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-rose-400/10 blur-[120px]" />

      <Container className="relative grid items-center gap-10 py-24 md:grid-cols-2 md:py-36">
        <div>
          <span className="luxe-label plain !text-rose-300 flex items-center gap-3">
            <span className="h-px w-10 bg-rose-300/60" />
            Edition limitee
          </span>
          <h2 className="mt-6 font-display text-[48px] leading-[1] tracking-tight md:text-[84px]">
            Ikinci urunde
            <br />
            <span className="font-italic-display text-rose-300">
              yuzde 30 avantaj.
            </span>
          </h2>
          <p className="mt-6 max-w-md font-light leading-[1.8] text-white/70">
            Belirli urunlerde ikinci urune ozel indirim otomatik olarak sepete
            yansir. Kampanya secili urunlerde ve stoklarla sinirlidir.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="btn-luxe bg-bone-50 text-ink-900 shadow-luxe hover:bg-rose-300"
            >
              Alisverise Basla
            </Link>
            <Link
              href="/products?filter=sale"
              className="btn-luxe border border-white/30 text-white hover:bg-white/10"
            >
              Indirimli Urunler
            </Link>
          </div>
        </div>

        <div className="hidden justify-end md:flex">
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-end gap-3">
              <span className="text-[10px] uppercase tracking-editorial text-rose-300">
                Kod
              </span>
              <span className="font-display text-5xl tracking-wider text-white">
                ROSA30
              </span>
              <span className="text-[10px] uppercase tracking-editorial text-white/50">
                Sepette otomatik uygulanir
              </span>
            </div>
            <div className="h-40 w-px bg-white/15" />
            <div className="flex flex-col items-start gap-3">
              <span className="text-[10px] uppercase tracking-editorial text-rose-300">
                Kalan
              </span>
              <span className="font-display text-5xl text-white">
                05<span className="text-rose-300">:</span>23
              </span>
              <span className="text-[10px] uppercase tracking-editorial text-white/50">
                Gun ve saat
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
