"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  honey: string; // honeypot — botlar doldurur
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "siparis",
  message: "",
  consent: false,
  honey: "",
};

const SUBJECT_OPTIONS = [
  { value: "siparis", label: "Sipariş Sorusu" },
  { value: "iade", label: "İade & Değişim" },
  { value: "kargo", label: "Kargo & Teslimat" },
  { value: "urun", label: "Ürün Bilgisi" },
  { value: "isbirligi", label: "İşbirliği & Basın" },
  { value: "diger", label: "Diğer" },
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Lütfen adınızı girin.";
    if (!form.email.trim()) next.email = "E-posta adresinizi girin.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Geçerli bir e-posta girin.";
    if (form.phone && !/^[\d\s+()-]{10,}$/.test(form.phone))
      next.phone = "Geçerli bir telefon numarası girin.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Mesajınız en az 10 karakter olmalı.";
    if (!form.consent)
      next.consent = "Devam etmek için onay vermeniz gerekiyor.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    if (form.honey) {
      // Bot tespit — sessizce başarı dön
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      // Şu an gerçek bir endpoint yok — host kurulumunda /api/contact eklenecek
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setForm(initialState);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-600/20 bg-gradient-to-br from-powder-50 to-bone-50 p-10 text-center">
        <CheckCircle2 size={36} strokeWidth={1.5} className="text-rose-600" />
        <h3 className="font-display text-xl text-ink-900">
          Mesajınız iletildi
        </h3>
        <p className="max-w-md text-sm text-ink-700">
          En geç 24 saat içinde size geri dönüş sağlayacağız. Bizimle iletişime
          geçtiğiniz için teşekkür ederiz.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs uppercase tracking-editorial text-rose-600 underline-offset-4 hover:underline"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — gizli, botlar için */}
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden>
        <label>
          Bu alanı boş bırakın
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.honey}
            onChange={(event) =>
              setForm((current) => ({ ...current, honey: event.target.value }))
            }
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Ad Soyad" htmlFor="name" error={errors.name} required>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className={inputClass(Boolean(errors.name))}
            placeholder="Adınız Soyadınız"
            autoComplete="name"
          />
        </Field>

        <Field label="E-posta" htmlFor="email" error={errors.email} required>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className={inputClass(Boolean(errors.email))}
            placeholder="ornek@eposta.com"
            autoComplete="email"
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Telefon (opsiyonel)" htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                phone: maskPhone(event.target.value),
              }))
            }
            className={inputClass(Boolean(errors.phone))}
            placeholder="+90 555 ___ __ __"
            autoComplete="tel"
            inputMode="tel"
          />
        </Field>

        <Field label="Konu" htmlFor="subject">
          <select
            id="subject"
            value={form.subject}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                subject: event.target.value,
              }))
            }
            className={inputClass(false)}
          >
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Mesajınız"
        htmlFor="message"
        error={errors.message}
        required
      >
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          className={inputClass(Boolean(errors.message))}
          placeholder="Mesajınızı buraya yazın..."
        />
      </Field>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-ink-700">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              consent: event.target.checked,
            }))
          }
          className="mt-0.5 h-4 w-4 cursor-pointer accent-rose-600"
        />
        <span>
          <a
            href="/kvkk"
            target="_blank"
            className="text-rose-600 underline-offset-4 hover:underline"
          >
            KVKK Aydınlatma Metni
          </a>
          &apos;ni okudum ve verilerimin işlenmesine onay veriyorum.
        </span>
      </label>
      {errors.consent && (
        <p className="-mt-3 flex items-center gap-1.5 text-xs text-rose-600">
          <AlertCircle size={12} /> {errors.consent}
        </p>
      )}

      {status === "error" && (
        <p className="rounded-lg border border-rose-600/30 bg-rose-50 p-3 text-sm text-rose-700">
          Bir hata oluştu, lütfen tekrar deneyin.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-luxe btn-luxe-rose w-full sm:w-auto"
      >
        {status === "submitting" ? (
          "Gönderiliyor..."
        ) : (
          <>
            Mesajı Gönder <Send size={14} strokeWidth={1.5} />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[10px] uppercase tracking-editorial text-ink-700"
      >
        {label}
        {required && <span className="ml-1 text-rose-600">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-500/60",
    hasError
      ? "border-rose-600 focus:border-rose-600 focus:ring-2 focus:ring-rose-600/15"
      : "border-ink-900/15 focus:border-rose-600 focus:ring-2 focus:ring-rose-600/15"
  );
}

function maskPhone(value: string): string {
  // Sadece rakam, boşluk, +, -, parantez izin ver
  return value.replace(/[^\d\s+()-]/g, "").slice(0, 20);
}
