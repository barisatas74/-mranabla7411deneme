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
    default: "Miss Bella | Premium Ic Giyim Koleksiyonu",
    template: "%s | Miss Bella",
  },
  description:
    "Miss Bella; premium ic giyim, gecelik ve butik koleksiyonlarini modern e-ticaret deneyimiyle sunar.",
  applicationName: "Miss Bella",
  keywords: [
    "miss bella",
    "ic giyim",
    "sutyen",
    "gecelik",
    "butik koleksiyon",
    "kadin ic giyim",
  ],
  openGraph: {
    title: "Miss Bella | Premium Ic Giyim Koleksiyonu",
    description:
      "Premium ic giyim, gecelik ve takim koleksiyonlarini Miss Bella vitriniyle kesfedin.",
    url: SITE_URL,
    siteName: "Miss Bella",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miss Bella",
    description:
      "Premium ic giyim, gecelik ve takim koleksiyonlarini Miss Bella vitriniyle kesfedin.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#fcfaf7",
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
