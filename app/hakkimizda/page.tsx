import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Hakkimizda",
  description:
    "Miss Bella; premium ic giyim, gecelik ve butik koleksiyonlariyla zarafeti gunluk konfora dokunan butik bir markadir.",
};

export default function HakkimizdaPage() {
  return (
    <LegalLayout
      eyebrow="Marka Hikayesi"
      title="Hakkimizda"
      updated="25 Nisan 2026"
    >
      <p>
        Miss Bella; premium kumaslar, ince isciligi ve zamansiz cizgileri bir
        araya getiren butik bir ic giyim markasidir. Her parca; konforu,
        zarafeti ve dayanikliligi gozeterek Turkiye&apos;de ozenle uretilir.
      </p>

      <h2>Vizyonumuz</h2>
      <p>
        Kadinin gunluk ritueline esiren, kendini iyi hissettiren parcalar
        tasarlamak. Ic giyimi sadece bir ihtiyac olarak degil; konfor, oz guven
        ve estetik dengesinin parcasi olarak konumlandirmak.
      </p>

      <h2>Degerlerimiz</h2>
      <ul>
        <li>El isciligine sayginli, ozenli detay anlayisi</li>
        <li>Premium kumas secimi ve dikis kalitesi</li>
        <li>Yerli uretim ve adil tedarik zinciri</li>
        <li>Musteri memnuniyetini onceleyen sade hizmet</li>
      </ul>

      <h2>Iletisim</h2>
      <p>
        Marka, isbirligi veya basin sorulariniz icin{" "}
        <a href="mailto:hello@missbella.com">hello@missbella.com</a> adresinden
        bize ulasabilirsiniz.
      </p>
    </LegalLayout>
  );
}
