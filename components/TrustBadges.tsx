import Container from "./Container";
import {
  CreditCard,
  HeartHandshake,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const badges = [
  {
    Icon: ShieldCheck,
    title: "Güvenli Ödeme",
    text: "256-bit SSL şifreleme ve korumalı ödeme deneyimi.",
  },
  {
    Icon: Truck,
    title: "Hızlı Kargo",
    text: "Aynı gün çıkış ve 1-3 iş gününde teslimat planlaması.",
  },
  {
    Icon: RotateCcw,
    title: "Kolay İade",
    text: "14 gün iade ve ihtiyaç halinde değişim desteği.",
  },
  {
    Icon: HeartHandshake,
    title: "Özel Hizmet",
    text: "WhatsApp üzerinden hızlı ürün ve beden danışmanlığı.",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-ink-900/8 bg-bone-50 py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
          {badges.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="group flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition-colors duration-500 group-hover:border-rose-600 group-hover:text-rose-600">
                <Icon strokeWidth={1.4} size={18} />
              </div>
              <p className="mt-4 font-display text-[22px] leading-tight text-ink-900">
                {title}
              </p>
              <p className="mt-2 max-w-[220px] text-[12.5px] leading-[1.7] text-ink-700">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-ink-900/8 pt-8 text-[10px] uppercase tracking-editorial text-ink-600 md:flex-row">
          <div className="flex items-center gap-2">
            <CreditCard strokeWidth={1.4} size={14} className="text-rose-600" />
            Visa · Mastercard · Troy · Havale/EFT · Kapıda Ödeme
          </div>
          <div className="flex items-center gap-2">
            <Sparkles strokeWidth={1.4} size={14} className="text-rose-600" />
            300 TL ve üzeri siparişlerde ücretsiz kargo
          </div>
        </div>
      </Container>
    </section>
  );
}
