import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import { WhatsAppSupportButton } from "@/components/WhatsAppButton";
import { MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Miss Bella müşteri hizmetleri; sipariş, iade, kargo ve işbirliği sorularınız için iletişim formu ve kanalları.",
};

export default function IletisimPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "İletişim" }]} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/8 bg-gradient-to-b from-powder-100 via-bone-50 to-powder-50 py-14 md:py-24">
        <div className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-rose-300/25 blur-[140px]" />
        <Container className="relative text-center">
          <span className="luxe-label">Bize Ulaşın</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[72px]">
            İletişim&nbsp;
            <span className="font-italic-display text-gradient-fuchsia">
              Merkezi
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-700 md:text-base">
            Sipariş, iade, kargo veya işbirliği sorularınız için aşağıdaki
            formu doldurabilir ya da iletişim kanallarımızdan bize doğrudan
            ulaşabilirsiniz.
          </p>
        </Container>
      </section>

      <Container className="grid gap-8 py-14 md:grid-cols-12 md:py-20">
        {/* İletişim Formu */}
        <div className="md:col-span-7">
          <div className="rounded-3xl border border-ink-900/10 bg-bone-50 p-6 shadow-card md:p-10">
            <h2 className="font-display text-2xl text-ink-900 md:text-3xl">
              Bize bir mesaj{" "}
              <span className="font-italic-display text-gradient-fuchsia">
                gönderin
              </span>
            </h2>
            <p className="mt-2 text-sm text-ink-700">
              Formu doldurun, en geç 24 saat içinde geri dönüş sağlayalım.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <aside className="md:col-span-5">
          <div className="space-y-5">
            <article className="rounded-3xl border border-ink-900/10 bg-gradient-to-br from-powder-50 to-bone-50 p-6 shadow-card md:p-8">
              <p className="luxe-label plain text-rose-600">
                Müşteri Hizmetleri
              </p>
              <ul className="mt-6 space-y-5 text-sm text-ink-800">
                <ContactRow
                  icon={<Phone size={16} strokeWidth={1.5} />}
                  title="Telefon / WhatsApp"
                  value={
                    <a
                      href="tel:+905309907163"
                      className="hover:text-rose-600"
                    >
                      0530 990 71 63
                    </a>
                  }
                />
                <ContactRow
                  icon={<MapPin size={16} strokeWidth={1.5} />}
                  title="Adres"
                  value={
                    <span>
                      Eşref Dinçer Mah., Eski Pazar Cd. No: 20/A
                      <br />
                      16600 Gemlik / Bursa
                    </span>
                  }
                />
                <ContactRow
                  icon={<Clock size={16} strokeWidth={1.5} />}
                  title="Çalışma Saatleri"
                  value="Pazartesi – Cumartesi · 09:00–19:00"
                />
              </ul>

              <div className="mt-7">
                <WhatsAppSupportButton context="iletisim formu" />
              </div>
            </article>

            <article className="rounded-3xl border border-ink-900/10 bg-bone-50 p-6 shadow-card md:p-8">
              <p className="luxe-label plain text-rose-600">Hızlı Yardım</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href="/sss"
                    className="inline-flex items-center gap-2 text-ink-800 transition hover:text-rose-600"
                  >
                    → Sıkça Sorulan Sorular
                  </a>
                </li>
                <li>
                  <a
                    href="/kargo-teslimat"
                    className="inline-flex items-center gap-2 text-ink-800 transition hover:text-rose-600"
                  >
                    → Kargo & Teslimat
                  </a>
                </li>
                <li>
                  <a
                    href="/iade-politikasi"
                    className="inline-flex items-center gap-2 text-ink-800 transition hover:text-rose-600"
                  >
                    → İade Politikası
                  </a>
                </li>
                <li>
                  <a
                    href="/beden-tablosu"
                    className="inline-flex items-center gap-2 text-ink-800 transition hover:text-rose-600"
                  >
                    → Beden Tablosu
                  </a>
                </li>
              </ul>
            </article>
          </div>
        </aside>
      </Container>
    </>
  );
}

function ContactRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-bone-50 text-rose-600 ring-1 ring-rose-600/15">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-editorial text-ink-600">
          {title}
        </p>
        <div className="mt-0.5 break-words text-ink-900">{value}</div>
      </div>
    </li>
  );
}
