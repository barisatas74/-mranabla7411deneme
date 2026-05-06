"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  variant?: "up" | "fade" | "scale" | "left" | "right";
  threshold?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  variant = "up",
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const base =
    "transition-all duration-[900ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] will-change-transform";
  const hidden = {
    up: "opacity-0 translate-y-6",
    fade: "opacity-0",
    scale: "opacity-0 scale-[0.97]",
    left: "opacity-0 -translate-x-6",
    right: "opacity-0 translate-x-6",
  }[variant];
  const shown = "opacity-100 translate-x-0 translate-y-0 scale-100";

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(base, visible ? shown : hidden, className)}
    >
      {children}
    </Component>
  );
}
