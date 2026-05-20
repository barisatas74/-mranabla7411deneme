import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/lib/actions/auth";
import { userService } from "@/lib/services/server";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hesabım",
  description: "Miss Bella hesap özetiniz ve geçmiş siparişleriniz.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  beklemede: "Onay Bekliyor",
  hazirlaniyor: "Hazırlanıyor",
  "kargoya-verildi": "Kargoya Verildi",
  tamamlandi: "Teslim Edildi",
  "iptal-edildi": "İptal Edildi",
};

const STATUS_STYLES: Record<string, string> = {
  beklemede: "bg-amber-50 text-amber-700 ring-amber-200",
  hazirlaniyor: "bg-powder-100 text-rose-700 ring-rose-200",
  "kargoya-verildi": "bg-sky-50 text-sky-700 ring-sky-200",
  tamamlandi: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "iptal-edildi": "bg-ink-900/5 text-ink-700 ring-ink-900/10",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/giris?redirect=/hesabim");
  }

  const orders = await userService.getOrdersForUser(user.id).catch(() => []);
  const totalSpent = orders.reduce((total, order) => total + order.total, 0);
  const activeOrders = orders.filter(
    (order) => !["tamamlandi", "iptal-edildi"].includes(order.status)
  ).length;
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`
    .toLocaleUpperCase("tr")
    .trim();

  return (
    <>
      <Breadcrumb items={[{ label: "Hesabım" }]} />

      <section className="relative overflow-hidden border-b border-ink-900/8 bg-gradient-to-b from-powder-100 via-bone-50 to-bone-50 py-12 md:py-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
        <span className="pointer-events-none absolute right-8 top-2 hidden select-none font-italic-display text-[140px] leading-none text-rose-600/5 md:block">
          Bella
        </span>

        <Container className="relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/85 font-display text-3xl text-rose-600 shadow-card backdrop-blur">
                {initials || <UserRound size={28} strokeWidth={1.4} />}
              </div>
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-editorial text-rose-600">
                  <Sparkles size={12} strokeWidth={1.5} />
                  Hoş geldiniz
                </p>
                <h1 className="mt-3 font-display text-[42px] leading-[1.02] text-ink-900 md:text-[62px]">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="mt-3 text-sm text-ink-700">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="btn-luxe btn-luxe-dark shadow-soft"
              >
                Alışverişe Devam Et
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <HeroMetric
              icon={<ShoppingBag size={17} strokeWidth={1.5} />}
              label="Toplam Sipariş"
              value={String(orders.length)}
            />
            <HeroMetric
              icon={<Truck size={17} strokeWidth={1.5} />}
              label="Aktif Süreç"
              value={String(activeOrders)}
            />
            <HeroMetric
              icon={<ShieldCheck size={17} strokeWidth={1.5} />}
              label="Toplam Alışveriş"
              value={formatPrice(totalSpent)}
            />
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="h-fit border border-ink-900/10 bg-white p-6 shadow-card md:p-7 lg:sticky lg:top-28">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="luxe-label plain text-rose-600">
                  Hesap Bilgilerim
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">
                  Profil, adres ve sipariş bilgileriniz.
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <InfoRow
                label="Ad Soyad"
                value={`${user.firstName} ${user.lastName}`}
              />
              <InfoRow label="E-posta" value={user.email} />
              {user.phone && (
                <InfoRow label="Telefon" value={user.phone} />
              )}
              <InfoRow
                label="Üyelik Tarihi"
                value={new Date(user.createdAt).toLocaleDateString("tr-TR")}
              />
            </dl>

            <div className="mt-7 space-y-2 border-t border-ink-900/10 pt-5">
              <PanelLink
                href="/hesabim/adresler"
                icon={<MapPin size={15} strokeWidth={1.5} />}
                label="Adreslerim"
              />
              <PanelLink
                href="/favorilerim"
                icon={<Heart size={15} strokeWidth={1.5} />}
                label="Favorilerim"
              />
              <PanelLink
                href="/hesabim/duzenle"
                icon={<UserRound size={15} strokeWidth={1.5} />}
                label="Profil Ayarları"
              />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-editorial text-rose-600">
                  Sipariş Takibi
                </p>
                <h2 className="mt-2 font-display text-4xl leading-tight text-ink-900">
                  Siparişlerim
                </h2>
              </div>
              <span className="inline-flex w-fit items-center gap-2 border border-ink-900/10 bg-white px-3 py-2 text-xs text-ink-600 shadow-sm">
                <Package size={14} strokeWidth={1.5} className="text-rose-600" />
                {orders.length} sipariş
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="border border-dashed border-ink-900/15 bg-white p-10 text-center shadow-card">
                <Package
                  size={34}
                  strokeWidth={1.4}
                  className="mx-auto text-ink-700/50"
                />
                <p className="mt-4 font-display text-xl text-ink-900">
                  Henüz siparişiniz yok
                </p>
                <p className="mt-2 text-sm text-ink-700">
                  Koleksiyondan ilk seçimlerinizi yapın.
                </p>
                <Link href="/products" className="btn-luxe btn-luxe-dark mt-6">
                  Koleksiyona Git
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="overflow-hidden border border-ink-900/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-soft"
                  >
                    <header className="flex flex-wrap items-start justify-between gap-4 bg-gradient-to-r from-white via-powder-50 to-white px-5 py-5 md:px-7">
                      <div>
                        <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-ink-600">
                          <CalendarDays
                            size={13}
                            strokeWidth={1.5}
                            className="text-rose-600"
                          />
                          Sipariş No
                        </p>
                        <p className="mt-1 text-lg font-medium text-ink-900">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[11px] uppercase tracking-luxe text-ink-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "tr-TR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${
                            STATUS_STYLES[order.status] ??
                            "bg-rose-50 text-rose-700 ring-rose-200"
                          }`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>
                    </header>

                    <div className="space-y-3 px-5 py-5 md:px-7">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative h-[72px] w-16 flex-shrink-0 overflow-hidden bg-bone-100">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium text-ink-900">
                              {item.productName}
                            </p>
                            <p className="mt-0.5 text-[11px] text-ink-600">
                              {item.color && `${item.color} / `}
                              {item.size && `Beden ${item.size} / `}
                              {item.quantity} adet
                            </p>
                          </div>
                          <p className="whitespace-nowrap text-sm font-medium text-ink-900">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {order.trackingNumber && (
                      <div className="mx-5 mb-5 border border-rose-200 bg-rose-50/50 p-4 md:mx-7">
                        <p className="text-[10px] uppercase tracking-luxe text-rose-700">
                          Kargo Takibi
                        </p>
                        <p className="mt-1 text-sm text-ink-900">
                          {order.trackingCarrier && (
                            <span className="font-medium">
                              {order.trackingCarrier}
                            </span>
                          )}{" "}
                          <span className="font-mono text-xs">
                            {order.trackingNumber}
                          </span>
                        </p>
                        {order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs text-rose-600 underline-offset-2 hover:underline"
                          >
                            Kargomu Takip Et
                          </a>
                        )}
                      </div>
                    )}

                    <footer className="flex flex-col gap-4 border-t border-ink-900/8 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
                      <Link
                        href={`/hesabim/siparis/${order.orderNumber}`}
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe text-rose-600 underline-offset-2 hover:underline"
                      >
                        Detayları Gör <ArrowRight size={12} strokeWidth={1.5} />
                      </Link>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-luxe text-ink-600">
                          Toplam · {order.items.length} ürün
                        </p>
                        <p className="mt-1 font-display text-xl text-ink-900">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      </Container>
    </>
  );
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[92px] items-center gap-4 border border-white/70 bg-white/80 px-5 py-4 shadow-card backdrop-blur">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-luxe text-ink-600">
          {label}
        </p>
        <p className="mt-1 truncate font-display text-2xl text-ink-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-ink-900/8 pb-4 last:border-b-0 last:pb-0">
      <dt className="text-[11px] uppercase tracking-luxe text-ink-600">
        {label}
      </dt>
      <dd className="mt-1 break-words text-ink-900">{value}</dd>
    </div>
  );
}

function PanelLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 bg-bone-50 px-4 py-3 text-sm text-ink-900 transition hover:bg-powder-50 hover:text-rose-600"
    >
      <span className="inline-flex items-center gap-2">
        <span className="text-rose-600">{icon}</span>
        {label}
      </span>
      <ArrowRight size={13} strokeWidth={1.5} className="text-ink-500" />
    </Link>
  );
}
