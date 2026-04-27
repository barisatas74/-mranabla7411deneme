import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Odeme",
  description:
    "Musteri bilgileri, kargo secimi ve siparis ozeti ile Miss Bella siparisinizi tamamlayin.",
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
