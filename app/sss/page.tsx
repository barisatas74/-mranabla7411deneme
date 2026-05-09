import type { Metadata } from "next";
import Container from "@/components/Container";
import Breadcrumb from "@/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description:
    "Miss Bella alışverişi, sipariş takibi, kargo, iade ve ödeme süreçleri hakkında sıkça sorulan soruların cevaplarını bulun.",
};

const faqGroups = [
  {
    title: "Sipariş",
    items: [
      {
        question: "Siparişimi nasıl takip edebilirim?",
        answer:
          "Siparişiniz hazırlandıktan sonra kargo takip numaranız e-posta adresinize iletilir. Hesabınıza giriş yaparak sipariş geçmişi ekranından da takip edebilirsiniz.",
      },
      {
        question: "Siparişimi nasıl iptal edebilirim?",
        answer:
          "Siparişiniz kargoya verilmediği sürece müşteri hizmetleri ile iletişime geçerek iptal edebilirsiniz. Kargoya verilen siparişler için iade prosedürünü uygulamanız gerekir.",
      },
      {
        question: "Sipariş onay e-postası gelmedi, ne yapmalıyım?",
        answer:
          "Spam veya gereksiz klasörünüzü kontrol edin. Hâlâ ulaşmadıysa müşteri hizmetlerimizle iletişime geçin; sipariş bilgilerinizi tarafınıza tekrar iletelim.",
      },
    ],
  },
  {
    title: "Kargo & Teslimat",
    items: [
      {
        question: "Kargo süresi ne kadar?",
        answer:
          "Standart teslimat süremiz 1–3 iş günüdür. İstanbul içi siparişlerde aynı gün kargo seçeneğimiz mevcuttur (saat 14:00&apos;a kadar verilen siparişler).",
      },
      {
        question: "Kargo ücreti ne kadar?",
        answer:
          "300 TL ve üzeri tüm siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde standart kargo ücreti sipariş özetinde belirtilir.",
      },
      {
        question: "Yurt dışına kargo yapıyor musunuz?",
        answer:
          "Şu anda yalnızca Türkiye sınırları içinde kargo gönderimi yapıyoruz. Yurt dışı gönderim seçenekleri için takipte kalın.",
      },
    ],
  },
  {
    title: "İade & Değişim",
    items: [
      {
        question: "İade süresi ne kadar?",
        answer:
          "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade veya değişim talebinde bulunabilirsiniz. Detaylar için İade Politikası sayfamızı inceleyebilirsiniz.",
      },
      {
        question: "Hangi ürünler iade edilemez?",
        answer:
          "Hijyen etiketi çıkarılmış veya ambalajı açılmış iç giyim ürünleri sağlık ve hijyen nedeniyle iade kapsamı dışındadır.",
      },
      {
        question: "İade kargo ücretini kim öder?",
        answer:
          "Hatalı veya hasarlı ürün gönderimlerinde iade kargo ücreti tarafımızca karşılanır. Diğer iade taleplerinde kargo ücreti müşteriye aittir.",
      },
      {
        question: "Geri ödeme ne zaman yapılır?",
        answer:
          "Ürün tarafımıza ulaştıktan ve kontrolden geçtikten sonra en geç 10 iş günü içinde aynı ödeme yöntemine iade yapılır. Banka süreçleri nedeniyle hesabınıza yansıması birkaç iş günü daha sürebilir.",
      },
    ],
  },
  {
    title: "Beden & Ürün",
    items: [
      {
        question: "Hangi bedeni almalıyım?",
        answer:
          "Doğru beden için Beden Tablosu sayfamızı inceleyebilir veya WhatsApp destek hattımızdan ölçü bilgilerinizi paylaşarak öneri alabilirsiniz.",
      },
      {
        question: "Ürünleriniz nerede üretiliyor?",
        answer:
          "Tüm koleksiyonumuz Türkiye&apos;de, deneyimli butik atölyelerimizde üretilmektedir. Etik üretim ve kaliteli kumaş tercihimizdir.",
      },
      {
        question: "Ürün stokta yok, tekrar gelecek mi?",
        answer:
          "Stokta olmayan ürünleriniz için favorilere ekleyerek bildirim alabilirsiniz. Popüler ürünlerimizi periyodik olarak yeniliyoruz.",
      },
    ],
  },
  {
    title: "Ödeme",
    items: [
      {
        question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        answer:
          "Tüm büyük banka kredi/banka kartlarını, havale/EFT ve kapıda ödeme seçeneklerini sunuyoruz. Kart bilgileriniz tarafımızca saklanmaz; ödeme lisanslı ödeme kuruluşunun güvenli altyapısı üzerinden yapılır.",
      },
      {
        question: "Taksit imkânı var mı?",
        answer:
          "Belirli kredi kartlarına özel taksit seçeneklerimiz mevcuttur. Sepet ekranında kart bilgilerinizi girdikten sonra uygun taksit seçenekleri otomatik olarak görüntülenir.",
      },
      {
        question: "Ödeme bilgilerim güvende mi?",
        answer:
          "Tüm ödeme işlemleri SSL şifreleme ve 3D Secure protokolü ile korunmaktadır. Kart bilgileriniz hiçbir şekilde sunucularımızda saklanmaz.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Sıkça Sorulan Sorular" }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-20">
        <Container className="text-center">
          <span className="luxe-label">Yardım Merkezi</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[64px]">
            Sıkça Sorulan{" "}
            <span className="font-italic-display text-gradient-fuchsia">
              Sorular
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-700">
            Aradığınız cevabı bulamazsanız müşteri hizmetlerimize WhatsApp veya
            e-posta üzerinden ulaşabilirsiniz.
          </p>
        </Container>
      </section>

      <Container className="max-w-3xl py-14 md:py-20">
        {faqGroups.map((group) => (
          <div key={group.title} className="mb-12">
            <h2 className="mb-4 font-display text-2xl text-ink-900 md:text-3xl">
              {group.title}
            </h2>
            <FaqAccordion items={group.items} />
          </div>
        ))}
      </Container>
    </>
  );
}
