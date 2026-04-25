import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
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
  "https://www.lunarosa.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luna Rosa | Premium Ic Giyim Koleksiyonu",
    template: "%s | Luna Rosa",
  },
  description:
    "Luna Rosa; premium ic giyim, gecelik ve butik koleksiyonlarini modern e-ticaret deneyimiyle sunar.",
  applicationName: "Luna Rosa",
  keywords: [
    "luna rosa",
    "ic giyim",
    "sutyen",
    "gecelik",
    "butik koleksiyon",
    "kadin ic giyim",
  ],
  openGraph: {
    title: "Luna Rosa | Premium Ic Giyim Koleksiyonu",
    description:
      "Premium ic giyim, gecelik ve takim koleksiyonlarini Luna Rosa vitriniyle kesfedin.",
    url: SITE_URL,
    siteName: "Luna Rosa",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Rosa",
    description:
      "Premium ic giyim, gecelik ve takim koleksiyonlarini Luna Rosa vitriniyle kesfedin.",
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
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
