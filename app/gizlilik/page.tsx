import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Miss Bella internet sitesinde toplanan bilgiler, çerezler ve veri güvenliği uygulamaları hakkında özet bilgilendirme.",
};

export default function GizlilikPage() {
  return (
    <LegalLayout
      eyebrow="Yasal Bilgilendirme"
      title="Gizlilik Politikası"
      updated="7 Mayıs 2026"
    >
      <p>
        Miss Bella olarak ziyaretçi ve müşterilerimizin kişisel verilerinin
        korunmasını öncelikli kabul ederiz. Bu politika; internet sitemizi
        ziyaret ettiğinizde hangi verilerin toplandığını, bu verilerin hangi
        amaçlarla kullanıldığını ve nasıl korunduğunu açıklar.
      </p>

      <h2>Toplanan Veriler</h2>
      <ul>
        <li>
          <strong>İletişim bilgileri:</strong> ad, soyad, telefon, e-posta
        </li>
        <li>
          <strong>Teslimat bilgileri:</strong> adres, il, ilçe, posta kodu
        </li>
        <li>
          <strong>İşlem verileri:</strong> sipariş, iade ve müşteri destek
          kayıtları
        </li>
        <li>
          <strong>Teknik veriler:</strong> IP adresi, cihaz bilgisi, çerez
          tercihleri ve oturum kayıtları
        </li>
      </ul>

      <h2>Verilerin Kullanım Amacı</h2>
      <ul>
        <li>Sipariş alma, hazırlama ve teslim etme süreçlerinin yürütülmesi</li>
        <li>İade ve değişim taleplerinin değerlendirilmesi</li>
        <li>Müşteri destek hizmetlerinin sağlanması</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        <li>Site performansının ölçülmesi ve iyileştirilmesi</li>
        <li>
          Açık rızanız bulunması halinde kampanya ve bülten gönderimi yapılması
        </li>
      </ul>

      <h2>Çerez Kullanımı</h2>
      <p>
        Site deneyimini iyileştirmek, oturum sürekliliğini sağlamak ve
        performans ölçümlemek amacıyla çerezlerden yararlanırız. Çerezler;
        zorunlu, işlevsel ve analitik amaçlı olarak gruplandırılır. Tarayıcı
        ayarlarınızdan çerez tercihlerinizi dilediğiniz zaman yönetebilir veya
        çerezleri tamamen reddedebilirsiniz. Çerezleri devre dışı bırakmanız
        durumunda sitenin bazı özellikleri sınırlı çalışabilir.
      </p>

      <h2>Veri Güvenliği</h2>
      <p>
        Tüm veri aktarımları SSL şifreleme ile korunur. Ödeme işlemleri lisanslı
        ödeme kuruluşlarının güvenli altyapısı üzerinden gerçekleştirilir; kart
        bilgileri tarafımızca saklanmaz. Sistemlerimize yetkisiz erişim, veri
        kaybı ve veri sızıntısına karşı teknik ve idari tedbirler uygulanır.
      </p>

      <h2>Üçüncü Taraflarla Paylaşım</h2>
      <p>
        Verileriniz yalnızca; teslimatın gerçekleştirilmesi için kargo iş
        ortaklarımızla, ödeme sürecinin yürütülmesi için ödeme kuruluşlarıyla,
        muhasebe ve fatura yükümlülükleri için ilgili hizmet sağlayıcılarla ve
        hukuki zorunluluklar gereği yetkili kamu kurumlarıyla paylaşılır.
        Verileriniz pazarlama amacıyla üçüncü kişilere satılmaz.
      </p>

      <h2>Saklama Süresi</h2>
      <p>
        Kişisel verileriniz; ilgili yasal mevzuat (Türk Ticaret Kanunu, Vergi
        Usul Kanunu, Tüketici Mevzuatı vb.) ile belirlenen süreler ve işleme
        amaçlarının gerektirdiği süreler boyunca saklanır.
      </p>

      <h2>Haklarınız</h2>
      <p>
        KVKK kapsamındaki haklarınız ve bu hakları kullanmak için izleyeceğiniz
        başvuru yöntemi hakkında detaylı bilgi için{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> sayfamızı inceleyebilirsiniz.
      </p>

      <h2>İletişim</h2>
      <p>
        Gizlilik ve veri güvenliği ile ilgili tüm sorularınız için{" "}
        <a href="tel:+905309907163">0530 990 71 63</a> numaralı destek hattımızı
        arayabilirsiniz.
      </p>
    </LegalLayout>
  );
}
