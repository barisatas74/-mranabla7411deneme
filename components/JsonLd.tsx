/**
 * Schema.org JSON-LD render bileşeni.
 * Server component — head'e enjekte edilir, hidrasyon overhead'i yok.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify XSS güvenli; data sabit veya server-render değer
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
