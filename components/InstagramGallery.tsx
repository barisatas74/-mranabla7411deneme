import Image from "next/image";
import Container from "./Container";
import { Instagram } from "lucide-react";

const shots = [
  "photo-1617019114583-affb34d1b3cd",
  "photo-1583515558997-83406f8e024e",
  "photo-1606902965551-dce093cda6e7",
  "photo-1617922001439-4a2e6562f328",
  "photo-1594224457860-23bdb45f8b59",
  "photo-1571019613454-1cb2f99b2d8b",
];

const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/lunarosa";

export default function InstagramGallery() {
  return (
    <section className="bg-bone-100/60 py-24 md:py-32">
      <Container>
        <div className="mb-12 text-center md:mb-16">
          <span className="luxe-label">@lunarosa</span>
          <h2 className="mt-5 font-display text-[38px] leading-[1.05] text-ink-900 md:text-[58px]">
            <span className="font-italic-display text-rose-600">Instagram</span>
            &apos;da biz
          </h2>
          <p className="mt-4 font-light text-ink-700">
            Etiketleyin, birlikte paylasalim.
            {" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 underline-offset-4 hover:underline"
            >
              #lunarosamoment
            </a>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 md:grid-cols-6 md:gap-2.5">
          {shots.map((id, index) => (
            <a
              key={id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-ink-950"
            >
              <Image
                src={`https://images.unsplash.com/${id}?w=600&q=85`}
                alt={`Instagram gorseli ${index + 1}`}
                fill
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 transition duration-500 group-hover:bg-ink-950/55">
                <div className="flex flex-col items-center gap-2 opacity-0 transition duration-500 group-hover:opacity-100">
                  <Instagram strokeWidth={1.4} className="text-white" size={22} />
                  <span className="text-[9px] uppercase tracking-editorial text-white/90">
                    No {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#"
            className="btn-link inline-flex items-center gap-2 text-ink-900"
          >
            <Instagram strokeWidth={1.5} size={14} />
            Bizi Takip Edin
          </a>
        </div>
      </Container>
    </section>
  );
}
