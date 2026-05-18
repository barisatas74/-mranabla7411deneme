"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => logoutAction())}
      disabled={pending}
      className="inline-flex items-center gap-2 border border-ink-900/15 bg-white px-5 py-2.5 text-xs uppercase tracking-luxe text-ink-900 transition hover:border-rose-500 hover:text-rose-600 disabled:opacity-60"
    >
      <LogOut size={14} strokeWidth={1.5} />
      {pending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </button>
  );
}
