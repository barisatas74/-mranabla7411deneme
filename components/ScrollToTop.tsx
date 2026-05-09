"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

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
