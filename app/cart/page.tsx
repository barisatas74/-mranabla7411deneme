import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Sepetim",
  description:
    "Miss Bella sepetinizdeki urunleri guncelleyin, kupon uygulayin ve siparis ozetinizi inceleyin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartView />;
}
