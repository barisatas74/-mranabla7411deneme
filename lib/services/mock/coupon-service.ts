import { CouponService } from "@/lib/services/contracts";
import { getCouponStore, setCouponStore } from "@/lib/services/mock/admin-db";
import { AdminCoupon } from "@/types";

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

function normalizeInput(input: {
  code: string;
  discountRate: number;
  status: AdminCoupon["status"];
  assignedUserId?: string;
  usageLimit?: number;
  expiresAt?: string;
}) {
  return {
    code: normalizeCode(input.code),
    discountRate: Math.max(5, Math.min(50, Number(input.discountRate) || 0)),
    status: input.status,
    assignedUserId: input.assignedUserId?.trim() || undefined,
    usageLimit:
      input.usageLimit != null && Number.isFinite(Number(input.usageLimit))
        ? Math.max(1, Math.floor(Number(input.usageLimit)))
        : undefined,
    expiresAt: input.expiresAt || undefined,
  };
}

export const mockCouponService: CouponService = {
  async list() {
    return structuredClone(getCouponStore());
  },

  async getByCode(code) {
    const normalizedCode = normalizeCode(code);
    const coupon = getCouponStore().find((item) => item.code === normalizedCode);
    return coupon ? structuredClone(coupon) : null;
  },

  async create(input) {
    const normalized = normalizeInput(input);
    const now = new Date().toISOString();
    const coupon: AdminCoupon = {
      id: `c-${Date.now().toString(36)}`,
      ...normalized,
      usedCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setCouponStore([coupon, ...getCouponStore()]);
    return structuredClone(coupon);
  },

  async update(id, input) {
    const existing = getCouponStore().find((item) => item.id === id);
    if (!existing) return null;

    const nextCoupon: AdminCoupon = {
      ...existing,
      ...normalizeInput(input),
      updatedAt: new Date().toISOString(),
    };
    setCouponStore(
      getCouponStore().map((item) => (item.id === id ? nextCoupon : item))
    );
    return structuredClone(nextCoupon);
  },

  async markUsed(code) {
    const normalizedCode = normalizeCode(code);
    let changed = false;
    const now = Date.now();
    const nextCoupons = getCouponStore().map((coupon) => {
      if (coupon.code !== normalizedCode) return coupon;
      if (coupon.status !== "active") return coupon;
      if (coupon.expiresAt && Date.parse(coupon.expiresAt) < now) return coupon;
      if (
        coupon.usageLimit != null &&
        Number.isFinite(Number(coupon.usageLimit)) &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        return coupon;
      }
      changed = true;
      return {
        ...coupon,
        usedCount: coupon.usedCount + 1,
        updatedAt: new Date().toISOString(),
      };
    });
    if (changed) setCouponStore(nextCoupons);
    return changed;
  },

  async releaseUsage(code) {
    const normalizedCode = normalizeCode(code);
    let changed = false;
    const nextCoupons = getCouponStore().map((coupon) => {
      if (coupon.code !== normalizedCode) return coupon;
      changed = true;
      return {
        ...coupon,
        usedCount: Math.max(0, coupon.usedCount - 1),
        updatedAt: new Date().toISOString(),
      };
    });
    if (changed) setCouponStore(nextCoupons);
    return changed;
  },
};
