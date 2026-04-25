"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import { useCart } from "@/components/CartContext";
import {
  DEFAULT_COUPON_CODE,
  FREE_SHIPPING_LIMIT,
  getCartSummary,
} from "@/lib/commerce";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";

export default function CartView() {
  const {
    lines,
    itemCount,
    couponCode,
    isHydrated,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [promoCodeInput, setPromoCodeInput] = useState(couponCode ?? "");
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const summary = getCartSummary(lines, { couponCode });

  function handleApplyCoupon() {
    const isValid = applyCoupon(promoCodeInput);
    setCouponFeedback(
      isValid
        ? `${DEFAULT_COUPON_CODE} uygulandi, %30 indirim hesaba katildi.`
        : "Kupon kodu gecersiz veya tanimsiz."
    );
  }

  if (!isHydrated) {
    return (
      <>
        <Breadcrumb items={[{ label: "Sepetim" }]} />
        <Container className="py-20 md:py-24">
          <div className="mx-auto max-w-2xl animate-pulse space-y-4">
            <div className="h-8 w-48 bg-bone-100" />
            <div className="h-36 bg-bone-100" />
            <div className="h-36 bg-bone-100" />
          </div>
        </Container>
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "Sepetim" }]} />
        <Container className="py-20 md:py-28">
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border border-ink-900/15">
              <ShoppingBag
                strokeWidth={1.2}
                size={26}
                className="text-rose-600"
              />
            </div>
            <span className="luxe-label">Panier Vide</span>
            <h1 className="mt-5 font-display text-[42px] leading-[1.05] text-ink-900 md:text-[64px]">
              Sepetiniz <span className="font-italic-display text-rose-600">bos</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-700 md:text-base">
              Koleksiyondan urun eklediginizde secimleriniz burada listelenecek.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/products" className="btn-luxe btn-luxe-dark shadow-soft">
                Alisverise Basla <ArrowRight strokeWidth={1.5} size={14} />
              </Link>
              <Link href="/products?filter=new" className="btn-luxe btn-luxe-outline">
                Yeni Sezonu Kesfet
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-4 border-t border-ink-900/10 pt-10 sm:grid-cols-3">
              <MiniTrust
                icon={<Truck size={16} strokeWidth={1.4} />}
                text="Ucretsiz Kargo"
              />
              <MiniTrust
                icon={<RotateCcw size={16} strokeWidth={1.4} />}
                text="Kolay Iade"
              />
              <MiniTrust
                icon={<ShieldCheck size={16} strokeWidth={1.4} />}
                text="Guvenli Odeme"
              />
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Sepetim" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-10 text-center md:py-14">
        <Container>
          <span className="luxe-label">Mon Panier</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[60px]">
            Sepetiniz
          </h1>
          <p className="mt-3 text-sm text-ink-700">
            {itemCount} urun, siparis ozeti ve guncel sepet durumunuz
          </p>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-3 lg:py-16">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-editorial text-ink-600">
              Sepette {lines.length} farkli urun var
            </p>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-editorial text-ink-700 transition hover:text-rose-600"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Sepeti Temizle
            </button>
          </div>

          {lines.map((line) => (
            <article
              key={line.id}
              className="flex flex-col gap-4 border border-ink-900/8 bg-white p-4 shadow-card transition-shadow duration-300 hover:shadow-soft sm:flex-row sm:gap-6 sm:p-6"
            >
              <Link
                href={`/products/${line.product.slug}`}
                className="relative aspect-[4/5] w-full overflow-hidden bg-bone-100 sm:h-40 sm:w-32 sm:flex-shrink-0"
              >
                <Image
                  src={line.product.images[0]}
                  alt={line.product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 128px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${line.product.slug}`}
                      className="block font-display text-xl leading-tight text-ink-900 transition hover:text-rose-600"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-1.5 text-[11px] tracking-wider text-ink-600">
                      {line.color} / Beden {line.size}
                    </p>
                  </div>
                  <div className="flex items-start gap-1">
                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      aria-label="Kaldir"
                      className="p-1 text-ink-500 transition hover:text-rose-600"
                    >
                      <X size={17} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:mt-auto sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center border border-ink-900/15">
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(line.id, line.quantity - 1)}
                      disabled={line.quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center hover:bg-bone-100 disabled:opacity-40"
                      aria-label="Azalt"
                    >
                      <Minus size={13} strokeWidth={1.5} />
                    </button>
                    <span className="w-10 text-center text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(line.id, line.quantity + 1)}
                      disabled={line.quantity >= line.product.stock}
                      className="flex h-10 w-10 items-center justify-center hover:bg-bone-100 disabled:opacity-40"
                      aria-label="Artir"
                    >
                      <Plus size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                  <p className="font-medium text-ink-900">
                    {formatPrice(line.product.price * line.quantity)}
                  </p>
                </div>
              </div>
            </article>
          ))}

          <div className="flex flex-col gap-3 border border-ink-900/8 bg-bone-100 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Tag size={16} strokeWidth={1.5} className="text-rose-600" />
              <input
                value={promoCodeInput}
                onChange={(event) => {
                  setPromoCodeInput(event.target.value);
                  setCouponFeedback(null);
                }}
                placeholder={`Indirim kodu (${DEFAULT_COUPON_CODE})`}
                className="w-full flex-1 bg-transparent text-sm outline-none placeholder:text-ink-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="self-start text-[10px] font-medium uppercase tracking-editorial text-ink-900 transition hover:text-rose-600 sm:self-auto"
              >
                Uygula
              </button>
              {couponCode && (
                <button
                  type="button"
                  onClick={() => {
                    removeCoupon();
                    setPromoCodeInput("");
                    setCouponFeedback("Kupon kaldirildi.");
                  }}
                  className="self-start text-[10px] font-medium uppercase tracking-editorial text-ink-700 transition hover:text-rose-600 sm:self-auto"
                >
                  Kaldir
                </button>
              )}
            </div>
          </div>

          {couponFeedback && (
            <p
              className={`px-1 text-[11px] tracking-wider ${
                couponCode ? "text-rose-600" : "text-ink-600"
              }`}
            >
              {couponFeedback}
            </p>
          )}

          <Link
            href="/products"
            className="inline-flex items-center gap-2 pt-2 text-[10px] uppercase tracking-editorial text-ink-700 transition hover:text-rose-600"
          >
            Alisverise devam et
          </Link>
        </div>

        <aside className="h-fit border border-ink-900/8 bg-white p-6 shadow-card md:p-8 lg:sticky lg:top-28">
          <p className="luxe-label plain text-rose-600">Siparis Ozeti</p>

          <div className="mt-6 space-y-3.5 text-sm">
            <SummaryRow label="Ara Toplam" value={formatPrice(summary.subtotal)} />
            <SummaryRow
              label="Kargo"
              value={summary.shipping === 0 ? "Ucretsiz" : formatPrice(summary.shipping)}
            />

            {summary.discount > 0 && (
              <SummaryRow
                label={`Indirim (${couponCode})`}
                value={`-${formatPrice(summary.discount)}`}
                accent
              />
            )}

            {summary.shipping > 0 && (
              <div className="mt-3 border-l-2 border-rose-600 bg-powder-50 p-4">
                <p className="text-[11px] font-medium tracking-wider text-ink-900">
                  Ucretsiz kargo icin
                </p>
                <p className="mt-1 text-xs text-ink-700">
                  {formatPrice(summary.remainingForFreeShipping)} daha ekleyin.
                </p>
                <div className="mt-2 h-1 overflow-hidden bg-ink-900/10">
                  <div
                    className="h-full bg-rose-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (summary.subtotal / FREE_SHIPPING_LIMIT) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-baseline justify-between border-t border-ink-900/10 pt-6">
            <span className="font-display text-xl text-ink-900">Toplam</span>
            <span className="font-display text-[32px] text-ink-900">
              {formatPrice(summary.total)}
            </span>
          </div>
          <p className="mt-1 text-right text-[11px] text-ink-600">
            KDV dahildir ({Math.round(summary.taxRate * 100)}% / {formatPrice(summary.includedTax)})
          </p>

          <Link
            href="/checkout"
            className="btn-luxe btn-luxe-dark mt-6 w-full shadow-soft"
          >
            Odemeye Gec <ArrowRight strokeWidth={1.5} size={14} />
          </Link>

          <div className="mt-7 space-y-3 border-t border-ink-900/8 pt-6 text-[12px] text-ink-700">
            <p className="flex items-center gap-2.5">
              <ShieldCheck size={14} strokeWidth={1.4} className="text-rose-600" />
              256-bit SSL ile guvenli odeme
            </p>
            <p className="flex items-center gap-2.5">
              <Truck size={14} strokeWidth={1.4} className="text-rose-600" />
              1-3 is gunu icinde teslimat
            </p>
            <p className="flex items-center gap-2.5">
              <RotateCcw size={14} strokeWidth={1.4} className="text-rose-600" />
              14 gun iade ve degisim destegi
            </p>
          </div>
        </aside>
      </Container>
    </>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-ink-700">{label}</span>
      <span className={accent ? "font-medium text-rose-600" : "font-medium text-ink-900"}>
        {value}
      </span>
    </div>
  );
}

function MiniTrust({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-editorial text-ink-700">
      <span className="text-rose-600">{icon}</span>
      {text}
    </div>
  );
}
