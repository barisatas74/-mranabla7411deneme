import { cn } from "@/lib/utils";

export default function AdminSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
