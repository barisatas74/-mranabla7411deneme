import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Iade ve Degisim Politikasi",
  description:
    "Luna Rosa siparislerinde iade, degisim, hasar bildirimi ve geri odeme surecleri hakkinda bilgilendirme.",
};

export default function IadePage() {
  return (
    <LegalLayout
      eyebrow="Musteri Haklari"
      title="Iade ve Degisim Politikasi"
      updated="25 Nisan 2026"
    >
      <p>
        Luna Rosa olarak, satin aldiginiz urunlerden memnuniyetinizi onemsiyoruz.
        Siparisinize iliskin iade ve degisim taleplerinizi asagidaki kosullar
        cercevesinde degerlendiriyoruz.
      </p>

      <h2>Iade Suresi</h2>
      <p>
        Siparisinizi teslim aldiginiz tarihten itibaren <strong>14 gun</strong>{" "}
        icinde iade veya degisim talebinde bulunabilirsiniz.
      </p>

      <h2>Iade Kosullari</h2>
      <ul>
        <li>Hijyen etiketi cikarilmamis olmali</li>
        <li>Urun, kullanilmamis ve zarar gormemis olmali</li>
        <li>Orijinal ambalaj ve varsa aksesuarlar eksiksiz olmali</li>
        <li>Iade talebi, siparis numarasi ile birlikte olusturulmali</li>
      </ul>

      <h2>Iade Disi Durumlar</h2>
      <p>
        Hijyen etiketi kaldirilmis veya kullanildigi tespit edilen ic giyim
        urunlerinde iade kabul edilmez. Kampanya ve outlet urunlerinde de gecerli
        yasal haklar korunmakla birlikte ek kosullar uygulanabilir.
      </p>

      <h2>Surec Nasil Isler?</h2>
      <h3>1. Talep Olusturma</h3>
      <p>
        Siparis numaraniz ile birlikte{" "}
        <a href="mailto:iade@lunarosa.com">iade@lunarosa.com</a> adresine ya da
        WhatsApp destek hattimiza ulasin.
      </p>

      <h3>2. Kargo Gonderimi</h3>
      <p>
        Onaylanan taleplerde anlasmali kargo bilgisi sizinle paylasilir. Gonderim
        talimata uygun hazirlandiginda surec hizlanir.
      </p>

      <h3>3. Kontrol ve Geri Odeme</h3>
      <p>
        Urun tarafimiza ulastiktan sonra kontrol edilir ve uygun bulunan iadeler,
        odeme yontemine bagli olarak en gec 10 is gunu icinde iade edilir.
      </p>

      <h2>Hasarli veya Yanlis Urun</h2>
      <p>
        Hasarli veya hatali urun teslim aldiysaniz, teslimattan sonraki 48 saat
        icinde bize bildirim yapin. Bu durumda kargo ve degisim sureci tarafimizca
        yonetilir.
      </p>

      <h2>Iletisim</h2>
      <p>
        Destek icin <a href="mailto:destek@lunarosa.com">destek@lunarosa.com</a>{" "}
        adresine yazabilir veya WhatsApp uzerinden ulasabilirsiniz.
      </p>
    </LegalLayout>
  );
}
