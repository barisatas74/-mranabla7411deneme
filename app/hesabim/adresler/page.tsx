import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import { getCurrentUser } from "@/lib/actions/auth";
import { listAddressesAction } from "@/lib/actions/addresses";
import AddressManager from "./AddressManager";

export const metadata: Metadata = {
  title: "Adreslerim",
  description: "Kayıtlı teslimat adreslerinizi yönetin.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/giris?redirect=/hesabim/adresler");
  }

  const addresses = await listAddressesAction();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Hesabım", href: "/hesabim" },
          { label: "Adreslerim" },
        ]}
      />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-16">
        <Container>
          <p className="text-[10px] uppercase tracking-editorial text-rose-600">
            Teslimat Adresleri
          </p>
          <h1 className="mt-3 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[52px]">
            Adreslerim
          </h1>
          <p className="mt-3 max-w-xl text-sm text-ink-700">
            Sık kullandığınız teslimat adreslerini kaydedin, sipariş verirken
            tek tıkla seçin.
          </p>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {addresses.length === 0 && (
          <div className="mb-8 flex items-start gap-3 border border-rose-200 bg-rose-50/60 p-4 text-sm text-ink-700">
            <MapPin
              size={18}
              strokeWidth={1.5}
              className="mt-0.5 flex-shrink-0 text-rose-600"
            />
            <p>
              Henüz kayıtlı adresiniz yok. İlk adresinizi ekleyin —
              checkout&apos;ta otomatik olarak gelir.
            </p>
          </div>
        )}

        <AddressManager initialAddresses={addresses} />

        <div className="mt-10">
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
