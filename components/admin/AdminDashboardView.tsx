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
        title="Mağazanın bugünkü özeti"
        description="Siparişler, ürün stoğu ve toplam ciro tek ekranda. Operasyonlarınızı mağaza ön yüzünden bağımsız yönetin."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard title="Toplam Ürün" value={metrics.totalProducts} icon={Package} />
        <AdminStatCard
          title="Toplam Sipariş"
          value={metrics.totalOrders}
          icon={ShoppingCart}
          accent="rose"
        />
        <AdminStatCard
          title="Bekleyen Sipariş"
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
          title="Son Siparişler"
          description="Siparislerin son durumu ve detay ekranina hızlı geçiş."
        >
          {recentOrders.length > 0 ? (
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.25em] text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Sipariş</th>
                  <th className="px-6 py-4 font-medium">Müşteri</th>
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
                title="Sipariş bulunamadi"
                description="Mock veri kaynaginda gosterilecek sipariş bulunmuyor."
              />
            </div>
          )}
        </AdminTableCard>

        <AdminTableCard
          title="Düşük Stok"
          description="Stok seviyesi azalan ürünler. Tedarik veya pasiflestirme karari için hızlı liste."
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
                title="Düşük stok yok"
                description="Tüm aktif ürünler güvenli stok seviyesinde görünüyor."
              />
            </div>
          )}
        </AdminTableCard>
      </div>
    </div>
  );
}
