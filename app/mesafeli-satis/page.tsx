import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Miss Bella internet sitesi üzerinden verilen siparişlere uygulanacak mesafeli satış sözleşmesi metni.",
};

export default function MesafeliSatisPage() {
  return (
    <LegalLayout
      eyebrow="Sözleşme"
      title="Mesafeli Satış Sözleşmesi"
      updated="7 Mayıs 2026"
    >
      <h2>Madde 1 &mdash; Taraflar</h2>
      <p>
        İşbu sözleşme; satıcı sıfatıyla Miss Bella ile internet sitesi üzerinden
        sipariş veren alıcı arasında, elektronik ortamda kabul edilerek
        kurulmuştur.
      </p>

      <h3>Satıcı</h3>
      <p>
        Unvan: <strong>Miss Bella İç Giyim Ve Butik</strong>
        <br />
        Adres: Eşref Dinçer Mah., Eski Pazar Cd. No: 20/A, 16600 Gemlik / Bursa
        <br />
        Destek Hattı:{" "}
        <a href="tel:+905309907163">0530 990 71 63</a>
      </p>

      <h3>Alıcı</h3>
      <p>
        Sipariş formunda belirtilen ad, soyad, teslimat adresi ve iletişim
        bilgileri.
      </p>

      <h2>Madde 2 &mdash; Konu</h2>
      <p>
        Bu sözleşmenin konusu; alıcının Miss Bella internet sitesi üzerinden
        sipariş ettiği ürün veya ürünlerin satışı ve teslimi ile tarafların
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri çerçevesindeki hak ve yükümlülüklerinin
        belirlenmesidir.
      </p>

      <h2>Madde 3 &mdash; Ürün ve Ödeme Bilgileri</h2>
      <p>
        Sipariş verilen ürünlerin türü, adedi, rengi, bedeni, satış bedeli ve
        ödeme şekli; sipariş özeti ekranında alıcı tarafından onaylanan
        bilgilerden oluşur. Tüm fiyatlar Türk Lirası (TL) cinsinden ve KDV
        dahil olarak gösterilir.
      </p>

      <h2>Madde 4 &mdash; Teslimat</h2>
      <ul>
        <li>Ürün, alıcının sipariş formunda belirttiği adrese teslim edilir.</li>
        <li>Standart teslimat süresi 1&ndash;3 iş günüdür.</li>
        <li>
          300 TL ve üzeri siparişlerde kargo ücretsizdir; bu tutarın altındaki
          siparişlerde kargo ücreti sipariş özetinde belirtilir.
        </li>
        <li>
          Mücbir sebepler veya kargo firmasından kaynaklanan gecikmelerde
          teslimat süresi uzayabilir; bu durumda alıcı bilgilendirilir.
        </li>
      </ul>

      <h2>Madde 5 &mdash; Cayma Hakkı</h2>
      <p>
        Alıcı, ürünü teslim aldığı tarihten itibaren <strong>14 gün</strong>{" "}
        içinde, herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin
        cayma hakkını kullanabilir.
      </p>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&rsquo;nin 15. maddesi uyarınca; hijyen
        etiketi kaldırılmış veya ambalajı açılmış iç giyim ürünleri sağlık ve
        hijyen açısından cayma hakkı kapsamı dışındadır.
      </p>

      <h2>Madde 6 &mdash; Cayma Hakkının Kullanılması</h2>
      <p>
        Cayma hakkını kullanmak isteyen alıcı, 14 günlük süre içinde{" "}
        <a href="tel:+905309907163">0530 990 71 63</a> numaralı destek hattımıza
        sipariş numarası ile bildirimde bulunmalıdır. Cayma bildirimi
        sonrasında ürün, anlaşmalı kargo aracılığıyla satıcıya gönderilir.
        Geri ödeme, ürünün satıcıya ulaşmasının ardından en geç{" "}
        <strong>10 iş günü</strong> içinde aynı ödeme yöntemine yapılır.
      </p>

      <h2>Madde 7 &mdash; İade ve Değişim</h2>
      <p>
        Alıcı; ambalajı açılmamış ve hijyen etiketi yerinde olan ürünleri 14
        gün içinde iade edebilir. İade talepleri sipariş numarası ile birlikte{" "}
        <a href="tel:+905309907163">0530 990 71 63</a> numaralı destek hattımıza
        iletilmelidir. Detaylı bilgi için{" "}
        <a href="/iade-politikasi">İade Politikası</a> sayfasını
        inceleyebilirsiniz.
      </p>

      <h2>Madde 8 &mdash; Uyuşmazlıkların Çözümü</h2>
      <p>
        İşbu sözleşmenin uygulanmasından doğacak uyuşmazlıklarda, Gümrük ve
        Ticaret Bakanlığı tarafından her yıl belirlenen parasal sınırlar
        dahilinde Tüketici Hakem Heyetleri ve bu sınırların üzerindeki
        uyuşmazlıklarda Tüketici Mahkemeleri yetkilidir.
      </p>

      <h2>Madde 9 &mdash; Yürürlük</h2>
      <p>
        Bu sözleşme; alıcının sipariş tamamlama adımında elektronik ortamda
        kabul etmesi ile yürürlüğe girer ve siparişe konu yükümlülükler
        tamamlanana kadar geçerliliğini korur.
      </p>

    </LegalLayout>
  );
}
