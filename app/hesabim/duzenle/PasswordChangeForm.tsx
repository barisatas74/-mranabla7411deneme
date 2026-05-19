"use client";

import { useState, useTransition, type FormEvent } from "react";
import { changePasswordAction } from "@/lib/actions/auth";

export default function PasswordChangeForm() {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    message: string;
  } | null>(null);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    if (form.newPassword !== form.confirmPassword) {
      setFeedback({ type: "err", message: "Yeni şifreler eşleşmiyor." });
      return;
    }
    if (form.newPassword.length < 6) {
      setFeedback({ type: "err", message: "Yeni şifre en az 6 karakter olmalı." });
      return;
    }
    startTransition(async () => {
      const result = await changePasswordAction({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      if (!result.ok) {
        setFeedback({
          type: "err",
          message: result.message ?? "Şifre değiştirilemedi.",
        });
        return;
      }
      setFeedback({ type: "ok", message: "Şifreniz değiştirildi." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field
        label="Mevcut Şifre"
        type="password"
        value={form.currentPassword}
        onChange={(v) => setForm((p) => ({ ...p, currentPassword: v }))}
        autoComplete="current-password"
        required
      />
      <Field
        label="Yeni Şifre"
        type="password"
        value={form.newPassword}
        onChange={(v) => setForm((p) => ({ ...p, newPassword: v }))}
        autoComplete="new-password"
        required
        minLength={6}
        hint="En az 6 karakter."
      />
      <Field
        label="Yeni Şifre (Tekrar)"
        type="password"
        value={form.confirmPassword}
        onChange={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
        autoComplete="new-password"
        required
        minLength={6}
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
        {pending ? "Güncelleniyor..." : "Şifreyi Değiştir"}
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
  minLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
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
        minLength={minLength}
        className="mt-1.5 w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
      />
      {hint && <p className="mt-1 text-[11px] text-ink-600">{hint}</p>}
    </label>
  );
}
