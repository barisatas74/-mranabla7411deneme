import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import { WhatsAppSupportButton } from "@/components/WhatsAppButton";
import { Mail, MapPin, Phone, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Miss Bella müşteri hizmetleri; sipariş, iade, kargo ve işbirliği sorularınız için iletişim kanalları.",
};

export default function IletisimPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "İletişim" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 text-center md:py-20">
        <Container>
          <span className="luxe-label">Bize Ulaşın</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[64px]">
            İletişim
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-700 md:text-base">
            Sipariş, iade, kargo veya işbirliği sorularınızı aşağıdaki kanallardan
            bize iletebilirsiniz. Hafta içi 09:00&ndash;18:00 saatlerinde geri
            dönüş sağlarız.
          </p>
        </Container>
      </section>

      <Container className="grid gap-8 py-14 md:grid-cols-2 md:py-20">
        <article className="border border-ink-900/10 bg-white p-8 shadow-card">
          <p className="luxe-label plain text-rose-600">Müşteri Hizmetleri</p>
          <ul className="mt-6 space-y-5 text-sm text-ink-800">
            <li className="flex items-start gap-3">
              <Mail size={16} strokeWidth={1.5} className="mt-1 text-rose-600" />
              <a href="mailto:hello@missbella.com" className="hover:text-rose-600">
                hello@missbella.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={16} strokeWidth={1.5} className="mt-1 text-rose-600" />
              <a href="tel:+908502221234" className="hover:text-rose-600">
                +90 850 222 12 34
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Instagram size={16} strokeWidth={1.5} className="mt-1 text-rose-600" />
              <a
                href="https://instagram.com/missbella"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-600"
              >
                @missbella
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} strokeWidth={1.5} className="mt-1 text-rose-600" />
              <span>
                Miss Bella Tasarım Atölyesi
                <br />
                İstanbul, Türkiye
              </span>
            </li>
          </ul>

          <div className="mt-8">
            <WhatsAppSupportButton context="iletisim formu" />
          </div>
        </article>

        <article className="border border-ink-900/10 bg-bone-50 p-8 shadow-card">
          <p className="luxe-label plain text-rose-600">Sık Sorulanlar</p>
          <dl className="mt-6 space-y-5 text-sm text-ink-800">
            <div>
              <dt className="font-medium text-ink-900">Siparişim ne zaman kargolanır?</dt>
              <dd className="mt-1 text-ink-700">
                Siparişler ortalama 1&ndash;3 iş günü içinde kargoya verilir.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink-900">İade nasıl yapılır?</dt>
              <dd className="mt-1 text-ink-700">
                Kullanılmamış ve hijyen etiketi korunmuş ürünler 14 gün içinde
                iade alınır. Detaylar için{" "}
                <a href="/iade-politikasi" className="text-rose-600 underline-offset-4 hover:underline">
                  iade politikası
                </a>{" "}
                sayfamızı inceleyin.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink-900">Kargo ücretsiz mi?</dt>
              <dd className="mt-1 text-ink-700">
                300 TL ve üzeri siparişlerde kargo ücretsizdir.
              </dd>
            </div>
          </dl>
        </article>
      </Container>
    </>
  );
}
