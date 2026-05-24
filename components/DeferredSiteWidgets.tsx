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

function runAfterUserIntent(callback: () => void) {
  if (typeof window === "undefined") return;

  let settled = false;
  const events = ["pointerdown", "keydown", "touchstart"] as const;
  const cleanup = () => {
    events.forEach((eventName) =>
      window.removeEventListener(eventName, settle, { capture: true })
    );
  };
  const settle = () => {
    if (settled) return;
    settled = true;
    cleanup();
    callback();
  };

  events.forEach((eventName) =>
    window.addEventListener(eventName, settle, {
      capture: true,
      once: true,
      passive: true,
    })
  );

  return cleanup;
}

export default function DeferredSiteWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cancel = runAfterUserIntent(() => setReady(true));
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
