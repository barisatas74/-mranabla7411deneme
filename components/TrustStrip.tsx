import Container from "./Container";
import { CheckCircle2, Lock, RotateCcw, Truck } from "lucide-react";

const items = [
  { Icon: Truck, label: "Ucretsiz Kargo", sub: "300 TL ve uzeri" },
  { Icon: RotateCcw, label: "14 Gun Iade", sub: "Hijyen kosulluyla" },
  { Icon: Lock, label: "Guvenli Odeme", sub: "256-bit SSL" },
  { Icon: CheckCircle2, label: "Turkiye Uretimi", sub: "Butik atolye" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-ink-900/8 bg-bone-50/80">
      <Container>
        <ul className="grid grid-cols-2 gap-y-4 py-5 md:grid-cols-4 md:py-6">
          {items.map(({ Icon, label, sub }) => (
            <li
              key={label}
              className="flex items-center justify-center gap-3 text-center md:justify-start md:text-left"
            >
              <Icon
                size={18}
                strokeWidth={1.4}
                className="flex-shrink-0 text-rose-600"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-medium uppercase tracking-editorial text-ink-900">
                  {label}
                </span>
                <span className="text-[10px] tracking-wider text-ink-600">
                  {sub}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
