import Container from "@/components/Container";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <Container className="py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border bg-white p-6 shadow-card md:p-8">
              <Skeleton className="h-8 w-48" />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((__, fieldIndex) => (
                  <Skeleton key={fieldIndex} className="h-12 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-[360px] w-full" />
      </div>
    </Container>
  );
}
