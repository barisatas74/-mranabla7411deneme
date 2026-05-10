import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "İade ve Değişim Politikası",
  description:
    "Miss Bella siparişlerinde iade, değişim, hasar bildirimi ve geri ödeme süreçleri hakkında bilgilendirme.",
};

export default function IadePage() {
  return (
    <LegalLayout
      eyebrow="Müşteri Hakları"
      title="İade ve Değişim Politikası"
      updated="7 Mayıs 2026"
    >
      <p>
        Miss Bella olarak satın aldığınız ürünlerden memnuniyetinizi önemsiyoruz.
        Siparişlerinize ilişkin iade ve değişim taleplerinizi aşağıdaki koşullar
        çerçevesinde değerlendiriyoruz.
      </p>

      <h2>İade Süresi</h2>
      <p>
        Siparişinizi teslim aldığınız tarihten itibaren <strong>14 gün</strong>{" "}
        içinde iade veya değişim talebinde bulunabilirsiniz. Bu süre, 6502 sayılı
        Tüketicinin Korunması Hakkında Kanun&rsquo;da belirtilen yasal cayma
        hakkı süresidir.
      </p>

      <h2>İade Koşulları</h2>
      <ul>
        <li>Hijyen etiketi çıkarılmamış olmalıdır.</li>
        <li>Ürün kullanılmamış ve zarar görmemiş olmalıdır.</li>
        <li>
          Orijinal ambalajı, varsa aksesuarları ve fatura/irsaliyesi eksiksiz
          olmalıdır.
        </li>
        <li>İade talebi sipariş numarası ile birlikte iletilmelidir.</li>
      </ul>

      <h2>Cayma Hakkı Dışında Kalan Ürünler</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&rsquo;nin 15. maddesi uyarınca; hijyen
        etiketi kaldırılmış, ambalajı açılmış veya kullanılmış iç giyim
        ürünleri, sağlık ve hijyen açısından iadeye uygun değildir. Kampanya ve
        outlet ürünlerinde yasal haklar saklı kalmak kaydıyla ek koşullar
        uygulanabilir.
      </p>

      <h2>Süreç Nasıl İşler?</h2>

      <h3>1. Talep Oluşturma</h3>
      <p>
        Sipariş numaranız ile birlikte{" "}
        <a href="tel:+905309907163">0530 990 71 63</a> numaralı destek hattımıza
        ya da WhatsApp üzerinden ulaşın. Talebinizde iade gerekçesini kısaca
        belirtmeniz süreci hızlandırır.
      </p>

      <h3>2. Kargo Gönderimi</h3>
      <p>
        Onaylanan taleplerde anlaşmalı kargo bilgisi sizinle paylaşılır.
        Ürünleri orijinal ambalajıyla, fatura/irsaliyesi ile birlikte hazırlayıp
        belirtilen adrese gönderin.
      </p>

      <h3>3. Kontrol ve Geri Ödeme</h3>
      <p>
        Ürün tarafımıza ulaştıktan sonra incelenir ve uygun bulunan iadelerde
        geri ödeme; ödeme yönteminize bağlı olarak <strong>en geç 10 iş günü</strong>{" "}
        içinde aynı yönteme yapılır. Banka süreçleri nedeniyle iadenin
        hesabınıza yansıması birkaç iş günü daha sürebilir.
      </p>

      <h2>Hasarlı veya Yanlış Ürün</h2>
      <p>
        Hasarlı veya yanlış ürün teslim aldıysanız, teslimattan sonraki{" "}
        <strong>48 saat</strong> içinde paket fotoğrafları ile birlikte bize
        bildirim yapın. Bu durumda kargo ücreti tarafımızca karşılanır ve
        değişim süreci öncelikli olarak yürütülür.
      </p>

      <h2>Değişim</h2>
      <p>
        Beden veya renk değişimi taleplerinde, değiştirilecek ürün stoklarda
        mevcutsa öncelikli olarak değişim yapılır. Ürün stokta yoksa iade
        sürecine yönlendirilirsiniz.
      </p>

      <h2>İletişim</h2>
      <p>
        Destek için{" "}
        <a href="tel:+905309907163">0530 990 71 63</a> numaralı hattımızı
        arayabilir veya WhatsApp üzerinden müşteri hizmetlerimize
        ulaşabilirsiniz.
      </p>
    </LegalLayout>
  );
}
