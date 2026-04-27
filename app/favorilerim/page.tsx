"use client";

import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/components/WishlistContext";
import { products } from "@/data/products";
import { Heart, ArrowRight } from "lucide-react";

export default function FavoritesPage() {
  const { ids, isHydrated } = useWishlist();

  if (!isHydrated) {
    return (
      <>
        <Breadcrumb items={[{ label: "Favorilerim" }]} />
        <Container className="py-20 md:py-24">
          <div className="mx-auto max-w-2xl animate-pulse space-y-4">
            <div className="h-8 w-48 bg-bone-100" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="h-72 bg-bone-100" />
              <div className="h-72 bg-bone-100" />
              <div className="h-72 bg-bone-100" />
            </div>
          </div>
        </Container>
      </>
    );
  }

  const favoriteProducts = products.filter((product) => ids.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "Favorilerim" }]} />
        <Container className="py-20 md:py-28">
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border border-ink-900/15">
              <Heart strokeWidth={1.2} size={26} className="text-rose-600" />
            </div>
            <span className="luxe-label">Favoris</span>
            <h1 className="mt-5 font-display text-[42px] leading-[1.05] text-ink-900 md:text-[64px]">
              Henuz{" "}
              <span className="font-italic-display text-rose-600">favori</span>{" "}
              yok
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-700 md:text-base">
              Begendiginiz urunlerdeki kalp ikonuna basarak favorilerinize
              ekleyebilirsiniz.
            </p>
            <Link href="/products" className="btn-luxe btn-luxe-dark mt-8 shadow-soft">
              Koleksiyonu Kesfet <ArrowRight strokeWidth={1.5} size={14} />
            </Link>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Favorilerim" }]} />
      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-10 text-center md:py-14">
        <Container>
          <span className="luxe-label">Mes Favoris</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[60px]">
            Favorilerim
          </h1>
          <p className="mt-3 text-sm text-ink-700">
            {favoriteProducts.length} urun listenizde
          </p>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </>
  );
}
