"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-rose-600"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg leading-tight text-ink-900 md:text-xl">
                {item.question}
              </span>
              <Plus
                strokeWidth={1.5}
                size={18}
                className={cn(
                  "flex-shrink-0 text-rose-600 transition-transform duration-500",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-500 ease-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-6 text-sm font-light leading-[1.85] text-ink-700">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
