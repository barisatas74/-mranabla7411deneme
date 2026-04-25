import Link from "next/link";
import Container from "@/components/Container";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-24 text-center md:py-36">
      <span className="luxe-label">Sayfa Bulunamadi</span>
      <h1 className="mt-5 font-display text-[80px] leading-none text-ink-900 md:text-[140px]">
        4<span className="font-italic-display text-rose-600">0</span>4
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-700 md:text-base">
        Aradiginiz sayfa bulunamadi. Dilerseniz anasayfaya donebilir veya
        koleksiyonu incelemeye devam edebilirsiniz.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-luxe btn-luxe-dark shadow-soft">
          Anasayfaya Don <ArrowRight strokeWidth={1.5} size={14} />
        </Link>
        <Link href="/products" className="btn-luxe btn-luxe-outline">
          Koleksiyonu Kesfet
        </Link>
      </div>
    </Container>
  );
}
