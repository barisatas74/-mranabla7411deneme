"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FloatingWhatsApp = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
});
const AddToCartToast = dynamic(() => import("@/components/AddToCartToast"), {
  ssr: false,
});
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), {
  ssr: false,
});
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), {
  ssr: false,
});

function runAfterFirstPaint(callback: () => void) {
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 3500 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = globalThis.setTimeout(callback, 2500);
  return () => globalThis.clearTimeout(timeoutId);
}

export default function DeferredSiteWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cancel = runAfterFirstPaint(() => setReady(true));
    return () => cancel?.();
  }, []);

  if (!ready) return null;

  return (
    <>
      <FloatingWhatsApp />
      <ScrollToTop />
      <AddToCartToast />
      <CookieConsent />
    </>
  );
}
