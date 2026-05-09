import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import {
  HelpCircle,
  Truck,
  RotateCcw,
  Ruler,
  CreditCard,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Müşteri Hizmetleri",
  description:
    "Miss Bella müşteri hizmetleri merkezine hoş geldiniz. Sıkça sorulanlar, kargo takibi, iade ve destek için tek noktadan erişim.",
};

const helpLinks = [
  {
    href: "/sss",
    icon: HelpCircle,
    title: "Sıkça Sorulan Sorular",
    desc: "En sık karşılaşılan soruların cevapları kategoriler hâlinde",
  },
  {
    href: "/kargo-teslimat",
    icon: Truck,
    title: "Kargo & Teslimat",
    desc: "Kargo süreleri, ücretler ve takip bilgileri",
  },
  {
    href: "/iade-politikasi",
    icon: RotateCcw,
    title: "İade & Değişim",
    desc: "14 günlük iade süreciniz ve koşulları",
  },
  {
    href: "/beden-tablosu",
    icon: Ruler,
    title: "Beden Tablosu",
    desc: "Doğru bedeni seçmeniz için detaylı ölçü tabloları",
  },
  {
    href: "/mesafeli-satis",
    icon: CreditCard,
    title: "Mesafeli Satış Sözleşmesi",
    desc: "Sipariş öncesi onay verdiğiniz yasal sözleşme metni",
  },
  {
    href: "/kvkk",
    icon: ShieldCheck,
    title: "KVKK & Gizlilik",
    desc: "Kişisel verilerinizin nasıl işlendiğine dair bilgi",
  },
];

export default function MusteriHizmetleriPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Müşteri Hizmetleri" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-20">
        <Container className="text-center">
          <span className="luxe-label">Yardım Merkezi</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[64px]">
            Müşteri{" "}
            <span className="font-italic-display text-gradient-fuchsia">
              Hizmetleri
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-700">
            Aradığınız bilgi tek tıkla. Cevap bulamadığınız her şey için
            iletişim kanallarımız açık.
          </p>
        </Container>
      </section>

      <Container className="max-w-5xl py-14 md:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {helpLinks.map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-ink-900/10 bg-bone-50 p-6 transition hover:-translate-y-1 hover:border-rose-600/30 hover:shadow-card"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-powder-100 to-powder-200 text-rose-600 transition group-hover:from-rose-300 group-hover:to-rose-500 group-hover:text-white">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg text-ink-900 group-hover:text-rose-600">
                {title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-ink-700">
                {desc}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-rose-400 p-8 md:p-12 text-white">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md">
              <Mail size={28} strokeWidth={1.5} className="mb-3" />
              <h3 className="font-display text-2xl md:text-3xl">
                Hâlâ yardıma ihtiyacınız var mı?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                Müşteri hizmetleri ekibimiz hafta içi 09:00–18:00 arasında
                taleplerinizi karşılamak için hazır.
              </p>
            </div>
            <Link
              href="/iletisim"
              className="btn-luxe bg-white text-rose-600 transition hover:bg-bone-50"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
