import { ReactNode } from "react";
import Container from "./Container";
import Breadcrumb from "./Breadcrumb";

export default function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Breadcrumb items={[{ label: title }]} />

      <section className="border-b border-ink-900/8 bg-gradient-to-b from-powder-100 to-bone-50 py-12 md:py-20">
        <Container className="text-center">
          <span className="luxe-label">{eyebrow}</span>
          <h1 className="mt-4 font-display text-[40px] leading-[1.05] text-ink-900 md:text-[64px]">
            {title}
          </h1>
          <p className="mt-5 text-[10px] uppercase tracking-editorial text-ink-600">
            Son guncelleme · {updated}
          </p>
        </Container>
      </section>

      <Container className="max-w-3xl py-14 md:py-20">
        <article className="legal-prose">{children}</article>
      </Container>
    </>
  );
}
