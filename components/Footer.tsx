"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  type LucideIcon,
  Youtube,
} from "lucide-react";
import Container from "./Container";

const SOCIAL_LINKS: { Icon: LucideIcon; href: string; label: string }[] = [
  {
    Icon: Instagram,
    href:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://instagram.com/lunarosa",
    label: "Instagram",
  },
  {
    Icon: Facebook,
    href:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ||
      "https://facebook.com/lunarosa",
    label: "Facebook",
  },
  {
    Icon: Youtube,
    href:
      process.env.NEXT_PUBLIC_YOUTUBE_URL ||
      "https://youtube.com/@lunarosa",
    label: "Youtube",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValid) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  }

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-bone-50">
      <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-rose-600/10 blur-[140px]" />

      <div className="relative border-b border-white/8">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
          <div>
            <span className="luxe-label plain !text-rose-300">Bulten</span>
            <h3 className="mt-4 font-display text-[36px] leading-[1.05] md:text-[52px]">
              Ayricaliklara
              <br />
              <span className="font-italic-display text-rose-300">ilk sizin</span> erisin.
            </h3>
            <p className="mt-4 max-w-md text-sm text-white/60 md:text-base">
              Yeni koleksiyonlar, ozel kampanyalar ve butik deneyiminden haberdar olun.
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col items-stretch gap-0 border border-white/15 bg-white/5 transition focus-within:border-rose-300 sm:flex-row"
            >
              <div className="flex items-center pl-5 pr-3">
                <Mail className="text-rose-300" strokeWidth={1.5} size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="E-posta adresiniz"
                className="flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-rose-600 px-6 py-4 text-[11px] uppercase tracking-editorial text-white transition hover:bg-rose-700"
              >
                Abone Ol <ArrowRight strokeWidth={1.5} size={14} />
              </button>
            </form>
            {status === "success" && (
              <p className="mt-3 text-[11px] tracking-wider text-rose-300">
                Tesekkurler! Bultenimize basariyla abone oldunuz.
              </p>
            )}
            {status === "error" && (
              <p className="mt-3 text-[11px] tracking-wider text-rose-300">
                Lutfen gecerli bir e-posta adresi girin.
              </p>
            )}
          </div>
        </Container>
      </div>

      <Container className="grid gap-10 pb-10 pt-16 md:grid-cols-5 md:gap-14">
        <div className="md:col-span-2">
          <span className="block font-display text-[34px] leading-none">
            Luna <span className="font-italic-display text-rose-300">Rosa</span>
          </span>
          <span className="mt-2 inline-block text-[10px] uppercase tracking-editorial text-rose-300">
            Zarafetin en ozel hali
          </span>
          <p className="mt-6 max-w-sm text-sm leading-[1.8] text-white/60">
            Premium kumaslar, ince iscilik ve zamansiz cizgilerle tasarlanan butik ic giyim koleksiyonu.
          </p>

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
        </div>

        <FooterColumn
          title="Alisveris"
          links={[
            ["Yeni Sezon", "/products?filter=new"],
            ["Tum Urunler", "/products"],
            ["Sutyenler", "/products?category=sutyenler"],
            ["Gecelikler", "/products?category=gecelikler"],
            ["Indirim", "/products?filter=sale"],
          ]}
        />
        <FooterColumn
          title="Kurumsal"
          links={[
            ["Hakkimizda", "/hakkimizda"],
            ["Iletisim", "/iletisim"],
          ]}
        />
        <FooterColumn
          title="Yardim"
          links={[
            ["Iade Politikasi", "/iade-politikasi"],
            ["Mesafeli Satis", "/mesafeli-satis"],
            ["KVKK Aydinlatma", "/kvkk"],
            ["Gizlilik", "/gizlilik"],
          ]}
        />
      </Container>

      <div className="border-t border-white/8">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-[10px] uppercase tracking-editorial text-white/50 md:flex-row">
          <p>© MMXXVI Luna Rosa / Tum haklari saklidir</p>
          <div className="flex items-center gap-4">
            <Link href="/gizlilik" className="hover:text-white">
              Gizlilik
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/kvkk" className="hover:text-white">
              KVKK
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/mesafeli-satis" className="hover:text-white">
              Kosullar
            </Link>
          </div>
          <div className="flex items-center gap-3 tracking-wider">
            <span>Visa</span>
            <span className="opacity-40">/</span>
            <span>Mastercard</span>
            <span className="opacity-40">/</span>
            <span>Troy</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-rose-300 hover:bg-rose-300/5 hover:text-rose-300"
    >
      <Icon strokeWidth={1.5} size={15} />
    </a>
  );
}
