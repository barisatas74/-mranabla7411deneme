"use client";

import { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "./Container";

type Testimonial = {
  name: string;
  city: string;
  rating: number;
  text: string;
  product: string;
  date: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Elif K.",
    city: "İstanbul",
    rating: 5,
    text: "Kumaş kalitesi gerçekten çok iyi, dantel detayları zarif. Tam beden uyumu sağladı, tavsiye ederim.",
    product: "Rosa Dantel Sütyen Takımı",
    date: "Mart 2026",
  },
  {
    name: "Zeynep A.",
    city: "Ankara",
    rating: 5,
    text: "Sade ama zarif bir tasarım. Kumaşı ipeksi, gün boyu rahat hissettiriyor. Paketleme çok özenliydi.",
    product: "Soft Touch Bralette",
    date: "Şubat 2026",
  },
  {
    name: "Merve T.",
    city: "İzmir",
    rating: 5,
    text: "Özel günler için almıştım, kumaş ve dikiş işçiliği çok kaliteli. Tekrar sipariş vereceğim.",
    product: "İpek Saten Gecelik",
    date: "Şubat 2026",
  },
  {
    name: "Cansu B.",
    city: "Bursa",
    rating: 4,
    text: "Hızlı kargo ve şık paketleme. Renk fotoğraftaki gibi geldi, beden tablosu doğru bilgi verdi.",
    product: "Klasik Brazilian Külot",
    date: "Ocak 2026",
  },
  {
    name: "Ayşe D.",
    city: "Antalya",
    rating: 5,
    text: "Dantel detayları gerçekten butik bir iş. Hem konforlu hem zarif. İade koşulları da net açık.",
    product: "Dantel Detaylı Body",
    date: "Ocak 2026",
  },
  {
    name: "Selin M.",
    city: "İstanbul",
    rating: 5,
    text: "Pijama takımımdan çok memnunum. Saten dokunuşu çok yumuşak, ev rahatlığını butik bir doku ile birleştirmiş.",
    product: "Şortlu Pijama Takımı",
    date: "Aralık 2025",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  }

  function next() {
    setIndex((current) => (current + 1) % testimonials.length);
  }

  const visible = [
    testimonials[index],
    testimonials[(index + 1) % testimonials.length],
    testimonials[(index + 2) % testimonials.length],
  ];

  return (
    <section className="bg-bone-50 py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="luxe-label">Mektuplarınızdan</span>
            <h2 className="mt-4 font-display text-[36px] leading-[1.05] text-ink-900 md:text-[56px]">
              Müşterilerimizin{" "}
              <span className="font-italic-display text-gradient-fuchsia">notları</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-700 md:text-base">
              Gerçek doğrulanmış siparişlerden gelen yorumlar. Markamızı seçtiğiniz
              için teşekkür ederiz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Önceki yorum"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center border border-ink-900/15 text-ink-700 transition hover:border-rose-600 hover:text-rose-600"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Sonraki yorum"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center border border-ink-900/15 text-ink-700 transition hover:border-rose-600 hover:text-rose-600"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {visible.map((item, i) => (
            <article
              key={`${item.name}-${i}`}
              className="relative flex flex-col gap-5 border border-ink-900/8 bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-soft"
            >
              <Quote
                size={28}
                strokeWidth={1.2}
                className="text-rose-600/40"
                aria-hidden="true"
              />

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={13}
                    strokeWidth={1.4}
                    className={
                      starIndex < item.rating
                        ? "fill-rose-600 text-rose-600"
                        : "text-ink-300"
                    }
                  />
                ))}
              </div>

              <p className="font-italic-display text-[20px] leading-[1.5] text-ink-900">
                &ldquo;{item.text}&rdquo;
              </p>

              <div className="mt-auto border-t border-ink-900/8 pt-4">
                <p className="font-display text-base text-ink-900">{item.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-editorial text-ink-600">
                  {item.city} · {item.date}
                </p>
                <p className="mt-2 text-[11px] tracking-wide text-rose-600">
                  ✓ Doğrulanmış Alışveriş · {item.product}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Yorum ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-300 ${
                i === index ? "w-8 bg-rose-600" : "w-3 bg-ink-900/15"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
