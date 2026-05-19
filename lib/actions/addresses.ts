"use server";

import { revalidatePath } from "next/cache";
import { addressService } from "@/lib/services/server";
import { getCurrentUser } from "@/lib/actions/auth";
import { UserAddress, UserAddressInput } from "@/types";

type ActionResult<T = undefined> = {
  ok: boolean;
  message?: string;
  data?: T;
};

function validate(input: UserAddressInput): string | null {
  if (!input.label.trim()) return "Adres etiketi zorunludur (Ev, İş vb.).";
  if (!input.fullName.trim()) return "Ad soyad zorunludur.";
  if (!input.phone.trim()) return "Telefon zorunludur.";
  if (!input.city.trim()) return "Şehir zorunludur.";
  if (!input.district.trim()) return "İlçe zorunludur.";
  if (!input.address.trim() || input.address.trim().length < 10)
    return "Adres detayı en az 10 karakter olmalı.";
  return null;
}

export async function listAddressesAction(): Promise<UserAddress[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return await addressService.listForUser(user.id);
}

export async function createAddressAction(
  input: UserAddressInput
): Promise<ActionResult<UserAddress>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, message: "Oturum bulunamadı." };
    const err = validate(input);
    if (err) return { ok: false, message: err };
    const created = await addressService.create(user.id, input);
    revalidatePath("/hesabim/adresler");
    revalidatePath("/checkout");
    return { ok: true, data: created };
  } catch {
    return { ok: false, message: "Adres eklenemedi." };
  }
}

export async function updateAddressAction(
  id: string,
  input: UserAddressInput
): Promise<ActionResult<UserAddress>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, message: "Oturum bulunamadı." };
    const err = validate(input);
    if (err) return { ok: false, message: err };
    const updated = await addressService.update(id, user.id, input);
    if (!updated) return { ok: false, message: "Adres bulunamadı." };
    revalidatePath("/hesabim/adresler");
    revalidatePath("/checkout");
    return { ok: true, data: updated };
  } catch {
    return { ok: false, message: "Adres güncellenemedi." };
  }
}

export async function deleteAddressAction(
  id: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, message: "Oturum bulunamadı." };
    const ok = await addressService.delete(id, user.id);
    if (!ok) return { ok: false, message: "Adres bulunamadı." };
    revalidatePath("/hesabim/adresler");
    revalidatePath("/checkout");
    return { ok: true };
  } catch {
    return { ok: false, message: "Adres silinemedi." };
  }
}

export async function setDefaultAddressAction(
  id: string
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, message: "Oturum bulunamadı." };
    const ok = await addressService.setDefault(id, user.id);
    if (!ok) return { ok: false, message: "Adres bulunamadı." };
    revalidatePath("/hesabim/adresler");
    revalidatePath("/checkout");
    return { ok: true };
  } catch {
    return { ok: false, message: "Varsayılan adres ayarlanamadı." };
  }
}
