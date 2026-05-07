import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import AppChrome from "@/components/AppChrome";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.missbella.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Miss Bella | Premium İç Giyim Koleksiyonu",
    template: "%s | Miss Bella",
  },
  description:
    "Miss Bella; premium iç giyim, gecelik ve butik koleksiyonlarını modern e-ticaret deneyimiyle sunar.",
  applicationName: "Miss Bella",
  keywords: [
    "miss bella",
    "iç giyim",
    "sütyen",
    "gecelik",
    "butik koleksiyon",
    "kadın iç giyim",
  ],
  openGraph: {
    title: "Miss Bella | Premium İç Giyim Koleksiyonu",
    description:
      "Premium iç giyim, gecelik ve takım koleksiyonlarını Miss Bella vitriniyle keşfedin.",
    url: SITE_URL,
    siteName: "Miss Bella",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miss Bella",
    description:
      "Premium iç giyim, gecelik ve takım koleksiyonlarını Miss Bella vitriniyle keşfedin.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#ee2a8b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <WishlistProvider>
            <AppChrome>{children}</AppChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
