"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Tag, X } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { validateCouponAction } from "@/lib/actions/coupons";
import { DEFAULT_COUPON_CODE, normalizeCouponCode } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export default function CouponCodeForm({
  className,
}: {
  className?: string;
}) {
  const { couponCode, applyCoupon, removeCoupon } = useCart();
  const [input, setInput] = useState(couponCode ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setInput(couponCode ?? "");
  }, [couponCode]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = normalizeCouponCode(input);

    startTransition(async () => {
      const result = await validateCouponAction(normalizedCode);
      if (!result.ok || !result.code || !result.discountRate) {
        removeCoupon();
        setFeedback(result.message);
        return;
      }

      applyCoupon(result.code, result.discountRate);
      setFeedback(result.message);
    });
  }

  function handleRemove() {
    removeCoupon();
    setInput("");
    setFeedback("Kupon kaldırıldı.");
  }

  return (
    <div className={cn("border border-rose-100 bg-powder-50/50 p-4", className)}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-luxe text-rose-600">
            <Tag size={13} strokeWidth={1.5} />
            Kupon Kodu
          </span>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setFeedback(null);
              }}
              placeholder={`Örn. ${DEFAULT_COUPON_CODE}`}
              className="min-w-0 flex-1 border border-ink-900/10 bg-white px-3 py-2.5 text-sm uppercase tracking-wider text-ink-900 outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-500 focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={pending}
              className="border border-ink-900 bg-ink-900 px-4 py-2.5 text-[10px] font-medium uppercase tracking-editorial text-white transition hover:bg-rose-600"
            >
              {pending ? "Kontrol" : "Uygula"}
            </button>
            {couponCode && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex h-10 w-10 items-center justify-center border border-ink-900/10 bg-white text-ink-700 transition hover:border-rose-500 hover:text-rose-600"
                aria-label="Kuponu kaldır"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </label>
      </form>

      {feedback && (
        <p
          className={cn(
            "mt-2 text-[11px] leading-relaxed tracking-wider",
            couponCode ? "text-rose-600" : "text-ink-600"
          )}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
