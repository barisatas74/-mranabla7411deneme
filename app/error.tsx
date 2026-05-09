"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

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
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-bone-50 via-powder-50 to-bone-100">
      <div className="absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-rose-300/25 blur-[140px]" />
      <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-rose-400/20 blur-[140px]" />

      <Container className="relative py-24 text-center md:py-32">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-rose-500 text-white shadow-luxe">
          <AlertTriangle size={28} strokeWidth={1.5} />
        </div>

        <span className="mt-6 inline-block luxe-label">Bir Sorun Oluştu</span>
        <h1 className="mt-4 font-display text-[42px] leading-tight text-ink-900 md:text-[72px]">
          Sayfa{" "}
          <span className="font-italic-display text-gradient-fuchsia">
            yüklenemedi
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-ink-700 md:text-base">
          Beklenmeyen bir hata oluştu. Sayfayı yeniden deneyebilir veya
          anasayfaya dönebilirsiniz. Sorun devam ederse müşteri hizmetlerimize
          ulaşmaktan çekinmeyin.
        </p>

        {error.digest && (
          <p className="mt-3 text-[10px] uppercase tracking-editorial text-ink-500">
            Hata Kodu: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="btn-luxe btn-luxe-rose shadow-luxe"
          >
            <RotateCw size={14} strokeWidth={1.5} /> Tekrar Dene
          </button>
          <Link href="/" className="btn-luxe btn-luxe-outline">
            <Home size={14} strokeWidth={1.5} /> Anasayfaya Dön
          </Link>
        </div>
      </Container>
    </section>
  );
}
