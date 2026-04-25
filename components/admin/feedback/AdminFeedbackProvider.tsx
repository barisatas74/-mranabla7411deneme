"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};

type FeedbackContextValue = {
  toast: (input: Omit<ToastItem, "id">) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function AdminFeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const idRef = useRef(1);
  const confirmResolverRef = useRef<((value: boolean) => void) | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant }: Omit<ToastItem, "id">) => {
      const id = idRef.current++;
      setToasts((current) => [...current, { id, title, description, variant }]);
      window.setTimeout(() => removeToast(id), 3200);
    },
    [removeToast]
  );

  const closeConfirm = useCallback((value: boolean) => {
    confirmResolverRef.current?.(value);
    confirmResolverRef.current = null;
    setConfirmState(null);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmState(options);

    return new Promise<boolean>((resolve) => {
      confirmResolverRef.current = resolve;
    });
  }, []);

  const value = useMemo(
    () => ({
      toast,
      confirm,
    }),
    [confirm, toast]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto rounded-[24px] border border-slate-200 bg-white p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full",
                  item.variant === "success" && "bg-emerald-50 text-emerald-600",
                  item.variant === "error" && "bg-rose-50 text-rose-600",
                  item.variant === "info" && "bg-slate-100 text-slate-700"
                )}
              >
                {item.variant === "success" && <CheckCircle2 size={18} />}
                {item.variant === "error" && <AlertTriangle size={18} />}
                {item.variant === "info" && <Info size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-950">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Toast kapat"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmState && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {confirmState.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {confirmState.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => closeConfirm(false)}
                className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-950"
              >
                {confirmState.cancelLabel ?? "Vazgec"}
              </button>
              <button
                type="button"
                onClick={() => closeConfirm(true)}
                className={cn(
                  "flex-1 rounded-full px-5 py-3 text-sm font-medium text-white transition",
                  confirmState.tone === "danger"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-slate-950 hover:bg-slate-800"
                )}
              >
                {confirmState.confirmLabel ?? "Onayla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

function useFeedbackContext() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("Admin feedback hooks must be used within AdminFeedbackProvider");
  }

  return context;
}

export function useAdminToast() {
  return useFeedbackContext().toast;
}

export function useAdminConfirm() {
  return useFeedbackContext().confirm;
}
