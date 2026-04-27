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
    city: "Istanbul",
    rating: 5,
    text: "Kumas kalitesi gercekten cok iyi, dantel detaylari zarif. Tam beden uyumu sagladi, tavsiye ederim.",
    product: "Rosa Dantel Sutyen Takimi",
    date: "Mart 2026",
  },
  {
    name: "Zeynep A.",
    city: "Ankara",
    rating: 5,
    text: "Sade ama zarif bir tasarim. Kumasi ipeksi, gun boyu rahat hissettiriyor. Paketleme cok ozenliydi.",
    product: "Soft Touch Bralette",
    date: "Subat 2026",
  },
  {
    name: "Merve T.",
    city: "Izmir",
    rating: 5,
    text: "Ozel gunler icin almistim, kumas ve dikis isciligi cok kaliteli. Tekrar siparis verecegim.",
    product: "Ipek Saten Gecelik",
    date: "Subat 2026",
  },
  {
    name: "Cansu B.",
    city: "Bursa",
    rating: 4,
    text: "Hizli kargo ve sik paketleme. Renk fotograftaki gibi geldi, beden tablosu dogru bilgi verdi.",
    product: "Klasik Brazilian Kulot",
    date: "Ocak 2026",
  },
  {
    name: "Ayse D.",
    city: "Antalya",
    rating: 5,
    text: "Dantel detaylari gercekten butik bir is. Hem konforlu hem zarif. Iade kosullari da net acik.",
    product: "Dantel Detayli Body",
    date: "Ocak 2026",
  },
  {
    name: "Selin M.",
    city: "Istanbul",
    rating: 5,
    text: "Pijama takimimden cok memnunum. Saten dokunusu cok yumusak, ev rahatligini buton bir doku ile birlestirmis.",
    product: "Sortlu Pijama Takimi",
    date: "Aralik 2025",
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
            <span className="luxe-label">Mektuplarinizdan</span>
            <h2 className="mt-4 font-display text-[36px] leading-[1.05] text-ink-900 md:text-[56px]">
              Musterilerimizin{" "}
              <span className="font-italic-display text-rose-600">notlari</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-700 md:text-base">
              Gercek dogrulanmis siparislerden gelen yorumlar. Markamizi sectiginiz
              icin tesekkur ederiz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Onceki yorum"
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
                  ✓ Dogrulanmis Alisveris · {item.product}
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
