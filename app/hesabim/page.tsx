import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
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

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/giris?redirect=/hesabim");
  }

  const orders = await userService.getOrdersForUser(user.id).catch(() => []);

  return (
    <>
      <Breadcrumb items={[{ label: "Hesabım" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-16">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-editorial text-rose-600">
              Hoş geldiniz
            </p>
            <h1 className="mt-3 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[52px]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-3 text-sm text-ink-700">{user.email}</p>
          </div>
          <LogoutButton />
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <aside className="h-fit border border-ink-900/10 bg-white p-6 shadow-card">
            <p className="luxe-label plain text-rose-600">Hesap Bilgilerim</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-luxe text-ink-600">
                  Ad Soyad
                </dt>
                <dd className="mt-1 text-ink-900">
                  {user.firstName} {user.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-luxe text-ink-600">
                  E-posta
                </dt>
                <dd className="mt-1 text-ink-900">{user.email}</dd>
              </div>
              {user.phone && (
                <div>
                  <dt className="text-[11px] uppercase tracking-luxe text-ink-600">
                    Telefon
                  </dt>
                  <dd className="mt-1 text-ink-900">{user.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-[11px] uppercase tracking-luxe text-ink-600">
                  Üyelik Tarihi
                </dt>
                <dd className="mt-1 text-ink-900">
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </dd>
              </div>
            </dl>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-3xl text-ink-900">
                Siparişlerim
              </h2>
              <span className="text-xs text-ink-600">
                {orders.length} sipariş
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="border border-dashed border-ink-900/15 bg-bone-50 p-10 text-center">
                <Package
                  size={32}
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
              <div className="space-y-5">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="border border-ink-900/10 bg-white p-6 shadow-card"
                  >
                    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-900/8 pb-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-luxe text-ink-600">
                          Sipariş No
                        </p>
                        <p className="mt-1 font-medium text-ink-900">
                          {order.orderNumber}
                        </p>
                      </div>
                      <div className="text-right">
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
                        <span className="mt-1 inline-block rounded-full bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-700">
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>
                    </header>

                    <div className="mt-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-bone-100">
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
                          <p className="text-sm font-medium text-ink-900">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <footer className="mt-4 flex items-center justify-between border-t border-ink-900/8 pt-4">
                      <span className="text-xs text-ink-600">
                        {order.items.length} ürün
                      </span>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-luxe text-ink-600">
                          Toplam
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
          </div>
        </div>
      </Container>
    </>
  );
}
