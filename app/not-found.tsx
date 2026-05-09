import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight, Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-bone-50 via-powder-50 to-bone-100">
      <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-rose-300/30 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-rose-400/25 blur-[140px]" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-italic-display text-[280px] leading-none text-rose-600/[0.04] md:block">
        Bella
      </span>

      <Container className="relative py-20 text-center md:py-28">
        <span className="luxe-label">Sayfa Bulunamadı</span>
        <h1 className="mt-6 font-display text-[100px] leading-[0.85] text-ink-900 md:text-[200px]">
          4
          <span className="font-italic-display text-gradient-fuchsia">0</span>
          4
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ink-700 md:text-base">
          Aradığınız sayfa bulunamadı. Bağlantı kırık olabilir veya sayfa
          yerini değiştirmiş olabilir. Aşağıdaki bağlantılardan devam
          edebilirsiniz.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-luxe btn-luxe-rose shadow-luxe">
            <Home size={14} strokeWidth={1.5} /> Anasayfaya Dön
          </Link>
          <Link
            href="/products"
            className="btn-luxe btn-luxe-outline"
          >
            Koleksiyonu Keşfet <ArrowRight strokeWidth={1.5} size={14} />
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-14 grid mx-auto max-w-2xl gap-3 sm:grid-cols-3">
          <QuickLink
            href="/musteri-hizmetleri"
            Icon={Search}
            label="Yardım Merkezi"
          />
          <QuickLink href="/iletisim" Icon={ShoppingBag} label="İletişim" />
          <QuickLink href="/sss" Icon={Home} label="Sıkça Sorulanlar" />
        </div>
      </Container>
    </section>
  );
}

function QuickLink({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: typeof Home;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-center gap-2 rounded-full border border-ink-900/10 bg-bone-50/80 px-5 py-3 text-[11px] uppercase tracking-editorial text-ink-700 backdrop-blur transition hover:border-rose-600/30 hover:text-rose-600"
    >
      <Icon
        size={13}
        strokeWidth={1.5}
        className="text-rose-600 transition group-hover:scale-110"
      />
      {label}
    </Link>
  );
}
