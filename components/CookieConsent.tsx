"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "miss-bella-cookie-consent";
const CONSENT_DELAY_MS = 1200;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function showConsent() {
      if (cancelled) return;
      setVisible(true);
      timeoutId = setTimeout(() => {
        if (!cancelled) setAnimate(true);
      }, 50);
    }

    function scheduleConsent() {
      timeoutId = setTimeout(showConsent, CONSENT_DELAY_MS);
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        scheduleConsent();
      }
    } catch {
      scheduleConsent();
    }

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  function persist(value: "accepted" | "rejected") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setAnimate(false);
    setTimeout(() => setVisible(false), 400);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Çerez tercihleri"
      className={`fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-rose-600/20 bg-bone-50/98 p-5 shadow-luxe backdrop-blur transition-all duration-500 md:bottom-5 md:p-6 ${
        animate
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0"
      }`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
        <div className="flex flex-shrink-0 items-center justify-center md:items-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-rose-500 text-white shadow-card">
            <Cookie size={20} strokeWidth={1.5} />
          </div>
        </div>

        <div className="flex-1 text-sm leading-relaxed text-ink-800">
          <p className="font-display text-lg text-ink-900">
            Çerez tercihleriniz
          </p>
          <p className="mt-2 text-[13px] text-ink-700">
            Deneyiminizi iyileştirmek, sepet ve oturum sürekliliğini sağlamak
            ve site performansını ölçümlemek için çerezlerden yararlanıyoruz.
            Detaylar için{" "}
            <Link
              href="/gizlilik"
              className="text-rose-600 underline-offset-2 hover:underline"
            >
              Gizlilik Politikası
            </Link>{" "}
            ve{" "}
            <Link
              href="/kvkk"
              className="text-rose-600 underline-offset-2 hover:underline"
            >
              KVKK Aydınlatma Metni
            </Link>{" "}
            sayfalarını inceleyin.
          </p>
        </div>

        <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
          <button
            type="button"
            onClick={() => persist("accepted")}
            className="btn-luxe btn-luxe-rose shadow-luxe"
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

        <button
          type="button"
          onClick={() => persist("rejected")}
          aria-label="Kapat"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-ink-500 transition hover:bg-ink-900/5 hover:text-ink-900 md:hidden"
        >
          <X size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
