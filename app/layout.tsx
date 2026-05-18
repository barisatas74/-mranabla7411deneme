import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import AppChrome from "@/components/AppChrome";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { categoryService, productService } from "@/lib/services/server";
import { getCurrentUser } from "@/lib/actions/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Premium İç Giyim Koleksiyonu`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "miss bella",
    "iç giyim",
    "sütyen",
    "külot",
    "gecelik",
    "takım",
    "butik koleksiyon",
    "kadın iç giyim",
    "premium iç giyim",
    "Fransız danteli",
    "premium dantel",
    "rahat iç giyim",
    "bralette",
  ],
  category: "shopping",
  openGraph: {
    title: `${SITE.name} | Premium İç Giyim Koleksiyonu`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    site: SITE.twitter,
    creator: SITE.twitter,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#ee2a8b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, products, currentUser] = await Promise.all([
    categoryService.list().catch(() => []),
    productService.list().catch(() => []),
    getCurrentUser().catch(() => null),
  ]);

  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body className="antialiased">
        <CartProvider>
          <WishlistProvider>
            <AppChrome
              categories={categories}
              products={products}
              currentUser={currentUser}
            >
              {children}
            </AppChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
