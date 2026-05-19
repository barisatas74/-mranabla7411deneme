"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "@/lib/actions/addresses";
import { UserAddress, UserAddressInput } from "@/types";
import AddressForm from "./AddressForm";

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: UserAddress[];
}) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddress[]>(initialAddresses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(initialAddresses.length === 0);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCreate(input: UserAddressInput) {
    setFeedback(null);
    startTransition(async () => {
      const result = await createAddressAction(input);
      if (!result.ok || !result.data) {
        setFeedback(result.message ?? "Eklenemedi.");
        return;
      }
      setAddresses((prev) => {
        const cleaned = result.data!.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [result.data!, ...cleaned];
      });
      setCreating(false);
      router.refresh();
    });
  }

  function handleUpdate(id: string, input: UserAddressInput) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateAddressAction(id, input);
      if (!result.ok || !result.data) {
        setFeedback(result.message ?? "Güncellenemedi.");
        return;
      }
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === id) return result.data!;
          if (result.data!.isDefault) return { ...a, isDefault: false };
          return a;
        })
      );
      setEditingId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await deleteAddressAction(id);
      if (!result.ok) {
        setFeedback(result.message ?? "Silinemedi.");
        return;
      }
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    });
  }

  function handleSetDefault(id: string) {
    setFeedback(null);
    startTransition(async () => {
      const result = await setDefaultAddressAction(id);
      if (!result.ok) {
        setFeedback(result.message ?? "Ayarlanamadı.");
        return;
      }
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      {feedback && (
        <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {feedback}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((addr) =>
          editingId === addr.id ? (
            <div
              key={addr.id}
              className="border border-ink-900/15 bg-white p-6 shadow-card md:col-span-2"
            >
              <h3 className="mb-4 font-display text-xl text-ink-900">
                Adresi Düzenle
              </h3>
              <AddressForm
                initial={addr}
                pending={pending}
                onSubmit={(input) => handleUpdate(addr.id, input)}
                onCancel={() => setEditingId(null)}
                submitLabel="Güncelle"
              />
            </div>
          ) : (
            <article
              key={addr.id}
              className="flex flex-col border border-ink-900/10 bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={16}
                    strokeWidth={1.5}
                    className="text-rose-600"
                  />
                  <h3 className="font-display text-lg text-ink-900">
                    {addr.label}
                  </h3>
                </div>
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
                    <Star size={10} fill="currentColor" /> Varsayılan
                  </span>
                )}
              </div>

              <div className="mt-3 flex-1 space-y-1 text-sm text-ink-700">
                <p className="font-medium text-ink-900">{addr.fullName}</p>
                <p>{addr.phone}</p>
                <p className="text-ink-600">{addr.address}</p>
                <p className="text-[12px] text-ink-600">
                  {addr.district} / {addr.city}
                  {addr.postalCode ? ` · ${addr.postalCode}` : ""}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-900/8 pt-3">
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={pending}
                    className="text-[11px] uppercase tracking-luxe text-rose-600 underline-offset-2 hover:underline disabled:opacity-50"
                  >
                    Varsayılan Yap
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEditingId(addr.id)}
                  disabled={pending}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe text-ink-700 hover:text-rose-600 disabled:opacity-50"
                >
                  <Pencil size={12} /> Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  disabled={pending}
                  className="inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe text-ink-700 hover:text-rose-700 disabled:opacity-50"
                >
                  <Trash2 size={12} /> Sil
                </button>
              </div>
            </article>
          )
        )}
      </div>

      {creating ? (
        <div className="border border-ink-900/15 bg-white p-6 shadow-card">
          <h3 className="mb-4 font-display text-xl text-ink-900">
            Yeni Adres Ekle
          </h3>
          <AddressForm
            pending={pending}
            onSubmit={handleCreate}
            onCancel={
              addresses.length > 0 ? () => setCreating(false) : undefined
            }
            submitLabel="Adresi Kaydet"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 border border-dashed border-ink-900/30 bg-bone-50 px-5 py-3 text-sm uppercase tracking-luxe text-ink-900 transition hover:border-rose-500 hover:text-rose-600"
        >
          <Plus size={16} strokeWidth={1.5} /> Yeni Adres Ekle
        </button>
      )}
    </div>
  );
}
