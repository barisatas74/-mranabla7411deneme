import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewSeason from "@/components/NewSeason";
import CampaignBanner from "@/components/CampaignBanner";
import BrandStory from "@/components/BrandStory";
import InstagramGallery from "@/components/InstagramGallery";
import TrustBadges from "@/components/TrustBadges";

export const metadata: Metadata = {
  title: "Anasayfa",
  description:
    "Luna Rosa anasayfasinda premium ic giyim koleksiyonlari, yeni sezon secimleri ve one cikan urunleri kesfedin.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryShowcase />
      <FeaturedProducts />
      <NewSeason />
      <CampaignBanner />
      <BrandStory />
      <TrustBadges />
      <InstagramGallery />
    </>
  );
}

function Marquee() {
  const words = [
    "Fransiz Danteli",
    "Saf Ipek",
    "El Isciligi",
    "Premium Kumas",
    "Etik Uretim",
    "Zamansiz Tasarim",
  ];

  return (
    <div className="overflow-hidden border-y border-white/5 bg-ink-950 py-6 text-bone-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, repeatIndex) => (
          <div key={repeatIndex} className="flex">
            {words.map((word, index) => (
              <span
                key={`${repeatIndex}-${index}`}
                className="flex items-center gap-8 px-8 font-italic-display text-2xl text-white/85 md:text-4xl"
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
