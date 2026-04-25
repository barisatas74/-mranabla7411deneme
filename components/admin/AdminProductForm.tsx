"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import AdminSectionHeader from "@/components/admin/AdminSectionHeader";
import {
  AdminCheckboxField,
  AdminInputField,
  AdminSelectField,
  AdminTextAreaField,
} from "@/components/admin/forms/AdminFormFields";
import { useAdminToast } from "@/components/admin/feedback/AdminFeedbackProvider";
import { useUnsavedChangesWarning } from "@/components/admin/hooks/useUnsavedChangesWarning";
import { slugify, validateProductForm } from "@/lib/admin";
import { productService } from "@/lib/services";
import { AdminCategory, AdminProduct, AdminProductFormValues } from "@/types";

function getInitialValues(
  product?: AdminProduct,
  defaultCategory: AdminProductFormValues["category"] = "takimlar"
): AdminProductFormValues {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? defaultCategory,
    price: product ? String(product.price) : "",
    oldPrice: product?.oldPrice ? String(product.oldPrice) : "",
    description: product?.description ?? "",
    images: product?.images ?? [],
    colors: product?.colors ?? [],
    sizes: product?.sizes ?? [],
    stock: product ? String(product.stock) : "",
    isFeatured: Boolean(product?.isFeatured),
    isNew: Boolean(product?.isNew),
    status: product?.status ?? "active",
  };
}

export default function AdminProductForm({
  product,
  categories,
}: {
  product?: AdminProduct;
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const toast = useAdminToast();
  const defaultCategory =
    (categories[0]?.slug as AdminProductFormValues["category"] | undefined) ??
    "takimlar";
  const [values, setValues] = useState<AdminProductFormValues>(
    getInitialValues(product, defaultCategory)
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof AdminProductFormValues, string>>
  >({});
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved">("idle");
  const [imageDraft, setImageDraft] = useState("");
  const [sizeDraft, setSizeDraft] = useState("");
  const [colorNameDraft, setColorNameDraft] = useState("");
  const [colorHexDraft, setColorHexDraft] = useState("#0f172a");
  const mode = product ? "edit" : "create";
  const initialSerializedRef = useRef(
    JSON.stringify(getInitialValues(product, defaultCategory))
  );
  const isDirty = JSON.stringify(values) !== initialSerializedRef.current;
  const confirmDiscard = useUnsavedChangesWarning(isDirty);

  const heroImage = values.images[0];

  const metrics = useMemo(
    () => ({
      imageCount: values.images.length,
      colorCount: values.colors.length,
      sizeCount: values.sizes.length,
    }),
    [values.colors.length, values.images.length, values.sizes.length]
  );

  function update<K extends keyof AdminProductFormValues>(
    key: K,
    value: AdminProductFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitState("idle");
  }

  function handleBack() {
    if (confirmDiscard()) {
      router.back();
    }
  }

  function handleCancel() {
    if (confirmDiscard()) {
      router.push("/admin/products");
    }
  }

  function addImage() {
    const nextUrl = imageDraft.trim();

    if (!/^https?:\/\//.test(nextUrl)) {
      setErrors((current) => ({
        ...current,
        images: "Gecerli bir gorsel URL girin.",
      }));
      return;
    }

    update("images", [...values.images, nextUrl]);
    setImageDraft("");
  }

  function removeImage(index: number) {
    update(
      "images",
      values.images.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  function addSize() {
    const nextSize = sizeDraft.trim().toUpperCase();

    if (!nextSize) {
      return;
    }

    if (values.sizes.includes(nextSize)) {
      setErrors((current) => ({
        ...current,
        sizes: "Bu beden zaten listede bulunuyor.",
      }));
      return;
    }

    update("sizes", [...values.sizes, nextSize]);
    setSizeDraft("");
  }

  function removeSize(size: string) {
    update(
      "sizes",
      values.sizes.filter((currentSize) => currentSize !== size)
    );
  }

  function addColor() {
    const nextName = colorNameDraft.trim();

    if (!nextName) {
      setErrors((current) => ({
        ...current,
        colors: "Renk adi zorunludur.",
      }));
      return;
    }

    if (values.colors.some((color) => color.name === nextName)) {
      setErrors((current) => ({
        ...current,
        colors: "Bu renk zaten eklenmis.",
      }));
      return;
    }

    update("colors", [...values.colors, { name: nextName, hex: colorHexDraft }]);
    setColorNameDraft("");
    setColorHexDraft("#0f172a");
  }

  function removeColor(name: string) {
    update(
      "colors",
      values.colors.filter((color) => color.name !== name)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitState("saving");
    const payload = {
      name: values.name,
      slug: values.slug,
      category: values.category,
      price: Number(values.price),
      oldPrice: values.oldPrice ? Number(values.oldPrice) : undefined,
      description: values.description,
      images: values.images,
      colors: values.colors,
      sizes: values.sizes,
      stock: Number(values.stock),
      isFeatured: values.isFeatured,
      isNew: values.isNew,
      status: values.status,
    };

    const savedProduct = product
      ? await productService.update(product.id, payload)
      : await productService.create(payload);

    if (!savedProduct) {
      setSubmitState("idle");
      toast({
        title: "Kayit basarisiz",
        description: "Urun kaydi service katmaninda tamamlanamadi.",
        variant: "error",
      });
      return;
    }

    const nextValues = getInitialValues(savedProduct, defaultCategory);
    setValues(nextValues);
    initialSerializedRef.current = JSON.stringify(nextValues);
    setSubmitState("saved");
    toast({
      title: mode === "edit" ? "Urun guncellendi" : "Urun olusturuldu",
      description:
        mode === "edit"
          ? "Degisiklikler mock product service uzerinden kaydedildi."
          : "Yeni urun mock product service uzerinden olusturuldu.",
      variant: "success",
    });
  }

  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow={mode === "edit" ? "Edit" : "Create"}
        title={mode === "edit" ? "Urun duzenle" : "Yeni urun olustur"}
        description="Gorsel onizleme, chip tabanli beden ve renk yonetimi ile daha profesyonel bir katalog formu."
        action={
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-950"
          >
            Listeye Don
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Temel bilgiler</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <AdminInputField
                label="Urun adi"
                value={values.name}
                onChange={(value) => {
                  update("name", value);
                  if (!product) {
                    update("slug", slugify(value));
                  }
                }}
                error={errors.name}
              />
              <AdminInputField
                label="Slug"
                value={values.slug}
                onChange={(value) => update("slug", slugify(value))}
                error={errors.slug}
              />
              <AdminSelectField
                label="Kategori"
                value={values.category}
                onChange={(value) =>
                  update("category", value as AdminProductFormValues["category"])
                }
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.slug,
                }))}
              />
              <AdminSelectField
                label="Durum"
                value={values.status}
                onChange={(value) =>
                  update("status", value as AdminProductFormValues["status"])
                }
                options={[
                  { label: "Aktif", value: "active" },
                  { label: "Pasif", value: "passive" },
                ]}
              />
              <AdminInputField
                label="Fiyat"
                value={values.price}
                onChange={(value) => update("price", value)}
                error={errors.price}
              />
              <AdminInputField
                label="Indirimli fiyat"
                value={values.oldPrice}
                onChange={(value) => update("oldPrice", value)}
                error={errors.oldPrice}
              />
              <AdminInputField
                label="Stok"
                value={values.stock}
                onChange={(value) => update("stock", value)}
                error={errors.stock}
              />
              <div className="grid grid-cols-2 gap-3">
                <AdminCheckboxField
                  label="One cikan urun"
                  checked={values.isFeatured}
                  onChange={(checked) => update("isFeatured", checked)}
                />
                <AdminCheckboxField
                  label="Yeni sezon"
                  checked={values.isNew}
                  onChange={(checked) => update("isNew", checked)}
                />
              </div>
              <AdminTextAreaField
                className="md:col-span-2"
                label="Aciklama"
                value={values.description}
                onChange={(value) => update("description", value)}
                error={errors.description}
                rows={6}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Gorseller</h2>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <AdminInputField
                className="flex-1"
                label="Gorsel URL"
                value={imageDraft}
                onChange={setImageDraft}
                placeholder="https://..."
                error={errors.images}
              />
              <button
                type="button"
                onClick={addImage}
                className="mt-7 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Plus size={16} />
                Gorsel Ekle
              </button>
            </div>

            {values.images.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {values.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50"
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={image}
                        alt={`Urun gorseli ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 240px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <p className="truncate text-xs text-slate-500">{image}</p>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-rose-600"
                        aria-label="Gorseli sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyHint text="Henuz gorsel eklenmedi." />
            )}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Renkler</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px_auto]">
                  <AdminInputField
                    label="Renk adi"
                    value={colorNameDraft}
                    onChange={setColorNameDraft}
                    error={errors.colors}
                    placeholder="Pudra"
                  />
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Renk</span>
                    <input
                      type="color"
                      value={colorHexDraft}
                      onChange={(event) => setColorHexDraft(event.target.value)}
                      className="mt-2 h-[50px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-2"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={addColor}
                    className="mt-7 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <Plus size={16} />
                    Ekle
                  </button>
                </div>

                {values.colors.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {values.colors.map((color) => (
                      <div
                        key={color.name}
                        className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm text-slate-700">{color.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(color.name)}
                          className="text-slate-400 transition hover:text-rose-600"
                          aria-label={`${color.name} rengini sil`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyHint text="Henuz renk eklenmedi." />
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-950">Bedenler</h2>
                <div className="mt-4 flex gap-3">
                  <AdminInputField
                    className="flex-1"
                    label="Beden"
                    value={sizeDraft}
                    onChange={setSizeDraft}
                    error={errors.sizes}
                    placeholder="M"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="mt-7 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <Plus size={16} />
                    Ekle
                  </button>
                </div>

                {values.sizes.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {values.sizes.map((size) => (
                      <div
                        key={size}
                        className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
                      >
                        <span className="text-sm font-medium text-slate-700">{size}</span>
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-slate-400 transition hover:text-rose-600"
                          aria-label={`${size} bedenini sil`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyHint text="Henuz beden eklenmedi." />
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Canli onizleme</h2>
            <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white">
              <div className="relative aspect-[4/5] bg-slate-900">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={values.name || "Urun onizleme"}
                    fill
                    sizes="(max-width: 1280px) 100vw, 360px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Gorsel eklendiginde onizleme burada gorunur
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {values.category}
                  </p>
                  <p className="mt-3 text-2xl font-semibold">
                    {values.name || "Urun adi burada gorunecek"}
                  </p>
                </div>
                <p className="text-sm leading-7 text-slate-300">
                  {values.description || "Aciklama onizlemesi"}
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <PreviewMetric label="Gorsel" value={metrics.imageCount} />
                  <PreviewMetric label="Renk" value={metrics.colorCount} />
                  <PreviewMetric label="Beden" value={metrics.sizeCount} />
                </div>
              </div>
            </div>
            {submitState === "saved" && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Kayit islemi mock ortamda basariyla tamamlandi.
              </p>
            )}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Aksiyonlar</h2>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {submitState === "saving"
                  ? "Kaydediliyor..."
                  : mode === "edit"
                    ? "Degisiklikleri Kaydet"
                    : "Urunu Olustur"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-950"
              >
                Vazgec
              </button>
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Kaydedilmemis degisiklikler varken cikmaya calisirsaniz sistem sizden onay ister.
            </p>
          </section>
        </div>
      </form>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
      {text}
    </div>
  );
}

function PreviewMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[20px] bg-white/5 px-3 py-4">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
