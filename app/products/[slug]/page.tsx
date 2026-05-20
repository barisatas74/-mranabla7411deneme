import type { Metadata } from "next";
import ProductDetailView from "@/components/products/ProductDetailView";
import {
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/storefront-data";
import { notFound } from "next/navigation";

async function loadProductData(slug: string) {
  const [products, categories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);
  return {
    product: products.find((item) => item.slug === slug) ?? null,
    products,
    categories,
  };
}

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getStorefrontProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await loadProductData(slug);

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
      images: product.images[0]
        ? [
            {
              url: product.images[0],
              alt: product.name,
            },
          ]
        : [],
    },
  };
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.missbellalingree.com";

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const { product, products, categories } = await loadProductData(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id.toUpperCase(),
    brand: { "@type": "Brand", name: "Miss Bella" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView
        product={product}
        allProducts={relatedProducts}
        categories={categories}
      />
    </>
  );
}
