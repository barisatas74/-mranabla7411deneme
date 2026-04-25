import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Container from "./Container";

export type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <Container className="py-5">
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-[10px] tracking-editorial uppercase text-ink-600 overflow-x-auto no-scrollbar"
      >
        <Link href="/" className="hover:text-rose-600 whitespace-nowrap">
          Anasayfa
        </Link>
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
            <ChevronRight size={11} strokeWidth={1.5} className="opacity-60" />
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-rose-600">
                {c.label}
              </Link>
            ) : (
              <span className="text-ink-900 truncate max-w-[200px]">
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </Container>
  );
}
