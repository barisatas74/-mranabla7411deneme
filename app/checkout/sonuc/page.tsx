import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentResultClient from "./PaymentResultClient";

export const metadata: Metadata = {
  title: "Ödeme Sonucu",
  robots: { index: false, follow: false },
};

export default function PaymentResultPage() {
  return (
    <Suspense fallback={null}>
      <PaymentResultClient />
    </Suspense>
  );
}
