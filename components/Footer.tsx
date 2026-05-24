import Link from "next/link";
import {
  Facebook,
  Instagram,
  type LucideIcon,
  Youtube,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
} from "lucide-react";
import Container from "./Container";
import NewsletterForm from "./NewsletterForm";
import { CategoryNavItem } from "@/types";

const SOCIAL_LINKS: { Icon: LucideIcon; href: string; label: string }[] = [
  {
    Icon: Instagram,
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    label: "Instagram",
  },
  {
    Icon: Facebook,
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    label: "Facebook",
  },
  {
    Icon: Youtube,
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    label: "Youtube",
  },
].filter((item) => item.href !== "");

const fallbackCategoryLinks: CategoryNavItem[] = [
  { id: "sutyenler", name: "Sütyenler", slug: "sutyenler" },
  { id: "kulotlar", name: "Külotlar", slug: "kulotlar" },
  { id: "takimlar", name: "Takımlar", slug: "takimlar" },
  { id: "gecelikler", name: "Gecelikler", slug: "gecelikler" },
];

export default function Footer({
  initialCategoryNavItems = fallbackCategoryLinks,
}: {
  initialCategoryNavItems?: CategoryNavItem[];
}) {
  const categoryLinks =
    initialCategoryNavItems.length > 0
      ? initialCategoryNavItems
      : fallbackCategoryLinks;

  const shoppingLinks: [string, string][] = [
    ["Yeni Sezon", "/products?filter=new"],
    ["Tüm Ürünler", "/products"],
    ...categoryLinks
      .slice(0, 6)
      .map((category): [string, string] => [
        category.name,
        `/products?category=${category.slug}`,
      ]),
    ["İndirim", "/products?filter=sale"],
  ];

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-bone-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(238,42,139,0.10),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(255,82,168,0.08),transparent_48%)]" />

      {/* Trust badges üst şerit */}
      <div className="relative border-b border-white/8 bg-white/[0.02]">
        <Container className="grid gap-6 py-8 md:grid-cols-4 md:gap-4">
          <FooterTrust
            Icon={Truck}
            title="Ücretsiz Kargo"
            text="300 TL üzeri"
          />
          <FooterTrust
            Icon={RotateCcw}
            title="14 Gün İade"
            text="Koşulsuz iade hakkı"
          />
          <FooterTrust
            Icon={Lock}
            title="Güvenli Ödeme"
            text="SSL & 3D Secure"
          />
          <FooterTrust
            Icon={ShieldCheck}
            title="Premium Kalite"
            text="Türkiye üretimi"
          />
        </Container>
      </div>

      {/* Bülten */}
      <div className="relative border-b border-white/8">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
          <div>
            <span className="luxe-label plain !text-rose-300">Bülten</span>
            <h3 className="mt-4 font-display text-[36px] leading-[1.05] md:text-[52px]">
              Ayrıcalıklara
              <br />
              <span className="font-italic-display text-rose-300">
                ilk sizin
              </span>{" "}
              erişin.
            </h3>
            <p className="mt-4 max-w-md text-sm text-white/60 md:text-base">
              Yeni koleksiyonlar, özel kampanyalar ve butik deneyiminden
              haberdar olun. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </div>

          <NewsletterForm />
        </Container>
      </div>

      {/* Ana grid */}
      <Container className="grid gap-10 pb-10 pt-16 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-4">
          <span className="block font-display text-[34px] leading-none">
            Miss{" "}
            <span className="font-italic-display text-gradient-fuchsia">
              Bella
            </span>
          </span>
          <span className="mt-2 inline-block text-[10px] uppercase tracking-editorial text-rose-300">
            Zarafetin en özel hâli
          </span>
          <p className="mt-6 max-w-sm text-sm leading-[1.8] text-white/60">
            Premium kumaşlar, ince işçilik ve zamansız çizgilerle tasarlanan
            butik iç giyim koleksiyonu. Türkiye&apos;de özenle üretilir.
          </p>

          {SOCIAL_LINKS.length > 0 && (
            <div className="mt-7 flex items-center gap-3">
              {SOCIAL_LINKS.map((item) => (
                <SocialIcon
                  key={item.label}
                  Icon={item.Icon}
                  href={item.href}
                  label={item.label}
                />
              ))}
            </div>
          )}
        </div>

        <FooterColumn
          className="md:col-span-2"
          title="Alışveriş"
          links={shoppingLinks}
        />
        <FooterColumn
          className="md:col-span-2"
          title="Yardım"
          links={[
            ["Müşteri Hizmetleri", "/musteri-hizmetleri"],
            ["Sıkça Sorulanlar", "/sss"],
            ["Beden Tablosu", "/beden-tablosu"],
            ["Kargo & Teslimat", "/kargo-teslimat"],
            ["İade & Değişim", "/iade-politikasi"],
            ["İletişim", "/iletisim"],
          ]}
        />
        <FooterColumn
          className="md:col-span-2"
          title="Kurumsal"
          links={[
            ["Hakkımızda", "/hakkimizda"],
            ["Mesafeli Satış", "/mesafeli-satis"],
            ["KVKK Aydınlatma", "/kvkk"],
            ["Gizlilik Politikası", "/gizlilik"],
          ]}
        />

        <div className="md:col-span-2">
          <p className="mb-5 text-[10px] uppercase tracking-editorial text-rose-300">
            Güvenli Ödeme
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <PaymentBadge label="Visa" />
            <PaymentBadge label="Master" />
            <PaymentBadge label="Troy" />
            <PaymentBadge label="Amex" />
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-editorial text-white/60">
            <Lock size={11} strokeWidth={1.8} className="text-rose-300" />
            256-bit SSL
          </div>
        </div>
      </Container>

      {/* Alt copyright */}
      <div className="relative border-t border-white/8">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-[10px] uppercase tracking-editorial text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Miss Bella · Tüm hakları saklıdır</p>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="hover:text-white">
              Gizlilik
            </Link>
            <span className="opacity-40">·</span>
            <Link href="/kvkk" className="hover:text-white">
              KVKK
            </Link>
            <span className="opacity-40">·</span>
            <Link href="/mesafeli-satis" className="hover:text-white">
              Koşullar
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  className = "",
}: {
  title: string;
  links: [string, string][];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-5 text-[10px] uppercase tracking-editorial text-rose-300">
        {title}
      </p>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="inline-block text-sm text-white/70 transition-all duration-300 hover:pl-1 hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  Icon,
  href,
  label,
}: {
  Icon: LucideIcon;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:scale-110 hover:border-rose-300 hover:bg-rose-300/10 hover:text-rose-300"
    >
      <Icon strokeWidth={1.5} size={15} />
    </a>
  );
}

function PaymentBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/80">
      {label}
    </span>
  );
}

function FooterTrust({
  Icon,
  title,
  text,
}: {
  Icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-rose-300/20 bg-rose-300/5 text-rose-300">
        <Icon strokeWidth={1.5} size={16} />
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-white">
          {title}
        </p>
        <p className="text-[10px] tracking-wider text-white/50">{text}</p>
      </div>
    </div>
  );
}
