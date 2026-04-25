import Container from "@/components/Container";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <Container className="py-5">
        <Skeleton className="h-3 w-64" />
      </Container>
      <Container className="grid md:grid-cols-12 gap-8 md:gap-16 pb-20">
        <div className="md:col-span-7 space-y-3">
          <Skeleton className="aspect-[3/4]" />
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        </div>
        <div className="md:col-span-5 space-y-5 md:pt-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-14" />
              ))}
            </div>
          </div>
          <Skeleton className="h-14 w-full" />
        </div>
      </Container>
    </>
  );
}
