"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/lib/actions/auth";
import { formatPhone } from "@/lib/validation";

export default function ProfileEditForm({
  initial,
}: {
  initial: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    message: string;
  } | null>(null);
  const [form, setForm] = useState({
    firstName: initial.firstName,
    lastName: initial.lastName,
    phone: initial.phone,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await updateProfileAction({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
      });
      if (!result.ok) {
        setFeedback({
          type: "err",
          message: result.message ?? "Güncellenemedi.",
        });
        return;
      }
      setFeedback({ type: "ok", message: "Bilgileriniz güncellendi." });
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Ad"
          value={form.firstName}
          onChange={(v) => setForm((p) => ({ ...p, firstName: v }))}
          autoComplete="given-name"
          required
        />
        <Field
          label="Soyad"
          value={form.lastName}
          onChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
          autoComplete="family-name"
          required
        />
      </div>

      <Field
        label="E-posta"
        value={initial.email}
        onChange={() => {}}
        disabled
      />

      <Field
        label="Telefon (opsiyonel)"
        type="tel"
        value={form.phone}
        onChange={(v) => setForm((p) => ({ ...p, phone: formatPhone(v) }))}
        autoComplete="tel"
        placeholder="+90 5__ ___ __ __"
      />

      {feedback && (
        <p
          className={
            feedback.type === "ok"
              ? "rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              : "rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          }
        >
          {feedback.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-luxe btn-luxe-dark w-full disabled:opacity-60"
      >
        {pending ? "Kaydediliyor..." : "Bilgileri Kaydet"}
      </button>
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
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
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
        disabled={disabled}
        className="mt-1.5 w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 disabled:bg-bone-100 disabled:text-ink-600"
      />
    </label>
  );
}
