import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import { Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "Beden Tablosu",
  description:
    "Miss Bella iç giyim ürünlerinde doğru bedeni seçmeniz için detaylı sütyen, külot, takım ve gecelik beden tablosu.",
};

const sutyenSizes = [
  { tr: "70A-B", us: "32A-B", eu: "70A-B", under: "63-67", over: "78-82" },
  { tr: "75A-B", us: "34A-B", eu: "75A-B", under: "68-72", over: "83-87" },
  { tr: "80A-B", us: "36A-B", eu: "80A-B", under: "73-77", over: "88-92" },
  { tr: "85A-B", us: "38A-B", eu: "85A-B", under: "78-82", over: "93-97" },
  { tr: "90A-B", us: "40A-B", eu: "90A-B", under: "83-87", over: "98-102" },
  { tr: "95A-B", us: "42A-B", eu: "95A-B", under: "88-92", over: "103-107" },
];

const altSizes = [
  { size: "XS (36)", waist: "60-64", hip: "84-88" },
  { size: "S (38)", waist: "65-69", hip: "89-93" },
  { size: "M (40)", waist: "70-74", hip: "94-98" },
  { size: "L (42)", waist: "75-79", hip: "99-103" },
  { size: "XL (44)", waist: "80-86", hip: "104-110" },
  { size: "XXL (46)", waist: "87-93", hip: "111-117" },
];

const geceSizes = [
  { size: "XS (36)", chest: "78-82", waist: "60-64", hip: "84-88" },
  { size: "S (38)", chest: "83-87", waist: "65-69", hip: "89-93" },
  { size: "M (40)", chest: "88-92", waist: "70-74", hip: "94-98" },
  { size: "L (42)", chest: "93-97", waist: "75-79", hip: "99-103" },
  { size: "XL (44)", chest: "98-104", waist: "80-86", hip: "104-110" },
  { size: "XXL (46)", chest: "105-111", waist: "87-93", hip: "111-117" },
];

export default function BedenTablosuPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Beden Tablosu" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-20">
        <Container className="text-center">
          <span className="luxe-label">Doğru Beden Rehberi</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[64px]">
            Beden{" "}
            <span className="font-italic-display text-gradient-fuchsia">
              Tablosu
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-700">
            Doğru bedeni seçmek için aşağıdaki tabloları kullanabilir, ölçü
            alma rehberini inceleyebilirsiniz. Tüm ölçüler santimetre (cm)
            cinsindendir.
          </p>
        </Container>
      </section>

      <Container className="max-w-5xl py-14 md:py-20">
        {/* Ölçü alma rehberi */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <MeasureCard
            num="01"
            title="Göğüs Altı"
            text="Mezurayı göğüs altından, vücudunuza paralel ve sıkı tutarak ölçün."
          />
          <MeasureCard
            num="02"
            title="Göğüs Üstü"
            text="Mezurayı göğsün en dolgun noktasından, çok sıkmadan geçirin."
          />
          <MeasureCard
            num="03"
            title="Bel & Kalça"
            text="Beli en ince yerinden, kalçayı ise en geniş noktasından ölçün."
          />
        </div>

        {/* Sütyen tablosu */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-3">
            <Ruler size={18} strokeWidth={1.5} className="text-rose-600" />
            <h2 className="font-display text-2xl text-ink-900 md:text-3xl">
              Sütyen Bedenleri
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-powder-100 text-[10px] uppercase tracking-editorial text-ink-700">
                <tr>
                  <th className="px-4 py-3">TR</th>
                  <th className="px-4 py-3">US/UK</th>
                  <th className="px-4 py-3">EU</th>
                  <th className="px-4 py-3">Göğüs Altı (cm)</th>
                  <th className="px-4 py-3">Göğüs Üstü (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/10 text-ink-800">
                {sutyenSizes.map((row) => (
                  <tr
                    key={row.tr}
                    className="transition hover:bg-powder-50"
                  >
                    <td className="px-4 py-3 font-medium">{row.tr}</td>
                    <td className="px-4 py-3">{row.us}</td>
                    <td className="px-4 py-3">{row.eu}</td>
                    <td className="px-4 py-3">{row.under}</td>
                    <td className="px-4 py-3">{row.over}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-ink-600">
            * Cup ölçüsü, göğüs üstü ile göğüs altı farkı baz alınarak
            belirlenir (A: ~13 cm, B: ~15 cm, C: ~17 cm, D: ~19 cm).
          </p>
        </section>

        {/* Alt giyim */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-3">
            <Ruler size={18} strokeWidth={1.5} className="text-rose-600" />
            <h2 className="font-display text-2xl text-ink-900 md:text-3xl">
              Külot & Alt Bedenleri
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-powder-100 text-[10px] uppercase tracking-editorial text-ink-700">
                <tr>
                  <th className="px-4 py-3">Beden</th>
                  <th className="px-4 py-3">Bel (cm)</th>
                  <th className="px-4 py-3">Kalça (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/10 text-ink-800">
                {altSizes.map((row) => (
                  <tr
                    key={row.size}
                    className="transition hover:bg-powder-50"
                  >
                    <td className="px-4 py-3 font-medium">{row.size}</td>
                    <td className="px-4 py-3">{row.waist}</td>
                    <td className="px-4 py-3">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Gecelik & takım */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-3">
            <Ruler size={18} strokeWidth={1.5} className="text-rose-600" />
            <h2 className="font-display text-2xl text-ink-900 md:text-3xl">
              Gecelik & Takım Bedenleri
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-ink-900/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-powder-100 text-[10px] uppercase tracking-editorial text-ink-700">
                <tr>
                  <th className="px-4 py-3">Beden</th>
                  <th className="px-4 py-3">Göğüs (cm)</th>
                  <th className="px-4 py-3">Bel (cm)</th>
                  <th className="px-4 py-3">Kalça (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/10 text-ink-800">
                {geceSizes.map((row) => (
                  <tr
                    key={row.size}
                    className="transition hover:bg-powder-50"
                  >
                    <td className="px-4 py-3 font-medium">{row.size}</td>
                    <td className="px-4 py-3">{row.chest}</td>
                    <td className="px-4 py-3">{row.waist}</td>
                    <td className="px-4 py-3">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* İpucu kutusu */}
        <div className="rounded-2xl border border-rose-600/20 bg-gradient-to-br from-powder-50 to-bone-100 p-6 md:p-8">
          <h3 className="font-display text-xl text-ink-900 md:text-2xl">
            İki beden arasında kaldıysam?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Genel olarak bir üst bedeni tercih etmenizi öneririz, özellikle
            kumaşı esnemeyen modellerde. Sütyenlerde göğüs altı bandı yerine
            cup boyutunu büyütmek genellikle daha iyi destek sağlar.
            Emin olamıyorsanız WhatsApp destek hattımızdan ölçülerinizi
            paylaşarak öneri alabilirsiniz.
          </p>
        </div>
      </Container>
    </>
  );
}

function MeasureCard({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-bone-50 p-6 transition hover:border-rose-600/30 hover:shadow-card">
      <span className="font-italic-display text-3xl text-rose-600">{num}</span>
      <h3 className="mt-2 font-display text-lg text-ink-900">{title}</h3>
      <p className="mt-2 text-sm font-light leading-relaxed text-ink-700">
        {text}
      </p>
    </div>
  );
}
