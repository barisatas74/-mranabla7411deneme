import Link from "next/link";
import Container from "./Container";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedProducts() {
  const items = getFeaturedProducts();

  return (
    <section className="py-24 md:py-32 bg-bone-100/60 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[-50%]">
        <div className="divider-ornament">
          <span>✦</span>
        </div>
      </div>

      <Container>
        <div className="text-center mb-14 md:mb-20">
          <span className="luxe-label">Les Favoris</span>
          <h2 className="font-display text-[42px] md:text-[64px] leading-[1.05] text-ink-900 mt-5">
            Sezonun{" "}
            <span className="font-italic-display text-rose-600">en çok</span>
            <br className="md:hidden" /> beğenilenleri
          </h2>
          <p className="text-ink-700 mt-5 max-w-md mx-auto font-light leading-relaxed">
            Müşterilerimizin gönlüne dokunmuş, editörlerimizin özenle seçtiği
            imza parçalar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-16 md:mt-20 text-center">
          <Link href="/products" className="btn-luxe btn-luxe-outline">
            Tüm Ürünleri Gör <ArrowUpRight strokeWidth={1.5} size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
