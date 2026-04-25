"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";

export default function ProductsError({
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
    <Container className="py-24 text-center md:py-28">
      <span className="luxe-label">Katalog Hatasi</span>
      <h1 className="mt-5 font-display text-[40px] leading-none text-ink-900 md:text-[64px]">
        Urunler su an getirilemedi
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-700 md:text-base">
        Filtreleme veya sayfa yukleme asamasinda bir hata olustu. Yeniden deneyin ya da
        anasayfaya donun.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-luxe btn-luxe-dark">
          Tekrar Dene
        </button>
        <Link href="/" className="btn-luxe btn-luxe-outline">
          Anasayfaya Don
        </Link>
      </div>
    </Container>
  );
}
