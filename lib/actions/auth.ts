"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userService } from "@/lib/services/server";
import {
  USER_COOKIE_MAX_AGE,
  USER_COOKIE_NAME,
  signSession,
  verifySession,
} from "@/lib/user-auth";
import { LoginInput, RegisterInput, User } from "@/types";

type ActionResult = {
  ok: boolean;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function setUserCookie(userId: string) {
  const store = await cookies();
  store.set(USER_COOKIE_NAME, signSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: USER_COOKIE_MAX_AGE,
    path: "/",
  });
}

async function clearUserCookie() {
  const store = await cookies();
  store.delete(USER_COOKIE_NAME);
}

async function readUserCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(USER_COOKIE_NAME)?.value ?? null;
}

export async function registerAction(
  input: RegisterInput
): Promise<ActionResult> {
  try {
    if (!isValidEmail(input.email)) {
      return { ok: false, message: "Geçerli bir e-posta girin." };
    }
    if (input.password.length < 6) {
      return { ok: false, message: "Şifre en az 6 karakter olmalı." };
    }
    if (!input.firstName.trim() || !input.lastName.trim()) {
      return { ok: false, message: "Ad ve soyad zorunludur." };
    }
    const user = await userService.create(input);
    await setUserCookie(user.id);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Kayıt sırasında bir hata oluştu.",
    };
  }
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  try {
    if (!isValidEmail(input.email) || !input.password) {
      return { ok: false, message: "E-posta veya şifre hatalı." };
    }
    const user = await userService.verifyCredentials(
      input.email,
      input.password
    );
    if (!user) {
      return { ok: false, message: "E-posta veya şifre hatalı." };
    }
    await setUserCookie(user.id);
    return { ok: true };
  } catch {
    return { ok: false, message: "Giriş sırasında bir hata oluştu." };
  }
}

export async function logoutAction() {
  await clearUserCookie();
  redirect("/");
}

export async function updateProfileAction(input: {
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<ActionResult> {
  try {
    const current = await getCurrentUser();
    if (!current) return { ok: false, message: "Oturum bulunamadı." };
    if (!input.firstName.trim() || !input.lastName.trim()) {
      return { ok: false, message: "Ad ve soyad zorunludur." };
    }
    await userService.update(current.id, {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone?.trim() ?? "",
    });
    return { ok: true };
  } catch {
    return { ok: false, message: "Profil güncellenemedi." };
  }
}

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  try {
    const current = await getCurrentUser();
    if (!current) return { ok: false, message: "Oturum bulunamadı." };
    const result = await userService.changePassword(
      current.id,
      input.currentPassword,
      input.newPassword
    );
    return result;
  } catch {
    return { ok: false, message: "Şifre değiştirilemedi." };
  }
}

export async function deleteAccountAction(input: {
  confirmation: string;
}): Promise<ActionResult> {
  try {
    const current = await getCurrentUser();
    if (!current) return { ok: false, message: "Oturum bulunamadı." };
    if (input.confirmation.trim().toLocaleLowerCase("tr") !== "hesabımı sil") {
      return {
        ok: false,
        message: 'Devam etmek için "hesabımı sil" yazmalısınız.',
      };
    }

    const removed = await userService.removeAccount(current.id);
    if (!removed) return { ok: false, message: "Hesap bulunamadı." };
    await clearUserCookie();
    return { ok: true };
  } catch {
    return { ok: false, message: "Hesap silinemedi." };
  }
}

/** Sunucu tarafinda mevcut kullaniciyi don (cookie'den okur) */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookie = await readUserCookie();
    const userId = verifySession(cookie ?? undefined);
    if (!userId) return null;
    return await userService.getById(userId);
  } catch {
    return null;
  }
}
