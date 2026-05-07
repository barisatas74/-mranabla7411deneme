import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Miss Bella; premium iç giyim, gecelik ve butik koleksiyonlarıyla zarafeti günlük konfora dokunan butik bir markadır.",
};

export default function HakkimizdaPage() {
  return (
    <LegalLayout
      eyebrow="Marka Hikayesi"
      title="Hakkımızda"
      updated="25 Nisan 2026"
    >
      <p>
        Miss Bella; premium kumaşlar, ince işçiliği ve zamansız çizgileri bir
        araya getiren butik bir iç giyim markasıdır. Her parça; konforu,
        zarafeti ve dayanıklılığı göze alarak Türkiye&apos;de özenle üretilir.
      </p>

      <h2>Vizyonumuz</h2>
      <p>
        Kadının günlük ritüeline eşiren, kendini iyi hissettiren parçalar
        tasarlamak. İç giyimi sadece bir ihtiyaç olarak değil; konfor, öz güven
        ve estetik dengesinin parçası olarak konumlandırmak.
      </p>

      <h2>Değerlerimiz</h2>
      <ul>
        <li>El işçiliğine saygınlı, özenli detay anlayışı</li>
        <li>Premium kumaş seçimi ve dikiş kalitesi</li>
        <li>Yerli üretim ve adil tedarik zinciri</li>
        <li>Müşteri memnuniyetini önceleyen sade hizmet</li>
      </ul>

      <h2>İletişim</h2>
      <p>
        Marka, işbirliği veya basın sorularınız için{" "}
        <a href="mailto:hello@missbella.com">hello@missbella.com</a> adresinden
        bize ulaşabilirsiniz.
      </p>
    </LegalLayout>
  );
}
