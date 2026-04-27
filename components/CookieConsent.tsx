"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "miss-bella-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function persist(value: "accepted" | "rejected") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cerez tercihleri"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-ink-900/10 bg-bone-50/98 p-5 shadow-luxe backdrop-blur md:bottom-5 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <div className="flex-1 text-sm leading-relaxed text-ink-800">
          <p className="font-display text-lg text-ink-900">
            Cerezleri kullaniyoruz
          </p>
          <p className="mt-2 text-[13px] text-ink-700">
            Deneyiminizi iyilestirmek, sepet ve oturum surekliligini saglamak ve
            site performansini olcumlemek icin cerezlerden yararlaniyoruz.
            Detaylar icin{" "}
            <Link
              href="/gizlilik"
              className="text-rose-600 underline-offset-2 hover:underline"
            >
              Gizlilik Politikasi
            </Link>{" "}
            ve{" "}
            <Link
              href="/kvkk"
              className="text-rose-600 underline-offset-2 hover:underline"
            >
              KVKK Aydinlatma Metni
            </Link>{" "}
            sayfalarini inceleyin.
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
          <button
            type="button"
            onClick={() => persist("accepted")}
            className="btn-luxe btn-luxe-dark"
          >
            Kabul Et
          </button>
          <button
            type="button"
            onClick={() => persist("rejected")}
            className="btn-luxe btn-luxe-outline"
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}
