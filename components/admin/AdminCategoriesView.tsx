"use client";

import { useMemo, useState } from "react";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import AdminTableCard from "@/components/admin/AdminTableCard";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import {
  useAdminConfirm,
  useAdminToast,
} from "@/components/admin/feedback/AdminFeedbackProvider";
import {
  AdminInputField,
  AdminSelectField,
  AdminTextAreaField,
} from "@/components/admin/forms/AdminFormFields";
import { getCategoryProductCount, slugify, validateCategoryForm } from "@/lib/admin";
import { categoryService } from "@/lib/services";
import { AdminCategory, AdminCategoryFormValues, AdminProduct } from "@/types";

function toFormValues(
  category?: AdminCategory,
  defaultSlug = "takimlar"
): AdminCategoryFormValues {
  return {
    name: category?.name ?? "",
    slug: category?.slug ?? defaultSlug,
    image: category?.image ?? "",
    tagline: category?.tagline ?? "",
    description: category?.description ?? "",
    status: category?.status ?? "active",
  };
}

export default function AdminCategoriesView({
  initialCategories,
  products,
}: {
  initialCategories: AdminCategory[];
  products: AdminProduct[];
}) {
  const toast = useAdminToast();
  const confirm = useAdminConfirm();
  const defaultSlug = initialCategories[0]?.slug ?? "takimlar";
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<AdminCategoryFormValues>(toFormValues(undefined, defaultSlug));
  const [errors, setErrors] = useState<
    Partial<Record<keyof AdminCategoryFormValues, string>>
  >({});
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      [category.name, category.slug, category.tagline]
        .join(" ")
        .toLocaleLowerCase("tr")
        .includes(query.trim().toLocaleLowerCase("tr"))
    );
  }, [categories, query]);

  function resetForm() {
    setEditingId(null);
    setValues(toFormValues(undefined, defaultSlug));
    setErrors({});
  }

  function handleEdit(category: AdminCategory) {
    setEditingId(category.id);
    setValues(toFormValues(category));
    setErrors({});
  }

  async function handleDelete(categoryId: string, categoryName: string) {
    const approved = await confirm({
      title: "Kategori silinsin mi?",
      description: `${categoryName} kategorisi mock yonetim listesinden kaldirilacak.`,
      confirmLabel: "Sil",
      cancelLabel: "Vazgec",
      tone: "danger",
    });

    if (!approved) {
      return;
    }

    const removed = await categoryService.remove(categoryId);

    if (!removed) {
      toast({
        title: "Kategori silinemedi",
        description: "Mock category service bu kaydi bulamadi.",
        variant: "error",
      });
      return;
    }

    setCategories((current) => current.filter((category) => category.id !== categoryId));
    if (editingId === categoryId) {
      resetForm();
    }
    toast({
      title: "Kategori silindi",
      description: `${categoryName} listeden kaldirildi.`,
      variant: "success",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCategoryForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (editingId) {
      const updatedCategory = await categoryService.update(editingId, values);

      if (!updatedCategory) {
        toast({
          title: "Kategori guncellenemedi",
          description: "Mock category service bu kaydi bulamadi.",
          variant: "error",
        });
        return;
      }

      setCategories((current) =>
        current.map((category) =>
          category.id === editingId ? updatedCategory : category
        )
      );
      toast({
        title: "Kategori guncellendi",
        description: `${values.name} category service uzerinden guncellendi.`,
        variant: "success",
      });
    } else {
      const createdCategory = await categoryService.create(values);
      setCategories((current) => [createdCategory, ...current]);
      toast({
        title: "Kategori eklendi",
        description: `${values.name} category service uzerinden eklendi.`,
        variant: "success",
      });
    }

    resetForm();
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Collections"
        title="Kategori yonetimi"
        description="Kategori ekleme, duzenleme ve silme akisleri ayni geri bildirim ve modal sistemi ile calisir."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <AdminTableCard
          title="Kategori listesi"
          description="Arama ile mock kategorileri hizli filtreleyin."
        >
          <div className="border-b border-slate-200 px-6 py-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Kategori ara"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
            />
          </div>
          {filteredCategories.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-950">{category.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {category.slug} / {getCategoryProductCount(category, products)} urun
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <AdminStatusBadge value={category.status} />
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="text-sm font-medium text-slate-950 transition hover:text-rose-600"
                    >
                      Duzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-sm font-medium text-slate-500 transition hover:text-rose-600"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <AdminEmptyState
                title="Kategori bulunamadi"
                description="Arama sorgusu hicbir kategori ile eslesmedi."
              />
            </div>
          )}
        </AdminTableCard>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-950">
            {editingId ? "Kategori duzenle" : "Yeni kategori"}
          </h2>
          <div className="mt-5 space-y-4">
            <AdminInputField
              label="Kategori adi"
              value={values.name}
              onChange={(value) =>
                setValues((current) => ({
                  ...current,
                  name: value,
                  slug: slugify(value),
                }))
              }
              error={errors.name}
            />
            <AdminInputField
              label="Slug"
              value={values.slug}
              onChange={(value) =>
                setValues((current) => ({ ...current, slug: slugify(value) }))
              }
              error={errors.slug}
            />
            <AdminInputField
              label="Gorsel URL"
              value={values.image}
              onChange={(value) => setValues((current) => ({ ...current, image: value }))}
              error={errors.image}
            />
            <AdminInputField
              label="Tagline"
              value={values.tagline}
              onChange={(value) =>
                setValues((current) => ({ ...current, tagline: value }))
              }
            />
            <AdminTextAreaField
              label="Aciklama"
              value={values.description}
              onChange={(value) =>
                setValues((current) => ({ ...current, description: value }))
              }
              error={errors.description}
            />
            <AdminSelectField
              label="Durum"
              value={values.status}
              onChange={(value) =>
                setValues((current) => ({
                  ...current,
                  status: value as AdminCategoryFormValues["status"],
                }))
              }
              options={[
                { label: "Aktif", value: "active" },
                { label: "Pasif", value: "passive" },
              ]}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {editingId ? "Guncelle" : "Ekle"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-950"
            >
              Temizle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
