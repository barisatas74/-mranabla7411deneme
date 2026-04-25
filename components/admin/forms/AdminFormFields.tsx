"use client";

import { cn } from "@/lib/utils";

export function AdminInputField({
  label,
  value,
  onChange,
  error,
  hint,
  className,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  className?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-slate-400">{hint}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
      />
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </label>
  );
}

export function AdminTextAreaField({
  label,
  value,
  onChange,
  error,
  hint,
  className,
  rows = 5,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  className?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-slate-400">{hint}</span>}
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
      />
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </label>
  );
}

export function AdminSelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminCheckboxField({
  label,
  checked,
  onChange,
  className,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-slate-950"
      />
      {label}
    </label>
  );
}
