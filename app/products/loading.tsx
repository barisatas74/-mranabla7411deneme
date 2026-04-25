import Container from "@/components/Container";
import { ProductGridSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <section className="bg-gradient-to-b from-powder-100 via-bone-50 to-bone-50 pt-14 md:pt-20 pb-12 md:pb-16">
        <Container className="text-center flex flex-col items-center gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-16 w-64" />
          <Skeleton className="h-4 w-80" />
        </Container>
      </section>
      <Container className="py-10">
        <div className="flex justify-between gap-4 pb-8 border-b border-ink-900/10">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="mt-10">
          <ProductGridSkeleton count={8} />
        </div>
      </Container>
    </>
  );
}
