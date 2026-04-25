import type { Metadata } from "next";
import ProductDetailView from "@/components/products/ProductDetailView";
import { getProductBySlug } from "@/data/products";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({
  params,
}: ProductDetailPageProps): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Urun Bulunamadi",
      description: "Aradiginiz urun su an mevcut degil.",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0],
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
