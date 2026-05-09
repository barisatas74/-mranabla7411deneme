import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import { Truck, Package, MapPin, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Kargo ve Teslimat",
  description:
    "Miss Bella siparişlerinizde kargo süreleri, ücretsiz kargo eşiği, takip ve teslimat süreçleri hakkında detaylı bilgi.",
};

export default function KargoTeslimatPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Kargo & Teslimat" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-20">
        <Container className="text-center">
          <span className="luxe-label">Teslimat Bilgileri</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[64px]">
            Kargo &amp;{" "}
            <span className="font-italic-display text-gradient-fuchsia">
              Teslimat
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-700">
            Siparişinizi en kısa sürede ve özenle paketleyerek tarafınıza
            ulaştırıyoruz.
          </p>
        </Container>
      </section>

      <Container className="max-w-4xl py-14 md:py-20">
        {/* Üst kart grid */}
        <div className="mb-14 grid gap-5 md:grid-cols-2">
          <FeatureCard
            icon={<Truck size={22} strokeWidth={1.5} />}
            title="Ücretsiz Kargo"
            text="300 TL ve üzeri tüm siparişlerde Türkiye geneli kargo ücretsizdir."
          />
          <FeatureCard
            icon={<Clock size={22} strokeWidth={1.5} />}
            title="Hızlı Hazırlık"
            text="Siparişiniz aynı veya bir sonraki iş günü içinde özenle hazırlanır."
          />
          <FeatureCard
            icon={<MapPin size={22} strokeWidth={1.5} />}
            title="Aynı Gün İstanbul"
            text="Saat 14:00&apos;a kadar verilen İstanbul içi siparişler aynı gün kargolanır."
          />
          <FeatureCard
            icon={<Shield size={22} strokeWidth={1.5} />}
            title="Güvenli Paketleme"
            text="Her sipariş özel marka paketimizde, hijyenik ve dikkatlice paketlenir."
          />
        </div>

        {/* Detay bölümler */}
        <div className="space-y-10">
          <Section title="Teslimat Süresi">
            <p>
              Standart teslimat süremiz <strong>1–3 iş günüdür</strong>.
              İstanbul içi aynı gün kargo seçeneğimiz mevcuttur (saat 14:00&apos;a
              kadar verilen siparişler için geçerlidir).
            </p>
            <p>
              Hafta sonu ve resmi tatil günlerinde verilen siparişler ilk iş
              gününde işleme alınır. Yoğun dönemlerde (kampanya, özel günler)
              teslimat süreleri 1 iş günü uzayabilir.
            </p>
          </Section>

          <Section title="Kargo Ücreti">
            <ul>
              <li>
                <strong>300 TL ve üzeri siparişler:</strong> Tüm Türkiye&apos;ye
                ücretsiz kargo
              </li>
              <li>
                <strong>300 TL altı siparişler:</strong> Sabit kargo ücreti
                sipariş özetinde belirtilir
              </li>
              <li>
                <strong>Ekspres teslimat:</strong> İstanbul içi aynı gün
                seçeneği için ek kargo ücreti uygulanır
              </li>
            </ul>
          </Section>

          <Section title="Kargo Takibi">
            <p>
              Siparişiniz kargoya verildikten sonra takip numaranız
              e-posta&nbsp;ve&nbsp;SMS ile tarafınıza iletilir. Kargo
              firmasının sitesinden veya hesabınızın sipariş geçmişi
              ekranından takip edebilirsiniz.
            </p>
          </Section>

          <Section title="Teslimat Adresi">
            <p>
              Sipariş tamamlama adımında belirttiğiniz adrese teslimat
              yapılır. Adres değişikliği gerekiyorsa siparişiniz kargoya
              verilmeden önce müşteri hizmetleri ile iletişime geçmeniz
              gerekir.
            </p>
          </Section>

          <Section title="Hasarlı veya Eksik Teslimat">
            <p>
              Kargonuzu teslim alırken paketin dış görünümünü kontrol edin.
              Hasar görmüş bir paket gelirse <strong>tutanak tutturarak</strong>{" "}
              teslim alın ve 48 saat içinde müşteri hizmetlerimize bildirin. Bu
              durumda kargo ücreti tarafımızca karşılanır ve değişim süreci
              öncelikli olarak yürütülür.
            </p>
          </Section>

          <Section title="Anlaşmalı Kargo Firmaları">
            <p>
              Siparişlerinizi <em>[Kargo firması adı]</em> ile gönderiyoruz.
              Tercih ettiğiniz farklı bir kargo firması varsa sipariş notuna
              ekleyebilirsiniz; uygunluk durumuna göre sizinle iletişime
              geçeriz.
            </p>
          </Section>
        </div>

        <div className="mt-14 rounded-2xl border border-rose-600/20 bg-gradient-to-br from-powder-50 to-bone-100 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Package
              size={28}
              strokeWidth={1.5}
              className="flex-shrink-0 text-rose-600"
            />
            <div>
              <h3 className="font-display text-xl text-ink-900 md:text-2xl">
                Yardıma mı ihtiyacınız var?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                Siparişiniz hakkında her türlü soru için müşteri hizmetlerimize
                WhatsApp veya e-posta üzerinden ulaşabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-ink-900/10 bg-bone-50 p-6 transition hover:border-rose-600/30 hover:shadow-card">
      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-powder-100 to-powder-200 text-rose-600 transition group-hover:from-rose-300 group-hover:to-rose-500 group-hover:text-white">
        {icon}
      </div>
      <h3 className="font-display text-lg text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm font-light leading-relaxed text-ink-700">
        {text}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legal-prose">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
