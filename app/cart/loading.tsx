import Container from "@/components/Container";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <Container className="py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 border border-ink-900/8 bg-white p-4 shadow-card sm:flex-row sm:p-6"
            >
              <Skeleton className="aspect-[4/5] w-full sm:h-40 sm:w-32" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-[360px] w-full" />
      </div>
    </Container>
  );
}
