import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Miss Bella müşteri verilerinin hangi hukuki sebeplerle ve hangi amaçlarla işlendiği hakkında KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalLayout
      eyebrow="Yasal Bilgilendirme"
      title="KVKK Aydınlatma Metni"
      updated="7 Mayıs 2026"
    >
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;)
        kapsamında Miss Bella olarak, veri sorumlusu sıfatıyla işlediğimiz
        kişisel veriler ile bu verilere ilişkin haklarınız konusunda sizi
        bilgilendiririz.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        <strong>Miss Bella İç Giyim Ve Butik</strong>
        <br />
        Adres: Eşref Dinçer Mah., Eski Pazar Cd. No: 20/A, 16600 Gemlik / Bursa
        <br />
        Destek Hattı:{" "}
        <a href="tel:+905309907163">0530 990 71 63</a>
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>
          <strong>Kimlik bilgileri:</strong> ad, soyad
        </li>
        <li>
          <strong>İletişim bilgileri:</strong> telefon, e-posta, teslimat
          adresi, fatura adresi
        </li>
        <li>
          <strong>Müşteri işlem verileri:</strong> sipariş, iade, değişim ve
          destek talebi kayıtları
        </li>
        <li>
          <strong>Finansal veriler:</strong> ödeme işlemine ilişkin sınırlı
          bilgiler (ödeme yöntemi, sipariş tutarı). Kart bilgileri tarafımızca
          saklanmaz.
        </li>
        <li>
          <strong>İşlem güvenliği verileri:</strong> IP adresi, oturum bilgisi,
          çerez kayıtları, cihaz bilgileri
        </li>
        <li>
          <strong>Pazarlama verileri:</strong> açık rızanız bulunması halinde
          alışveriş tercihleri ve bülten kayıtları
        </li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Siparişlerin alınması, hazırlanması ve teslim edilmesi</li>
        <li>İade, değişim ve müşteri destek süreçlerinin yürütülmesi</li>
        <li>Ödeme işlemlerinin yürütülmesi ve faturalandırma</li>
        <li>
          Yasal yükümlülüklerin (vergi mevzuatı, tüketici mevzuatı vb.) yerine
          getirilmesi
        </li>
        <li>
          Açık rızanız bulunması halinde kampanya, indirim ve bülten iletişimi
          kurulması
        </li>
        <li>
          Site güvenliğinin sağlanması ve hukuka aykırı kullanımların tespit
          edilmesi
        </li>
      </ul>

      <h2>4. İşlemenin Hukuki Sebepleri</h2>
      <p>
        Kişisel verileriniz; sözleşmenin kurulması veya ifası, hukuki
        yükümlülüklerin yerine getirilmesi, meşru menfaatlerimiz ve gerekli
        durumlarda açık rızanız hukuki sebeplerine dayalı olarak işlenmektedir.
      </p>

      <h2>5. Aktarım Yapılan Taraflar</h2>
      <p>
        Verileriniz; teslimat sürecinin tamamlanması için kargo iş
        ortaklarımızla, ödeme süreçlerinin yürütülmesi için ödeme
        kuruluşlarıyla, e-fatura ve muhasebe yükümlülükleri için ilgili
        hizmet sağlayıcılarla ve hukuki zorunluluklar halinde yetkili kamu
        kurum ve kuruluşlarıyla paylaşılabilir.
      </p>

      <h2>6. Saklama Süresi</h2>
      <p>
        Kişisel verileriniz; yasal saklama yükümlülükleri (Türk Ticaret Kanunu,
        Vergi Usul Kanunu, Tüketici Mevzuatı vb.) ve işleme amaçlarının
        gerektirdiği süreler boyunca saklanır; bu sürelerin sonunda silinir,
        yok edilir veya anonim hale getirilir.
      </p>

      <h2>7. Haklarınız</h2>
      <p>KVKK&rsquo;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenen verileriniz hakkında bilgi talep etme</li>
        <li>İşlenme amacını ve verilerinizin amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>
          Yurt içinde veya yurt dışında verilerinizin aktarıldığı üçüncü
          kişileri bilme
        </li>
        <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
        <li>Verilerin silinmesini veya yok edilmesini talep etme</li>
        <li>
          Düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı
          üçüncü kişilere bildirilmesini isteme
        </li>
        <li>
          Otomatik sistemler ile analiz edilmesi sonucunda aleyhinize bir sonuç
          ortaya çıkmasına itiraz etme
        </li>
        <li>
          Verilerin kanuna aykırı işlenmesi nedeniyle uğradığınız zararın
          giderilmesini talep etme
        </li>
      </ul>

      <h2>8. Başvuru Yöntemi</h2>
      <p>
        KVKK kapsamındaki taleplerinizi{" "}
        <a href="tel:+905309907163">0530 990 71 63</a> numaralı destek hattımıza
        iletebilir veya yukarıda belirtilen şirket adresine yazılı olarak
        gönderebilirsiniz. Başvurularınız, mevzuatta belirtilen 30 günlük süre
        içinde değerlendirilerek tarafınıza yanıt verilir.
      </p>
    </LegalLayout>
  );
}
