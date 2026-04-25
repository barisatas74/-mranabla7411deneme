import Link from "next/link";

export default function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
        Bos Durum
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
