"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 text-center md:py-32">
      <span className="luxe-label">Bir Sorun Olustu</span>
      <h1 className="mt-5 font-display text-[42px] leading-none text-ink-900 md:text-[72px]">
        Sayfa yuklenemedi
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-700 md:text-base">
        Beklenmeyen bir hata olustu. Sayfayi yeniden deneyebilir veya kataloga geri
        donebilirsiniz.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-luxe btn-luxe-dark">
          Tekrar Dene
        </button>
        <Link href="/products" className="btn-luxe btn-luxe-outline">
          Koleksiyona Don
        </Link>
      </div>
    </Container>
  );
}
