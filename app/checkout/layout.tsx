import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ödeme",
  description:
    "Müşteri bilgileri, kargo seçimi ve sipariş özeti ile Miss Bella siparişinizi tamamlayın.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
