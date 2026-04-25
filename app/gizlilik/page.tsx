import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Gizlilik Politikasi",
  description:
    "Luna Rosa internet sitesinde toplanan bilgiler, cerezler ve veri guvenligi uygulamalari hakkinda ozet bilgilendirme.",
};

export default function GizlilikPage() {
  return (
    <LegalLayout
      eyebrow="Yasal Bilgilendirme"
      title="Gizlilik Politikasi"
      updated="25 Nisan 2026"
    >
      <p>
        Luna Rosa, ziyaretci ve musterilerinin kisisel verilerini korumayi oncelikli
        kabul eder. Bu politika; internet sitemizi ziyaret ettiginizde hangi
        verilerin toplandigini, bu verilerin hangi amaclarla kullanildigini ve nasil
        korundugunu aciklar.
      </p>

      <h2>Toplanan Veriler</h2>
      <ul>
        <li>Iletisim bilgileri: ad, soyad, telefon ve e-posta</li>
        <li>Teslimat bilgileri: adres, il, ilce ve posta kodu</li>
        <li>Islem verileri: siparis, iade ve musteri destek kayitlari</li>
        <li>Teknik veriler: IP adresi, cihaz bilgisi ve cerez tercihleri</li>
      </ul>

      <h2>Cerez Kullanimi</h2>
      <p>
        Site deneyimini iyilestirmek, oturum surekliligini saglamak ve performans
        olcumlemek amaciyla cerezlerden yararlaniriz. Tarayici ayarlarinizdan cerez
        tercihlerinizi dilediginiz zaman yonetebilirsiniz.
      </p>

      <h2>Veri Guvenligi</h2>
      <p>
        Odeme verileri ve hassas bilgiler, guvenli iletim protokolleri ile korunur.
        Kart bilgileriniz tarafimizca saklanmaz; sadece odeme kurulusunun guvenli
        altyapisinda islenir.
      </p>

      <h2>Iletisim</h2>
      <p>
        Gizlilik ve veri guvenligi ile ilgili sorulariniz icin{" "}
        <a href="mailto:kvkk@lunarosa.com">kvkk@lunarosa.com</a> adresine
        ulasabilirsiniz.
      </p>
    </LegalLayout>
  );
}
