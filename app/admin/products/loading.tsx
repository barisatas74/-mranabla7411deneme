export default function AdminProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-72 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-[24px] bg-white shadow-sm"
          />
        ))}
      </div>
      <div className="h-[520px] animate-pulse rounded-[28px] bg-white shadow-sm" />
    </div>
  );
}
