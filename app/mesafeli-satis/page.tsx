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
        Adres: <em>[Sirket merkez adresi]</em>
        <br />
        Vergi Dairesi / No: <em>[Vergi dairesi] / [VKN]</em>
        <br />
        Mersis No: <em>[Mersis numarasi]</em>
        <br />
        E-posta: hello@lunarosa.com
        <br />
        Destek Hatti: +90 850 222 12 34
      </p>
      <p className="text-[12px] text-ink-600">
        Italik alanlar canlilanmadan once gercek sirket bilgileri ile
        guncellenmelidir.
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
        <li>Standart teslimat suresi 1&ndash;3 is gunudur.</li>
        <li>
          300 TL ve uzeri siparislerde kargo ucretsizdir; alti siparislerde
          standart kargo bedeli 39 TL, ekspres teslimat 59 TL olarak siparis
          ozetinde belirtilir.
        </li>
        <li>
          Tum fiyatlar KDV dahildir (KDV orani siparis ozetinde gosterilir).
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

      <h2>Madde 7 - Iade ve Degisim</h2>
      <p>
        Alici, ambalaji acilmamis ve hijyen etiketi yerinde olan urunleri 14 gun
        icinde iade edebilir. Iade talepleri{" "}
        <a href="mailto:hello@lunarosa.com">hello@lunarosa.com</a> adresine
        siparis numarasi ile birlikte iletilmelidir. Detaylar icin{" "}
        <a href="/iade-politikasi">iade politikasi</a> sayfasini inceleyin.
      </p>

      <h2>Madde 8 - Yururluk</h2>
      <p>
        Bu sozlesme, alicinin siparis tamamlama adiminda elektronik ortamda kabul
        etmesi ile yururluge girer ve siparise konu yukumlulukler tamamlanana
        kadar gecerlidir.
      </p>

      <p className="mt-10 text-[12px] text-ink-600">
        Bu sozlesme metni, sirket bilgileri ve hukuki denetim ile birlikte
        canliya alinmadan once nihai hale getirilmelidir.
      </p>
    </LegalLayout>
  );
}
