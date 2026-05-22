"use server";

import { getCurrentUser } from "@/lib/actions/auth";
import { couponService } from "@/lib/services/server";
import { normalizeCouponCode } from "@/lib/commerce";

type CouponValidationResult = {
  ok: boolean;
  message: string;
  code?: string;
  discountRate?: number;
};

export async function validateCouponAction(
  code: string
): Promise<CouponValidationResult> {
  const normalizedCode = normalizeCouponCode(code);
  if (!normalizedCode) {
    return { ok: false, message: "Kupon kodu girin." };
  }

  const coupon = await couponService.getByCode(normalizedCode);
  if (!coupon) {
    return { ok: false, message: "Kupon kodu geçersiz veya tanımsız." };
  }
  if (coupon.status !== "active") {
    return { ok: false, message: "Bu kupon artık aktif değil." };
  }
  if (coupon.expiresAt && Date.parse(coupon.expiresAt) < Date.now()) {
    return { ok: false, message: "Bu kuponun kullanım süresi dolmuş." };
  }
  if (
    coupon.usageLimit != null &&
    Number.isFinite(Number(coupon.usageLimit)) &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return { ok: false, message: "Bu kuponun kullanım hakkı dolmuş." };
  }

  if (coupon.assignedUserId) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        ok: false,
        message: "Bu kupon üyeye özel. Kullanmak için giriş yapın.",
      };
    }
    if (currentUser.id !== coupon.assignedUserId) {
      return {
        ok: false,
        message: "Bu kupon başka bir üyeye özel.",
      };
    }
  }

  return {
    ok: true,
    code: coupon.code,
    discountRate: coupon.discountRate,
    message: `${coupon.code} uygulandı, %${coupon.discountRate} indirim hesaba katıldı.`,
  };
}
