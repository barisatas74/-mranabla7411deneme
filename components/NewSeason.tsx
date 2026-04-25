import Link from "next/link";
import Image from "next/image";
import Container from "./Container";

export default function NewSeason() {
  return (
    <section className="py-24 md:py-32 bg-bone-50 relative overflow-hidden">
      <span className="hidden md:block absolute top-20 right-12 font-italic-display text-[160px] text-rose-600/5 select-none leading-none">
        Spring
      </span>

      <Container>
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1 md:col-span-5">
            <span className="luxe-label">Nouvelle Saison</span>
            <h2 className="font-display text-[42px] md:text-[68px] leading-[1.02] text-ink-900 mt-5">
              İlkbahar
              <br />
              <span className="font-italic-display text-rose-600">
                Rosa
              </span>{" "}
              2026
            </h2>

            <div className="mt-7 flex items-start gap-5 max-w-md">
              <span className="mt-2 h-px w-10 bg-ink-900/30 flex-shrink-0" />
              <p className="text-ink-700 leading-[1.8] font-light">
                Yumuşak pudra tonları, narin Fransız danteli ve saf ipek
                dokunuşuyla tasarlanan yeni sezon koleksiyonumuz, modern
                kadının zamansız zarafetine bir övgü.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-5">
              {[
                { k: "42", v: "Yeni Parça" },
                { k: "08", v: "Lüks Kumaş" },
                { k: "100", v: "El İşçiliği %" },
              ].map((s) => (
                <div key={s.v} className="border-l border-rose-600/30 pl-4">
                  <p className="font-display text-[40px] text-ink-900 leading-none">
                    {s.k}
                  </p>
                  <p className="text-[10px] tracking-editorial uppercase text-ink-600 mt-2">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/products?filter=new"
              className="btn-luxe btn-luxe-dark shadow-soft mt-10"
            >
              Koleksiyonu İncele
            </Link>
          </div>

          <div className="order-1 md:order-2 md:col-span-7 grid grid-cols-6 grid-rows-6 gap-3 md:gap-4 h-[460px] md:h-[640px]">
            <div className="col-span-4 row-span-6 relative overflow-hidden img-reveal shadow-luxe">
              <Image
                src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=1000&q=90"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="col-span-2 row-span-3 relative overflow-hidden img-reveal shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1583515558997-83406f8e024e?w=600&q=90"
                alt=""
                fill
                className="object-cover"
              />
            </div>
            <div className="col-span-2 row-span-3 relative overflow-hidden img-reveal shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600&q=90"
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
