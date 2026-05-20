"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    function scrollToPageTop() {
      if (window.location.hash) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    function scheduleScrollToTop() {
      scrollToPageTop();
      requestAnimationFrame(scrollToPageTop);
      window.setTimeout(scrollToPageTop, 80);
    }

    scheduleScrollToTop();
    window.addEventListener("pageshow", scrollToPageTop);
    window.addEventListener("load", scheduleScrollToTop);

    return () => {
      window.removeEventListener("pageshow", scrollToPageTop);
      window.removeEventListener("load", scheduleScrollToTop);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Sayfanın en üstüne çık"
      className={cn(
        "fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink-950/90 text-white shadow-luxe backdrop-blur transition-all duration-500 hover:scale-110 hover:bg-rose-600 md:bottom-7 md:left-7",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      )}
    >
      <ArrowUp size={18} strokeWidth={1.8} />
    </button>
  );
}
