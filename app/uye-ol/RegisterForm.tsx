"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/actions/auth";
import { formatPhone } from "@/lib/validation";

export default function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await registerAction({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
      });
      if (!result.ok) {
        setError(result.message ?? "Kayıt yapılamadı.");
        return;
      }
      window.dispatchEvent(new Event("miss-bella-auth-changed"));
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Ad"
          value={form.firstName}
          onChange={(v) => handleChange("firstName", v)}
          autoComplete="given-name"
          required
        />
        <Field
          label="Soyad"
          value={form.lastName}
          onChange={(v) => handleChange("lastName", v)}
          autoComplete="family-name"
          required
        />
      </div>
      <Field
        label="E-posta"
        type="email"
        value={form.email}
        onChange={(v) => handleChange("email", v)}
        autoComplete="email"
        required
      />
      <Field
        label="Telefon (opsiyonel)"
        type="tel"
        value={form.phone}
        onChange={(v) => handleChange("phone", formatPhone(v))}
        autoComplete="tel"
        placeholder="+90 5__ ___ __ __"
      />
      <Field
        label="Şifre"
        type="password"
        value={form.password}
        onChange={(v) => handleChange("password", v)}
        autoComplete="new-password"
        required
        minLength={6}
        hint="En az 6 karakter olmalı."
      />

      {error && (
        <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-luxe btn-luxe-dark w-full disabled:opacity-60"
      >
        {pending ? "Hesap oluşturuluyor..." : "Üye Ol"}
      </button>

      <p className="text-center text-[11px] text-ink-600">
        Üye olarak Mesafeli Satış Sözleşmesi ve KVKK Aydınlatma Metni&apos;ni
        kabul etmiş olursunuz.
      </p>
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
  minLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  minLength?: number;
  hint?: string;
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
        minLength={minLength}
        className="mt-1.5 w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
      />
      {hint && <p className="mt-1 text-[11px] text-ink-600">{hint}</p>}
    </label>
  );
}
