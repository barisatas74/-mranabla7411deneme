import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import LoginForm from "./LoginForm";
import { getCurrentUser } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Miss Bella hesabınıza giriş yapın.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (user) {
    redirect(sanitizeRedirect(params.redirect));
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Giriş Yap" }]} />
      <section className="bg-gradient-to-b from-powder-100 to-bone-50 py-14 md:py-20">
        <Container className="mx-auto max-w-md">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-editorial text-rose-600">
              Hoş Geldiniz
            </p>
            <h1 className="mt-3 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[52px]">
              Giriş Yap
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-sm text-ink-700">
              Hesabınıza giriş yaparak siparişlerinizi takip edin ve hızlı ödeme yapın.
            </p>
          </div>

          <div className="mt-10 border border-ink-900/10 bg-white p-7 shadow-card md:p-8">
            <LoginForm redirectTo={sanitizeRedirect(params.redirect)} />

            <p className="mt-6 text-center text-sm text-ink-700">
              Henüz üye değil misiniz?{" "}
              <Link
                href={`/uye-ol${params.redirect ? `?redirect=${encodeURIComponent(params.redirect)}` : ""}`}
                className="text-rose-600 underline underline-offset-2 hover:text-rose-700"
              >
                Üye ol
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

function sanitizeRedirect(value: string | undefined): string {
  if (!value) return "/hesabim";
  if (!value.startsWith("/") || value.startsWith("//")) return "/hesabim";
  if (value.startsWith("/admin")) return "/hesabim";
  return value;
}
