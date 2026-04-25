import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Mesafeli Satis Sozlesmesi",
  description:
    "Luna Rosa internet sitesi uzerinden verilen siparislere uygulanacak mesafeli satis sozlesmesi metni.",
};

export default function MesafeliSatisPage() {
  return (
    <LegalLayout
      eyebrow="Sozlesme"
      title="Mesafeli Satis Sozlesmesi"
      updated="25 Nisan 2026"
    >
      <h2>Madde 1 - Taraflar</h2>
      <p>
        Isbu sozlesme; satici sifatiyla Luna Rosa ile internet sitesi uzerinden
        siparis veren alici arasinda, elektronik ortamda kabul edilerek kurulmustur.
      </p>

      <h3>Satici</h3>
      <p>
        Unvan: <strong>Luna Rosa</strong>
        <br />
        E-posta: destek@lunarosa.com
        <br />
        Destek Hatti: +90 555 000 00 00
      </p>

      <h3>Alici</h3>
      <p>
        Siparis formunda belirtilen ad, soyad, teslimat adresi ve iletisim bilgileri.
      </p>

      <h2>Madde 2 - Konu</h2>
      <p>
        Bu sozlesmenin konusu, alicinin Luna Rosa internet sitesi uzerinden siparis
        ettigi urun veya urunlerin satisi ve teslimi ile taraflarin hak ve
        yukumluluklerinin belirlenmesidir.
      </p>

      <h2>Madde 3 - Urun ve Odeme Bilgileri</h2>
      <p>
        Siparis verilen urunlerin turu, adedi, rengi, bedeni, satis bedeli ve odeme
        sekli; siparis ozeti ekraninda alici tarafindan onaylanan bilgilerden
        olusur.
      </p>

      <h2>Madde 4 - Teslimat</h2>
      <ul>
        <li>Urun, alicinin siparis formunda belirttigi adrese teslim edilir.</li>
        <li>Standart teslimat sureleri urun sayfasinda ve checkout ekraninda belirtilir.</li>
        <li>
          Aksi belirtilmedikce kargo bedeli aliciya aittir; kampanya kosullarinda
          ucretsiz kargo uygulanabilir.
        </li>
      </ul>

      <h2>Madde 5 - Cayma Hakki</h2>
      <p>
        Alici, urunu teslim aldigi tarihten itibaren 14 gun icinde, yasal istisnalar
        sakli kalmak kaydiyla cayma hakkini kullanabilir.
      </p>
      <p>
        Hijyen etiketi kaldirilmis ic giyim urunleri, mevzuat kapsamindaki hijyen
        istisnasi nedeniyle cayma hakki disinda kalabilir.
      </p>

      <h2>Madde 6 - Uyusmazliklar</h2>
      <p>
        Uyusmazlik halinde, ilgili mevzuatta belirtilen parasal sinirlar dahilinde
        Tuketici Hakem Heyetleri ve Tuketici Mahkemeleri yetkilidir.
      </p>

      <p className="mt-10 text-[12px] text-ink-600">
        Bu metin, yayin oncesi hukuki denetim gerektiren ornek bir sozlesme
        kurgusudur.
      </p>
    </LegalLayout>
  );
}
