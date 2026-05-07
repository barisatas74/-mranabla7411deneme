import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-24 text-center md:py-36">
      <span className="luxe-label">Sayfa Bulunamadı</span>
      <h1 className="mt-5 font-display text-[80px] leading-none text-ink-900 md:text-[140px]">
        4<span className="font-italic-display text-gradient-fuchsia">0</span>4
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-700 md:text-base">
        Aradığınız sayfa bulunamadı. Dilerseniz anasayfaya dönebilir veya
        koleksiyonu incelemeye devam edebilirsiniz.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-luxe btn-luxe-dark shadow-soft">
          Anasayfaya Dön <ArrowRight strokeWidth={1.5} size={14} />
        </Link>
        <Link href="/products" className="btn-luxe btn-luxe-outline">
          Koleksiyonu Keşfet
        </Link>
      </div>
    </Container>
  );
}
