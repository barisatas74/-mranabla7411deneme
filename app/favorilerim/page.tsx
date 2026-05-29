import FavoritesView from "@/components/FavoritesView";
import { getStorefrontProducts } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Favorilerim",
  description: "Beğendiğiniz Miss Bella ürünleri burada saklanır.",
};

export default async function FavoritesPage() {
  const products = await getStorefrontProducts();
  return <FavoritesView products={products} />;
}
