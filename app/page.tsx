import type { Metadata } from "next";
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import TrustStrip from "@/components/TrustStrip";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestSellers from "@/components/BestSellers";
import NewSeason from "@/components/NewSeason";
import Lookbook from "@/components/Lookbook";
import CampaignBanner from "@/components/CampaignBanner";
import BrandStory from "@/components/BrandStory";
import Testimonials from "@/components/Testimonials";
import InstagramGallery from "@/components/InstagramGallery";
import TrustBadges from "@/components/TrustBadges";

export const metadata: Metadata = {
  title: "Anasayfa",
  description:
    "Miss Bella anasayfasinda premium ic giyim koleksiyonlari, yeni sezon secimleri ve one cikan urunleri kesfedin.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryShowcase />
      <TrustStrip />
      <FeaturedProducts />
      <BestSellers />
      <NewSeason />
      <Lookbook />
      <CampaignBanner />
      <BrandStory />
      <Testimonials />
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
