import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Sepetim",
  description:
    "Miss Bella sepetinizdeki ürünleri güncelleyin, kupon uygulayın ve sipariş özetinizi inceleyin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartView />;
}
