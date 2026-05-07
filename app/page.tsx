import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import TrustStrip from "@/components/TrustStrip";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestSellers from "@/components/BestSellers";
import ComingSoon from "@/components/ComingSoon";
import BrandStory from "@/components/BrandStory";
import TrustBadges from "@/components/TrustBadges";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Anasayfa",
  description:
    "Miss Bella anasayfasında premium iç giyim koleksiyonları, yeni sezon seçimleri ve öne çıkan ürünleri keşfedin.",
};

export default function HomePage() {
  const hasProducts = products.length > 0;

  return (
    <>
      <Hero />
      <Marquee />
      {hasProducts ? (
        <>
          <CategoryShowcase />
          <TrustStrip />
          <FeaturedProducts />
          <BestSellers />
        </>
      ) : (
        <>
          <ComingSoon />
          <TrustStrip />
        </>
      )}
      <BrandStory />
      <TrustBadges />
    </>
  );
}

function Marquee() {
  const words = [
    "Fransız Danteli",
    "Saf İpek",
    "El İşçiliği",
    "Premium Kumaş",
    "Etik Üretim",
    "Zamansız Tasarım",
  ];

  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-ink-950 py-6 text-bone-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(238,42,139,0.25)_0%,transparent_60%)]" />
      <div className="relative flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, repeatIndex) => (
          <div key={repeatIndex} className="flex">
            {words.map((word, index) => (
              <span
                key={`${repeatIndex}-${index}`}
                className="flex items-center gap-8 px-8 font-italic-display text-2xl text-white/90 md:text-4xl"
              >
                {word}
                <span className="font-display text-sm not-italic text-rose-300">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
