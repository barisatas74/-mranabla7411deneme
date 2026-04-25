import Link from "next/link";
import { AlertTriangle, Package, ShoppingCart, Wallet } from "lucide-react";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTableCard from "@/components/admin/AdminTableCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { formatAdminDate } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { AdminDashboardData } from "@/types";

export default function AdminDashboardView({
  data,
}: {
  data: AdminDashboardData;
}) {
  const { metrics, recentOrders, lowStockProducts } = data;
  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Overview"
        title="Magazanin bugunku ozeti"
        description="Siparisler, urun stogu ve toplam ciro tek ekranda. Ayrik admin tasarimi ile operasyon akislarini storefront'tan bagimsiz yonetebilirsiniz."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="Toplam Urun" value={metrics.totalProducts} icon={Package} />
        <AdminStatCard
          title="Toplam Siparis"
          value={metrics.totalOrders}
          icon={ShoppingCart}
          accent="rose"
        />
        <AdminStatCard
          title="Bekleyen Siparis"
          value={metrics.pendingOrders}
          icon={AlertTriangle}
          accent="amber"
        />
        <AdminStatCard
          title="Toplam Ciro"
          value={metrics.totalRevenue}
          icon={Wallet}
          isCurrency
          accent="emerald"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,1fr)]">
        <AdminTableCard
          title="Son Siparisler"
          description="Siparislerin son durumu ve detay ekranina hizli gecis."
        >
          {recentOrders.length > 0 ? (
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.25em] text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Siparis</th>
                  <th className="px-6 py-4 font-medium">Musteri</th>
                  <th className="px-6 py-4 font-medium">Durum</th>
                  <th className="px-6 py-4 font-medium">Toplam</th>
                  <th className="px-6 py-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 text-sm last:border-b-0">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-950">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatAdminDate(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <AdminStatusBadge value={order.status} />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-950">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-slate-950 transition hover:text-rose-600"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6">
              <AdminEmptyState
                title="Siparis bulunamadi"
                description="Mock veri kaynaginda gosterilecek siparis bulunmuyor."
              />
            </div>
          )}
        </AdminTableCard>

        <AdminTableCard
          title="Dusuk Stok"
          description="Stok seviyesi azalan urunler. Tedarik veya pasiflestirme karari icin hizli liste."
        >
          {lowStockProducts.length > 0 ? (
            <div className="space-y-0">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-slate-950">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-rose-600">{product.stock} adet</p>
                    <p className="mt-1 text-xs text-slate-500">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <AdminEmptyState
                title="Dusuk stok yok"
                description="Tum aktif urunler guvenli stok seviyesinde gorunuyor."
              />
            </div>
          )}
        </AdminTableCard>
      </div>
    </div>
  );
}
