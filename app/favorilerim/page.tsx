import { productService } from "@/lib/services/server";
import FavoritesView from "@/components/FavoritesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Favorilerim",
  description: "Beğendiğiniz Miss Bella ürünleri burada saklanır.",
};

export default async function FavoritesPage() {
  const products = await productService.list().catch(() => []);
  return <FavoritesView products={products} />;
}
