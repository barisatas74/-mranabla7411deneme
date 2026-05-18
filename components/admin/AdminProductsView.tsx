"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Trash2 } from "lucide-react";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminTableCard from "@/components/admin/AdminTableCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import {
  useAdminConfirm,
  useAdminToast,
} from "@/components/admin/feedback/AdminFeedbackProvider";
import { getStockState } from "@/lib/admin";
import { deleteProductAction } from "@/lib/actions/admin";
import { deleteUploadedImages } from "@/lib/upload-client";
import { formatPrice } from "@/lib/utils";
import { AdminProduct } from "@/types";

type StockFilter = "all" | "in" | "low" | "out";

export default function AdminProductsView({
  initialProducts,
}: {
  initialProducts: AdminProduct[];
}) {
  const toast = useAdminToast();
  const confirm = useAdminConfirm();
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "passive">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const categories = useMemo(
    () => Array.from(new Set(initialProducts.map((product) => product.category))),
    [initialProducts]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = [product.name, product.sku, product.slug]
        .join(" ")
        .toLocaleLowerCase("tr")
        .includes(query.trim().toLocaleLowerCase("tr"));
      const matchesStatus =
        statusFilter === "all" ? true : product.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" ? true : product.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ? true : getStockState(product.stock) === stockFilter;

      return matchesQuery && matchesStatus && matchesCategory && matchesStock;
    });
  }, [categoryFilter, products, query, statusFilter, stockFilter]);

  async function handleDelete(productId: string, productName: string) {
    const approved = await confirm({
      title: "Ürün silinsin mi?",
      description: `${productName} ürün listesinden kaldırılacak. Bu işlem geri alınamaz.`,
      confirmLabel: "Sil",
      cancelLabel: "Vazgeç",
      tone: "danger",
    });

    if (!approved) {
      return;
    }

    const productToRemove = products.find((product) => product.id === productId);
    const removed = await deleteProductAction(productId);

    if (!removed) {
      toast({
        title: "Ürün silinemedi",
        description: "İlgili ürün bulunamadı.",
        variant: "error",
      });
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== productId));

    // Sunucudan da gorselleri sil (best-effort)
    if (productToRemove?.images?.length) {
      void deleteUploadedImages(productToRemove.images);
    }

    toast({
      title: "Ürün silindi",
      description: `${productName} kaldırıldı.`,
      variant: "success",
    });
  }

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setStockFilter("all");
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Catalog"
        title="Ürün yönetimi"
        description="Arama, kategori, aktif/pasif ve stok filtreleriyle katalogu profesyonel bir operasyon paneli gibi yonetin."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={16} />
            Yeni Ürün
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_180px_220px_200px]">
        <label className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün, SKU veya slug ara"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm"
        >
          <option value="all">Tüm kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | "active" | "passive")
          }
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm"
        >
          <option value="all">Tüm durumlar</option>
          <option value="active">Aktif</option>
          <option value="passive">Pasif</option>
        </select>
        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value as StockFilter)}
          className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm"
        >
          <option value="all">Tüm stoklar</option>
          <option value="in">Stokta</option>
          <option value="low">Düşük stok</option>
          <option value="out">Tükendi</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{filteredProducts.length} ürün gosteriliyor</p>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
        >
          Filtreleri Temizle
        </button>
      </div>

      <AdminTableCard
        title="Ürün listesi"
        description="Arama ve filtrelerle hızlı katalog yönetimi."
      >
        {filteredProducts.length > 0 ? (
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.25em] text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Ürün</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Fiyat</th>
                <th className="px-6 py-4 font-medium">Stok</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockState = getStockState(product.stock);

                return (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 text-sm last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-12 overflow-hidden rounded-2xl bg-slate-100">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-950">{product.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {product.sku} / {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{product.category}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-950">{formatPrice(product.price)}</p>
                      {product.oldPrice && (
                        <p className="mt-1 text-xs text-slate-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-950">{product.stock} adet</p>
                        <AdminStatusBadge
                          value={stockState}
                          label={
                            stockState === "in"
                              ? "stokta"
                              : stockState === "low"
                                ? "düşük stok"
                                : "stok yok"
                          }
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminStatusBadge value={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm font-medium text-slate-950 transition hover:text-rose-600"
                        >
                          Düzenle
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                          aria-label="Ürün sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-6">
            <AdminEmptyState
              title="Filtreye uygun ürün yok"
              description="Arama veya seçili filtreler ürün listesinde eşleşmedi. Filtreleri temizleyip tekrar deneyin."
              actionLabel="Yeni Ürün Ekle"
              actionHref="/admin/products/new"
            />
          </div>
        )}
      </AdminTableCard>
    </div>
  );
}
