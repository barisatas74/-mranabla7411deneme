"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import { useCart } from "@/components/CartContext";

export default function PaymentResultClient() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const cleared = useRef(false);

  const durum = params.get("durum");
  const siparis = params.get("siparis");
  const mesaj = params.get("mesaj");
  const isSuccess = durum === "basarili";

  // Başarılı ödemede sepeti bir kez temizle
  useEffect(() => {
    if (isSuccess && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [isSuccess, clearCart]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Sepetim", href: "/cart" },
          { label: "Ödeme Sonucu" },
        ]}
      />
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-xl rounded-[32px] border border-ink-900/10 bg-white p-8 text-center shadow-card md:p-12">
          {isSuccess ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white">
                <CheckCircle2 size={30} />
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-editorial text-rose-600">
                Ödeme Başarılı
              </p>
              <h1 className="mt-3 font-display text-4xl text-ink-900 md:text-5xl">
                Siparişiniz Alındı
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-700 md:text-base">
                {siparis ? (
                  <>
                    Sipariş numaranız{" "}
                    <span className="font-medium text-ink-900">{siparis}</span>.{" "}
                  </>
                ) : null}
                Ödemeniz güvenli şekilde alındı. Sipariş detayları e-posta
                adresinize gönderilecektir.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/hesabim" className="btn-luxe btn-luxe-dark">
                  Siparişlerim
                </Link>
                <Link href="/products" className="btn-luxe">
                  Alışverişe Devam Et
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-900/5 text-ink-900">
                <XCircle size={30} strokeWidth={1.5} />
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-editorial text-ink-600">
                Ödeme Tamamlanamadı
              </p>
              <h1 className="mt-3 font-display text-4xl text-ink-900 md:text-5xl">
                Bir Sorun Oluştu
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-700 md:text-base">
                {mesaj ||
                  "Ödeme işlemi tamamlanamadı. Kartınızdan çekim yapılmadıysa güvendesiniz."}
              </p>
              {siparis ? (
                <p className="mt-2 text-xs text-ink-600">
                  İlgili sipariş: {siparis}
                </p>
              ) : null}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/checkout" className="btn-luxe btn-luxe-dark">
                  Tekrar Dene
                </Link>
                <Link href="/iletisim" className="btn-luxe">
                  Yardım Al
                </Link>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
}
