import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "KVKK Aydinlatma Metni",
  description:
    "Miss Bella musteri verilerinin hangi hukuki sebeplerle ve hangi amaclarla islendigi hakkinda KVKK aydinlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalLayout
      eyebrow="Yasal Bilgilendirme"
      title="KVKK Aydinlatma Metni"
      updated="25 Nisan 2026"
    >
      <p>
        6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda Miss Bella olarak,
        veri sorumlusu sifatiyla isledigimiz kisisel veriler ve bu verilere iliskin
        haklariniz konusunda sizi bilgilendiriyoruz.
      </p>

      <h2>Veri Sorumlusu</h2>
      <p>
        <strong>Miss Bella</strong>
        <br />
        E-posta: kvkk@missbella.com
        <br />
        Destek Hatti: +90 555 000 00 00
      </p>

      <h2>Islenen Kisisel Veriler</h2>
      <ul>
        <li>Kimlik bilgileri: ad ve soyad</li>
        <li>Iletisim bilgileri: telefon, e-posta, teslimat adresi</li>
        <li>Musteri islem verileri: siparis, iade ve destek kayitlari</li>
        <li>Finans verileri: odeme islemine iliskin sinirli bilgiler</li>
        <li>Islem guvenligi verileri: IP adresi ve cerez kayitlari</li>
      </ul>

      <h2>Isleme Amaçlari</h2>
      <ul>
        <li>Siparislerin alinmasi, hazirlanmasi ve teslim edilmesi</li>
        <li>Iade, degisim ve musteri destek sureclerinin yurutulmesi</li>
        <li>Yasal yukumluluklerin yerine getirilmesi</li>
        <li>Acik rizaniz varsa kampanya ve bulten iletisimi kurulmasi</li>
      </ul>

      <h2>Aktarim Yapilan Taraflar</h2>
      <p>
        Verileriniz, teslimat surecini tamamlayabilmek icin kargo is ortaklarimizla,
        odeme surecini yurutmek icin odeme kuruluslariyla ve hukuki zorunluluklar
        halinde yetkili kamu kurumlariyla paylasilabilir.
      </p>

      <h2>Haklariniz</h2>
      <ul>
        <li>Verilerinizin islenip islenmedigini ogrenme</li>
        <li>Islenen verileriniz hakkinda bilgi talep etme</li>
        <li>Yanlis veya eksik verilerin duzeltilmesini isteme</li>
        <li>Verilerin silinmesini veya yok edilmesini talep etme</li>
        <li>Aktarim yapilan ucuncu kisilere bilgilendirme yapilmasini isteme</li>
      </ul>

      <h2>Basvuru Yontemi</h2>
      <p>
        KVKK kapsamindaki taleplerinizi{" "}
        <a href="mailto:kvkk@missbella.com">kvkk@missbella.com</a> adresine
        yazili olarak iletebilirsiniz. Basvurulariniz mevzuatta belirtilen sureler
        icinde degerlendirilir.
      </p>

      <p className="mt-10 text-[12px] text-ink-600">
        Bu sayfa bilgilendirme amaclidir. Nihai hukuki metinlerin yayin oncesinde
        profesyonel hukuk danismani tarafindan kontrol edilmesi onerilir.
      </p>
    </LegalLayout>
  );
}
