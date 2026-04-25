import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { categories } from "@/data/categories";
import { ArrowUpRight } from "lucide-react";

export default function CategoryShowcase() {
  return (
    <section className="py-24 md:py-32 bg-bone-50 relative">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div className="max-w-xl">
            <span className="luxe-label">La Collection</span>
            <h2 className="font-display text-[42px] md:text-[68px] leading-[1.02] text-ink-900 mt-5">
              Her an için
              <br />
              <span className="font-italic-display text-rose-600">zarafet</span>.
            </h2>
          </div>
          <div className="md:max-w-sm">
            <p className="text-ink-700 leading-relaxed font-light">
              Özenle seçilmiş kumaşlar, hassas detaylar ve zamansız siluetlerle
              tasarlanan koleksiyonlarımızda kendinize özel parçaları keşfedin.
            </p>
            <Link href="/products" className="btn-link mt-5 text-ink-900">
              Tümünü Keşfet <ArrowUpRight strokeWidth={1.5} size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-5">
          {categories.map((c, i) => {
            const layout = [
              "md:col-span-5 md:row-span-2 aspect-[3/4] md:aspect-auto md:min-h-[620px]",
              "md:col-span-4 aspect-[4/5]",
              "md:col-span-3 aspect-[3/4]",
              "md:col-span-3 aspect-[3/4]",
              "md:col-span-4 aspect-[4/5]",
              "md:col-span-5 aspect-[4/5]",
            ];
            return (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className={`group relative overflow-hidden bg-ink-950 ${layout[i] || "aspect-square"}`}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.06] opacity-95 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
                <div className="absolute inset-0 bg-rose-900/0 group-hover:bg-rose-900/10 transition duration-700" />

                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="w-8 h-px bg-white/60" />
                  <span className="text-[10px] tracking-editorial uppercase text-white/80">
                    N° {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                  <ArrowUpRight strokeWidth={1.5} size={16} className="text-ink-900" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  {c.tagline && (
                    <span className="text-[10px] tracking-editorial uppercase text-powder-200/90 block">
                      {c.tagline}
                    </span>
                  )}
                  <h3 className="font-display text-[28px] md:text-[36px] mt-1.5 leading-tight">
                    {c.name}
                  </h3>
                  <span className="inline-flex items-center gap-2 mt-3 text-[11px] tracking-editorial uppercase text-white/85 group-hover:text-powder-200 transition">
                    <span className="w-6 h-px bg-current transition-all duration-500 group-hover:w-10" />
                    Keşfet
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
