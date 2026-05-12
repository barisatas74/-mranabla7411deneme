import Link from "next/link";
import Container from "./Container";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { ArrowUpRight, Crown } from "lucide-react";
import { Product } from "@/types";

export default function BestSellers({ products }: { products: Product[] }) {
  const items = [...products]
    .filter((product) => product.stock > 0)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="bg-bone-50 py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="luxe-label inline-flex items-center gap-2">
              <Crown size={12} strokeWidth={1.5} className="text-rose-600" />
              Best Sellers
            </span>
            <h2 className="mt-4 font-display text-[36px] leading-[1.05] text-ink-900 md:text-[56px]">
              Çok{" "}
              <span className="font-italic-display text-gradient-fuchsia">satanlar</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-700 md:text-base">
              Bu sezonun en çok tercih edilen parçaları. Sınırlı stok ile devam
              eden favorilerimiz.
            </p>
          </div>

          <Link
            href="/products?sort=featured"
            className="inline-flex items-center gap-2 self-start text-[10px] uppercase tracking-editorial text-ink-700 transition hover:text-rose-600 md:self-auto"
          >
            Tüm favoriler <ArrowUpRight strokeWidth={1.5} size={13} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
          {items.map((product, index) => (
            <Reveal key={product.id} variant="up" delay={index * 70} className="relative">
              <span className="absolute -top-3 left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-gradient font-display text-[13px] text-white shadow-luxe">
                {index + 1}
              </span>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
