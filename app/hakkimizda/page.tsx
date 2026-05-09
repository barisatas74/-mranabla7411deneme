import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import { Heart, Award, Sparkles, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Miss Bella; premium iç giyim, gecelik ve butik koleksiyonlarıyla zarafeti günlük konfora dokunan butik bir markadır. Marka hikayemizi keşfedin.",
};

const values = [
  {
    icon: Heart,
    title: "Tutku ile Tasarım",
    text: "Her koleksiyonu kadının kendine olan saygısına ve estetik anlayışına saygıyla tasarlıyoruz.",
  },
  {
    icon: Award,
    title: "Kalite Odaklı Üretim",
    text: "Premium kumaşlar, hassas dikiş ve dayanıklı malzemelerle uzun ömürlü ürünler.",
  },
  {
    icon: Sparkles,
    title: "Detayda Mükemmellik",
    text: "Dantelden astara, ilik düğmesinden etiketine kadar her detay özenle seçilir.",
  },
  {
    icon: ShieldCheck,
    title: "Etik Üretim",
    text: "Adil çalışma koşulları, yerel üretim ve sorumlu tedarik zinciri ilkemizdir.",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Hakkımızda" }]} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-900/8 bg-gradient-to-b from-powder-100 via-bone-50 to-powder-50 py-16 md:py-28">
        <div className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-rose-300/25 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-rose-400/20 blur-[140px]" />
        <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-italic-display text-[280px] leading-none text-rose-600/[0.05] md:block">
          Bella
        </span>

        <Container className="relative">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <span className="luxe-label">Marka Hikayemiz</span>
            <h1 className="mt-5 font-display text-[44px] leading-[1.02] text-ink-900 md:text-[80px]">
              Zarafetin{" "}
              <span className="font-italic-display text-gradient-fuchsia">
                modern
              </span>
              <br className="md:hidden" /> yorumu
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base font-light leading-[1.85] text-ink-700">
              Miss Bella; premium kumaşlar, hassas işçilik ve zamansız
              çizgileri bir araya getiren butik bir iç giyim markasıdır. Her
              parça, kadının her anına eşlik edecek konfor ve zarafet için
              tasarlanır.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Manifesto */}
      <section className="border-b border-ink-900/8 bg-bone-50 py-20 md:py-28">
        <Container className="max-w-4xl">
          <Reveal variant="up" className="text-center">
            <span className="luxe-label">Manifesto</span>
            <p className="mx-auto mt-6 max-w-2xl font-italic-display text-2xl leading-[1.5] text-ink-900 md:text-3xl">
              &ldquo;Kadın, kendini iyi hissettiği anda en güçlü hâlindedir.
              Biz, bu hissin bir parçası olmak için varız.&rdquo;
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Vizyon & Misyon */}
      <section className="border-b border-ink-900/8 bg-bone-50 py-20 md:py-28">
        <Container className="max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal variant="up">
              <span className="luxe-label">Vizyonumuz</span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-ink-900 md:text-4xl">
                Konforun zarif{" "}
                <span className="font-italic-display text-gradient-fuchsia">
                  buluşması
                </span>
              </h2>
              <p className="mt-5 text-[15px] font-light leading-[1.85] text-ink-700">
                Kadının günlük ritüeline eşlik eden, kendini iyi hissettiren
                parçalar tasarlamak. İç giyimi sadece bir ihtiyaç olarak değil;
                konfor, öz güven ve estetik dengesinin parçası olarak
                konumlandırmak.
              </p>
            </Reveal>

            <Reveal variant="up" delay={150}>
              <span className="luxe-label">Misyonumuz</span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-ink-900 md:text-4xl">
                Premium kalitede{" "}
                <span className="font-italic-display text-gradient-fuchsia">
                  yerel üretim
                </span>
              </h2>
              <p className="mt-5 text-[15px] font-light leading-[1.85] text-ink-700">
                Türkiye&apos;nin deneyimli atölyeleriyle çalışarak adil ücret,
                kaliteli kumaş ve özenli işçilik üçgeninde sürdürülebilir bir
                marka kurmak. Her parçayı, müşterimize yıllarca eşlik edebilecek
                bir yatırım olarak sunmak.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Değerler */}
      <section className="border-b border-ink-900/8 bg-gradient-to-b from-bone-50 to-powder-50 py-20 md:py-28">
        <Container className="max-w-6xl">
          <Reveal variant="up" className="text-center">
            <span className="luxe-label">Değerlerimiz</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink-900 md:text-5xl">
              Bizi{" "}
              <span className="font-italic-display text-gradient-fuchsia">
                biz
              </span>{" "}
              yapan ilkeler
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} variant="up" delay={i * 80}>
                <div className="group h-full rounded-2xl border border-ink-900/10 bg-bone-50 p-6 transition hover:-translate-y-1 hover:border-rose-600/30 hover:shadow-card">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-powder-100 to-powder-200 text-rose-600 transition group-hover:from-rose-300 group-hover:to-rose-500 group-hover:text-white">
                    <v.icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg text-ink-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-ink-700">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-bone-50 py-20 md:py-28">
        <Container className="max-w-3xl">
          <Reveal variant="up" className="text-center">
            <h2 className="font-display text-3xl leading-tight text-ink-900 md:text-5xl">
              Bizimle{" "}
              <span className="font-italic-display text-gradient-fuchsia">
                tanışmaya
              </span>{" "}
              hazır mısınız?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-[1.85] text-ink-700">
              Koleksiyonumuzu keşfedin veya soru, öneri ve işbirliği için
              bizimle iletişime geçin.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="btn-luxe btn-luxe-rose shadow-luxe"
              >
                Koleksiyonu Keşfet
              </Link>
              <Link href="/iletisim" className="btn-luxe btn-luxe-outline">
                İletişime Geç
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
