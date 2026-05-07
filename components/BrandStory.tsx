import Container from "./Container";
import Reveal from "./Reveal";

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-bone-50 py-24 md:py-32">
      <div className="absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-rose-300/20 blur-[140px]" />
      <div className="absolute -right-32 top-1/4 h-[360px] w-[360px] rounded-full bg-rose-400/15 blur-[120px]" />

      <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-italic-display text-[320px] leading-none text-rose-600/[0.04] md:block">
        Bella
      </span>

      <Container className="relative">
        <Reveal variant="up" className="mx-auto max-w-3xl text-center">
          <span className="luxe-label">Notre Histoire</span>
          <h2 className="mt-5 font-display text-[44px] leading-[1.02] text-ink-900 md:text-[78px]">
            Feminen zarafetin
            <br />
            <span className="font-italic-display text-gradient-fuchsia">
              modern yorumu
            </span>
          </h2>

          <div className="mx-auto mt-9 max-w-2xl space-y-5 font-light leading-[1.85] text-ink-700">
            <p>
              Miss Bella; kadınların günün her anında kendini bakımlı, güçlü ve
              rahat hissetmesi için tasarlandı. Her ürünümüzde rafine
              siluetleri, yumuşak dokuları ve zamansız çizgileri bir araya
              getiriyoruz.
            </p>
            <p>
              Koleksiyonumuz Türkiye&rsquo;de deneyimli atölyelerde üretiliyor.
              Kaliteye, etik üretime ve uzun ömürlü tasarıma odaklanarak her
              parçayı premium bir deneyime dönüştürüyoruz.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-8 border-t border-ink-900/10 pt-10 md:grid-cols-4">
            <Pillar num="01" title="Etik Üretim" />
            <Pillar num="02" title="Premium Kumaş" />
            <Pillar num="03" title="El İşçiliği" />
            <Pillar num="04" title="Zamansız Stil" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Pillar({ num, title }: { num: string; title: string }) {
  return (
    <div className="text-center">
      <span className="block font-italic-display text-2xl text-rose-600">
        {num}
      </span>
      <p className="mt-2 font-display text-lg text-ink-900">{title}</p>
    </div>
  );
}
