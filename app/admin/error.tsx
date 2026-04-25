"use client";

import AdminPageError from "@/components/admin/AdminPageError";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      <AdminPageError
        title="Admin paneli yuklenemedi"
        description="Beklenmeyen bir hata olustu. Sayfayi yeniden deneyebilir veya dashboard'a donebilirsiniz."
      />
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
