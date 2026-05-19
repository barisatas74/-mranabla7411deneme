"use client";

import { useState, type FormEvent } from "react";
import { UserAddress, UserAddressInput } from "@/types";
import { formatPhone, formatPostalCode } from "@/lib/validation";

export default function AddressForm({
  initial,
  pending,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial?: UserAddress;
  pending: boolean;
  onSubmit: (input: UserAddressInput) => void;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<UserAddressInput>({
    label: initial?.label ?? "",
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    city: initial?.city ?? "",
    district: initial?.district ?? "",
    address: initial?.address ?? "",
    postalCode: initial?.postalCode ?? "",
    isDefault: initial?.isDefault ?? false,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  function update<K extends keyof UserAddressInput>(
    key: K,
    value: UserAddressInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Etiket"
          value={form.label}
          onChange={(v) => update("label", v)}
          placeholder="Örn: Ev, İş, Anne Evi"
          required
        />
        <Field
          label="Alıcı Adı Soyadı"
          value={form.fullName}
          onChange={(v) => update("fullName", v)}
          autoComplete="name"
          required
        />
      </div>

      <Field
        label="Telefon"
        type="tel"
        value={form.phone}
        onChange={(v) => update("phone", formatPhone(v))}
        autoComplete="tel"
        placeholder="+90 5__ ___ __ __"
        required
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="Şehir"
          value={form.city}
          onChange={(v) => update("city", v)}
          autoComplete="address-level1"
          required
        />
        <Field
          label="İlçe"
          value={form.district}
          onChange={(v) => update("district", v)}
          autoComplete="address-level2"
          required
        />
        <Field
          label="Posta Kodu"
          value={form.postalCode ?? ""}
          onChange={(v) => update("postalCode", formatPostalCode(v))}
          autoComplete="postal-code"
          placeholder="34000"
        />
      </div>

      <label className="block">
        <span className="text-[11px] uppercase tracking-luxe text-ink-700">
          Açık Adres
        </span>
        <textarea
          value={form.address}
          onChange={(event) => update("address", event.target.value)}
          required
          rows={3}
          autoComplete="street-address"
          placeholder="Mahalle, sokak, bina no, daire no..."
          className="mt-1.5 w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.isDefault ?? false}
          onChange={(event) => update("isDefault", event.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer accent-rose-600"
        />
        <span>
          Bu adresi <strong>varsayılan</strong> teslimat adresim yap.
        </span>
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-luxe btn-luxe-dark disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="btn-luxe btn-luxe-outline disabled:opacity-60"
          >
            İptal
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-luxe text-ink-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
      />
    </label>
  );
}
