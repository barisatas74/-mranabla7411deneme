import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import { getCurrentUser } from "@/lib/actions/auth";
import ProfileEditForm from "./ProfileEditForm";
import PasswordChangeForm from "./PasswordChangeForm";

export const metadata: Metadata = {
  title: "Hesabımı Düzenle",
  description: "Profil bilgilerinizi ve şifrenizi güncelleyin.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/giris?redirect=/hesabim/duzenle");
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Hesabım", href: "/hesabim" },
          { label: "Düzenle" },
        ]}
      />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-16">
        <Container>
          <p className="text-[10px] uppercase tracking-editorial text-rose-600">
            Profil Ayarları
          </p>
          <h1 className="mt-3 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[52px]">
            Hesabımı Düzenle
          </h1>
          <p className="mt-3 text-sm text-ink-700">
            Bilgilerinizi güncelleyebilir veya şifrenizi değiştirebilirsiniz.
          </p>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <section className="border border-ink-900/10 bg-white p-7 shadow-card md:p-8">
            <h2 className="font-display text-2xl text-ink-900">
              Profil Bilgileri
            </h2>
            <p className="mt-1 text-xs text-ink-600">
              E-posta adresinizi değiştirmek için lütfen bizimle iletişime
              geçin.
            </p>
            <div className="mt-6">
              <ProfileEditForm
                initial={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  phone: user.phone ?? "",
                  email: user.email,
                }}
              />
            </div>
          </section>

          <section className="border border-ink-900/10 bg-white p-7 shadow-card md:p-8">
            <h2 className="font-display text-2xl text-ink-900">
              Şifre Değiştir
            </h2>
            <p className="mt-1 text-xs text-ink-600">
              Güvenliğiniz için periyodik olarak şifrenizi güncellemenizi
              öneririz.
            </p>
            <div className="mt-6">
              <PasswordChangeForm />
            </div>
          </section>
        </div>

        <div className="mt-8">
          <Link
            href="/hesabim"
            className="text-sm text-rose-600 underline-offset-2 hover:underline"
          >
            ← Hesabıma dön
          </Link>
        </div>
      </Container>
    </>
  );
}
