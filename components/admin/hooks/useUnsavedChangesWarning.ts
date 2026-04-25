"use client";

import { useCallback, useEffect } from "react";

export function useUnsavedChangesWarning(
  enabled: boolean,
  message = "Kaydedilmemis degisiklikleriniz var. Sayfadan ayrilmak istiyor musunuz?"
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, message]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isSameDestination =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash === currentUrl.hash;

      if (isSameDestination) {
        return;
      }

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [enabled, message]);

  return useCallback(() => {
    if (!enabled) {
      return true;
    }

    return window.confirm(message);
  }, [enabled, message]);
}
