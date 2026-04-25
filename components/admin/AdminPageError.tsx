import Link from "next/link";

export default function AdminPageError({
  title,
  description,
  href = "/admin",
}: {
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className="rounded-[28px] border border-red-100 bg-white p-8 shadow-sm">
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
        Hata
      </span>
      <h2 className="mt-4 text-3xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-950"
      >
        Geri Don
      </Link>
    </div>
  );
}
