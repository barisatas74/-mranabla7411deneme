"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (honey) {
      setStatus("success");
      return;
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValid) {
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("server error");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col items-stretch gap-0 rounded-full border border-white/15 bg-white/5 transition focus-within:border-rose-300 sm:flex-row"
      >
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute h-0 w-0 opacity-0"
          value={honey}
          onChange={(event) => setHoney(event.target.value)}
        />

        <div className="flex items-center pl-5 pr-3">
          <Mail className="text-rose-300" strokeWidth={1.5} size={16} />
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="E-posta adresiniz"
          className="flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-white/40"
          autoComplete="email"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4 text-[11px] uppercase tracking-editorial text-white transition hover:from-rose-600 hover:to-rose-700 sm:rounded-l-none"
        >
          Abone Ol <ArrowRight strokeWidth={1.5} size={14} />
        </button>
      </form>
      {status === "success" && (
        <p className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-wider text-rose-300">
          <CheckCircle2 size={12} /> Teşekkürler! Bültenimize başarıyla abone
          oldunuz.
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-[11px] tracking-wider text-rose-300">
          Lütfen geçerli bir e-posta adresi girin.
        </p>
      )}
      <p className="mt-2 text-[10px] text-white/40">
        Abonelik ile{" "}
        <Link href="/kvkk" className="underline-offset-2 hover:underline">
          KVKK
        </Link>{" "}
        kapsamında bilgilendirme aldığınızı kabul etmiş olursunuz.
      </p>
    </div>
  );
}
