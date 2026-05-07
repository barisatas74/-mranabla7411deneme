import Image from "next/image";
import Container from "./Container";
import Reveal from "./Reveal";

export default function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-bone-50 py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-20">
          <Reveal variant="left" className="relative md:col-span-6">
            <div className="relative h-[460px] overflow-hidden shadow-luxe img-reveal md:h-[620px]">
              <Image
                src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1200&q=90"
                alt="Miss Bella atölyeden bir görünüm"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/30 via-transparent to-transparent" />
            </div>

            <div className="glass-card hover-lift absolute -bottom-3 -right-3 max-w-[240px] p-6 md:-bottom-6 md:-right-6 md:max-w-[280px] md:p-7">
              <p className="luxe-label plain text-rose-600">Est. 2020</p>
              <p className="mt-3 font-italic-display text-[22px] leading-[1.3] text-ink-900 md:text-[26px]">
                Zarafet, kendini iyi hissettiğin anda başlar.
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-editorial text-ink-600">
                Miss Bella Atölyesi
              </p>
            </div>

            <span className="absolute -left-6 -top-6 hidden select-none font-italic-display text-[140px] leading-none text-rose-600/10 md:block">
              M<span className="font-display not-italic">B</span>
            </span>
          </Reveal>

          <Reveal variant="right" delay={150} className="md:col-span-6">
            <span className="luxe-label">Notre Histoire</span>
            <h2 className="mt-5 font-display text-[42px] leading-[1.02] text-ink-900 md:text-[68px]">
              Feminen zarafetin
              <br />
              <span className="font-italic-display text-gradient-fuchsia">
                modern yorumu
              </span>
            </h2>

            <div className="mt-8 space-y-5 font-light leading-[1.85] text-ink-700">
              <p>
                Miss Bella, kadınların günün her anında kendini bakımlı, güçlü ve
                rahat hissetmesi için tasarlandı. Her ürünümüzde rafine siluetleri,
                yumuşak dokuları ve zamansız çizgileri bir araya getiriyoruz.
              </p>
              <p>
                Koleksiyonumuz Türkiye&apos;de deneyimli atölyelerde üretiliyor.
                Kaliteye, etik üretime ve uzun ömürlü tasarıma odaklanarak her
                parçayı teslim edilebilir bir premium deneyime dönüştürüyoruz.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink-900/10 pt-8">
              <Pillar
                num="01"
                title="Etik Üretim"
                text="Şeffaf süreçler ve sorumlu üretim anlayışı."
              />
              <Pillar
                num="02"
                title="Premium Kumaş"
                text="Tenle uyumlu, akıcı ve konforlu seçimler."
              />
              <Pillar
                num="03"
                title="El İşçiliği"
                text="Butik dokunuşlarla tamamlanan rafine detaylar."
              />
              <Pillar
                num="04"
                title="Zamansız Stil"
                text="Sezonlar ötesine taşınan sade ve güçlü tasarım."
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Pillar({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] tracking-editorial text-rose-600">
          {num}
        </span>
        <p className="font-display text-xl text-ink-900">{title}</p>
      </div>
      <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-700">
        {text}
      </p>
    </div>
  );
}
