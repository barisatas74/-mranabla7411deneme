"use client";

import { useEffect, useState } from "react";
import { Ruler, X } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "general", label: "Beden Tablosu" },
  { id: "bra", label: "Sutyen Olcumu" },
  { id: "tips", label: "Olcum Ipuclari" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const generalRows: { size: string; bust: string; waist: string; hip: string }[] = [
  { size: "XS", bust: "78-82", waist: "60-64", hip: "84-88" },
  { size: "S", bust: "82-86", waist: "64-68", hip: "88-92" },
  { size: "M", bust: "86-90", waist: "68-72", hip: "92-96" },
  { size: "L", bust: "90-95", waist: "72-77", hip: "96-101" },
  { size: "XL", bust: "95-100", waist: "77-82", hip: "101-106" },
];

const braRows: { size: string; underBust: string; bust: string }[] = [
  { size: "75B", underBust: "73-77", bust: "88-90" },
  { size: "75C", underBust: "73-77", bust: "90-92" },
  { size: "80B", underBust: "78-82", bust: "93-95" },
  { size: "80C", underBust: "78-82", bust: "95-97" },
  { size: "85B", underBust: "83-87", bust: "98-100" },
  { size: "85C", underBust: "83-87", bust: "100-102" },
];

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-editorial text-ink-700 transition hover:text-rose-600"
      >
        <Ruler size={13} strokeWidth={1.5} />
        Beden Rehberi
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Beden Rehberi"
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
        >
          <div
            className="absolute inset-0 bg-ink-950/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-bone-50 shadow-luxe">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-900/10 bg-bone-50/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] uppercase tracking-editorial text-rose-600">
                  Olcum Tablosu
                </p>
                <h3 className="mt-1 font-display text-2xl text-ink-900">
                  Beden Rehberi
                </h3>
              </div>
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => setOpen(false)}
                className="text-ink-700 transition hover:text-rose-600"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="border-b border-ink-900/8 px-6">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap border-b-2 px-3 py-3 text-[11px] uppercase tracking-editorial transition",
                      activeTab === tab.id
                        ? "border-rose-600 text-ink-900"
                        : "border-transparent text-ink-600 hover:text-ink-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">
              {activeTab === "general" && (
                <>
                  <p className="mb-5 text-sm text-ink-700">
                    Asagidaki olcumler vucut olcusu (cm) cinsinden verilmistir. Iki
                    beden arasi kaldiysaniz buyuk bedeni tercih etmenizi oneririz.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-ink-900/15 text-left text-[11px] uppercase tracking-editorial text-ink-700">
                          <th className="py-3 font-medium">Beden</th>
                          <th className="py-3 font-medium">Gogus (cm)</th>
                          <th className="py-3 font-medium">Bel (cm)</th>
                          <th className="py-3 font-medium">Kalca (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generalRows.map((row) => (
                          <tr
                            key={row.size}
                            className="border-b border-ink-900/8 text-ink-800"
                          >
                            <td className="py-3 font-medium text-ink-900">
                              {row.size}
                            </td>
                            <td className="py-3">{row.bust}</td>
                            <td className="py-3">{row.waist}</td>
                            <td className="py-3">{row.hip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === "bra" && (
                <>
                  <p className="mb-5 text-sm text-ink-700">
                    Sutyen bedenleri gogus alti olcunuz + cup boyutu kombinasyonu
                    ile belirlenir. Olcunuzu mezura ile cogus alti hizasindan dogru
                    aliniz.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-ink-900/15 text-left text-[11px] uppercase tracking-editorial text-ink-700">
                          <th className="py-3 font-medium">Beden</th>
                          <th className="py-3 font-medium">Gogus Alti (cm)</th>
                          <th className="py-3 font-medium">Gogus (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {braRows.map((row) => (
                          <tr
                            key={row.size}
                            className="border-b border-ink-900/8 text-ink-800"
                          >
                            <td className="py-3 font-medium text-ink-900">
                              {row.size}
                            </td>
                            <td className="py-3">{row.underBust}</td>
                            <td className="py-3">{row.bust}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === "tips" && (
                <ol className="space-y-5 text-sm leading-relaxed text-ink-800">
                  <li>
                    <p className="font-display text-lg text-ink-900">
                      1. Gogus Cevresi
                    </p>
                    <p className="mt-1 text-ink-700">
                      Mezurayi gogsunuzun en dolgun bolgesinden, gevsek olmayacak
                      sekilde cevirin. Nefes verirken olcun.
                    </p>
                  </li>
                  <li>
                    <p className="font-display text-lg text-ink-900">2. Bel</p>
                    <p className="mt-1 text-ink-700">
                      Belin en ince yerinden, mezurayi sikistirmadan cevirin.
                      Vucudunuza dik tutun.
                    </p>
                  </li>
                  <li>
                    <p className="font-display text-lg text-ink-900">3. Kalca</p>
                    <p className="mt-1 text-ink-700">
                      Kalcanin en genis bolumunden, ayaklar bitisik halde olcun.
                    </p>
                  </li>
                  <li>
                    <p className="font-display text-lg text-ink-900">
                      4. Sutyen Gogus Alti
                    </p>
                    <p className="mt-1 text-ink-700">
                      Mezurayi gogus alti hizasinda, vucuda paralel sekilde cevirin.
                      Olcuyu cm cinsinden alin.
                    </p>
                  </li>
                  <li>
                    <p className="text-[12px] text-ink-600">
                      Iki beden arasinda kalirsaniz, daha rahat oldugu icin buyuk
                      bedeni tercih etmenizi oneririz.
                    </p>
                  </li>
                </ol>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
