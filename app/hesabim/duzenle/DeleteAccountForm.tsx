"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteAccountAction } from "@/lib/actions/auth";

export default function DeleteAccountForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await deleteAccountAction({ confirmation });
      if (!result.ok) {
        setError(result.message ?? "Hesap silinemedi.");
        return;
      }

      window.dispatchEvent(new Event("miss-bella-auth-changed"));
      router.replace("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[11px] uppercase tracking-luxe text-rose-800">
          Onay Metni
        </span>
        <input
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder="hesabımı sil"
          className="mt-1.5 w-full rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
        />
      </label>

      {error && (
        <p className="rounded border border-rose-200 bg-white px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-700 px-5 py-3 text-[11px] uppercase tracking-editorial text-white transition hover:bg-rose-800 disabled:opacity-60"
      >
        <Trash2 size={14} strokeWidth={1.6} />
        {pending ? "Siliniyor..." : "Hesabımı Kalıcı Olarak Sil"}
      </button>
    </form>
  );
}
