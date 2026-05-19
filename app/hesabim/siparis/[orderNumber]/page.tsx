import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CreditCard,
  ExternalLink,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import { getCurrentUser } from "@/lib/actions/auth";
import { userService } from "@/lib/services/server";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/types";

export const metadata: Metadata = {
  title: "Sipariş Detayı",
  description: "Sipariş detayınızı görüntüleyin.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<OrderStatus, string> = {
  beklemede: "Onay Bekliyor",
  hazirlaniyor: "Hazırlanıyor",
  "kargoya-verildi": "Kargoya Verildi",
  tamamlandi: "Teslim Edildi",
  "iptal-edildi": "İptal Edildi",
};

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  bekleniyor: "Ödeme Bekleniyor",
  odendi: "Ödendi",
  "iade-edildi": "İade Edildi",
};

// Sipariş zaman çizgisi adımları (iptal hariç normal akış)
const TIMELINE_STEPS: { key: OrderStatus; label: string; icon: typeof Check }[] = [
  { key: "beklemede", label: "Sipariş Alındı", icon: Check },
  { key: "hazirlaniyor", label: "Hazırlanıyor", icon: Package },
  { key: "kargoya-verildi", label: "Kargoda", icon: Truck },
  { key: "tamamlandi", label: "Teslim Edildi", icon: Check },
];

function getStepIndex(status: OrderStatus): number {
  return TIMELINE_STEPS.findIndex((s) => s.key === status);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/giris?redirect=/hesabim/siparis/${orderNumber}`);
  }

  const order = await userService.getOrderForUserByNumber(user.id, orderNumber);
  if (!order) notFound();

  const isCancelled = order.status === "iptal-edildi";
  const currentStepIdx = getStepIndex(order.status);
  const orderDate = new Date(order.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Hesabım", href: "/hesabim" },
          { label: `Sipariş #${order.orderNumber}` },
        ]}
      />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-10 md:py-14">
        <Container>
          <Link
            href="/hesabim"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-luxe text-rose-600 hover:text-rose-700"
          >
            <ArrowLeft size={12} /> Siparişlerime Dön
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-editorial text-rose-600">
                Sipariş Detayı
              </p>
              <h1 className="mt-2 font-display text-[32px] leading-tight text-ink-900 md:text-[44px]">
                #{order.orderNumber}
              </h1>
              <p className="mt-2 text-sm text-ink-700">{orderDate}</p>
            </div>
            <div className="text-right">
              <span
                className={
                  isCancelled
                    ? "inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
                    : "inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
                }
              >
                {STATUS_LABEL[order.status]}
              </span>
              <p className="mt-2 text-[11px] uppercase tracking-luxe text-ink-600">
                {PAYMENT_LABEL[order.paymentStatus]}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        {/* ZAMAN ÇİZGİSİ */}
        {!isCancelled && (
          <section className="mb-10 border border-ink-900/10 bg-white p-6 shadow-card md:p-8">
            <p className="luxe-label plain text-rose-600">Sipariş Durumu</p>
            <div className="mt-6">
              <ol className="relative grid grid-cols-4 gap-2">
                {TIMELINE_STEPS.map((step, idx) => {
                  const done = idx <= currentStepIdx;
                  const Icon = step.icon;
                  return (
                    <li key={step.key} className="relative flex flex-col items-center">
                      {idx > 0 && (
                        <span
                          className={
                            "absolute right-1/2 top-5 -z-0 h-0.5 w-full " +
                            (idx <= currentStepIdx
                              ? "bg-rose-500"
                              : "bg-ink-900/10")
                          }
                        />
                      )}
                      <span
                        className={
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-full ring-2 " +
                          (done
                            ? "bg-rose-500 text-white ring-rose-500"
                            : "bg-white text-ink-700/40 ring-ink-900/10")
                        }
                      >
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      <p
                        className={
                          "mt-2 text-center text-[11px] uppercase tracking-luxe " +
                          (done ? "text-ink-900" : "text-ink-600")
                        }
                      >
                        {step.label}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}

        {isCancelled && (
          <section className="mb-10 border border-rose-200 bg-rose-50/60 p-6 text-sm text-rose-800">
            Bu sipariş iptal edilmiş. Ödeme yapıldıysa iade süreci 5-10 iş günü
            içinde tamamlanır.
          </section>
        )}

        {/* KARGO TAKİBİ — varsa büyük göster */}
        {order.trackingNumber && (
          <section className="mb-10 border border-rose-300 bg-gradient-to-r from-powder-100 to-rose-50 p-6 shadow-card md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-rose-700">
                  <Truck size={14} strokeWidth={1.5} /> Kargo Takibi
                </p>
                <p className="mt-2 font-display text-2xl text-ink-900">
                  {order.trackingCarrier ?? "Kargo"}
                </p>
                <p className="mt-1 font-mono text-sm text-ink-700">
                  Takip No: <span className="font-medium text-ink-900">{order.trackingNumber}</span>
                </p>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxe btn-luxe-dark inline-flex items-center gap-2"
                >
                  Kargomu Takip Et <ExternalLink size={14} />
                </a>
              )}
            </div>
          </section>
        )}

        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          {/* SOL — KALEMLER */}
          <section className="border border-ink-900/10 bg-white p-6 shadow-card md:p-8">
            <p className="luxe-label plain text-rose-600">
              Ürünler ({order.items.length})
            </p>
            <div className="mt-5 divide-y divide-ink-900/8">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-bone-100"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover transition group-hover:scale-105"
                      />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="line-clamp-2 text-sm font-medium text-ink-900 hover:text-rose-600"
                    >
                      {item.productName}
                    </Link>
                    <p className="mt-1 text-[12px] text-ink-600">
                      {item.color && `${item.color} · `}
                      {item.size && `Beden ${item.size} · `}
                      {item.quantity} adet
                    </p>
                    <p className="mt-2 text-[12px] text-ink-700">
                      Birim: {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-base text-ink-900">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-ink-900/8 pt-5 text-sm">
              <Row label="Ara Toplam" value={formatPrice(order.subtotal)} />
              <Row label="Kargo" value={order.shippingFee === 0 ? "Ücretsiz" : formatPrice(order.shippingFee)} />
              {order.discount > 0 && (
                <Row
                  label="İndirim"
                  value={`-${formatPrice(order.discount)}`}
                  tone="rose"
                />
              )}
              <div className="flex items-center justify-between border-t border-ink-900/8 pt-3">
                <span className="text-[11px] uppercase tracking-luxe text-ink-700">
                  Toplam
                </span>
                <span className="font-display text-2xl text-ink-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {order.note && (
              <div className="mt-5 border-t border-ink-900/8 pt-5">
                <p className="text-[11px] uppercase tracking-luxe text-ink-700">
                  Sipariş Notu
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink-700">
                  {order.note}
                </p>
              </div>
            )}
          </section>

          {/* SAĞ — ADRES + ÖDEME + YARDIM */}
          <aside className="space-y-5">
            <div className="border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-rose-600">
                <MapPin size={12} /> Teslimat Adresi
              </p>
              <div className="mt-3 space-y-1 text-sm text-ink-800">
                <p className="font-medium text-ink-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-[12px] text-ink-700">
                  <Phone size={11} className="mr-1 inline" />
                  {order.customer.phone}
                </p>
                <p className="text-[12px] text-ink-700">{order.customer.email}</p>
                <div className="mt-2 text-[13px] text-ink-700">
                  <p>{order.customer.address}</p>
                  <p className="mt-1 text-ink-600">
                    {order.customer.district} / {order.customer.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-ink-900/10 bg-white p-5 shadow-card">
              <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-rose-600">
                <CreditCard size={12} /> Ödeme
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-ink-800">
                  {PAYMENT_LABEL[order.paymentStatus]}
                </p>
              </div>
            </div>

            <div className="border border-ink-900/10 bg-bone-50 p-5">
              <p className="text-[11px] uppercase tracking-luxe text-ink-700">
                Yardım Lazım mı?
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
                Sipariş hakkında sorularınız için bize ulaşın.
              </p>
              <Link
                href="/iletisim"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-luxe text-rose-600 hover:text-rose-700"
              >
                <MessageCircle size={12} /> İletişime Geç →
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "rose";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-700">{label}</span>
      <span className={tone === "rose" ? "text-rose-700" : "text-ink-900"}>
        {value}
      </span>
    </div>
  );
}
