"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function sanitizeRedirect(value: string | null) {
  if (!value) return "/admin";
  if (!value.startsWith("/")) return "/admin";
  if (value.startsWith("//")) return "/admin";
  if (!value.startsWith("/admin")) return "/admin";
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirect(searchParams.get("redirect"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error ?? "Giris yapilamadi.");
        setIsSubmitting(false);
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Sunucuya ulasilamadi.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f5f1] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 border border-ink-900/10 bg-white p-8 shadow-card"
      >
        <div>
          <p className="text-[10px] uppercase tracking-editorial text-rose-600">
            Admin Paneli
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink-900">
            Giris Yap
          </h1>
        </div>

        <label className="block">
          <span className="text-[11px] uppercase tracking-luxe text-ink-700">
            Kullanici Adi
          </span>
          <input
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1.5 w-full border border-ink-900/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-rose-500"
          />
        </label>

        <label className="block">
          <span className="text-[11px] uppercase tracking-luxe text-ink-700">
            Parola
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full border border-ink-900/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-rose-500"
          />
        </label>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-luxe btn-luxe-dark w-full disabled:opacity-60"
        >
          {isSubmitting ? "Giris yapiliyor..." : "Giris Yap"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f5f1] text-sm text-ink-700">
          Yukleniyor...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
