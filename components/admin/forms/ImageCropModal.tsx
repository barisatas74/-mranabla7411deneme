"use client";

import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Check, X } from "lucide-react";

type AspectOption = {
  label: string;
  value: number | undefined;
  hint?: string;
};

const ASPECT_OPTIONS: AspectOption[] = [
  { label: "3:4", value: 3 / 4, hint: "Önerilen" },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "Serbest", value: undefined },
];

type ImageCropModalProps = {
  file: File;
  onCancel: () => void;
  onConfirm: (croppedFile: File) => void;
};

export default function ImageCropModal({
  file,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [imageUrl] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(3 / 4);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedArea) return;
    setIsProcessing(true);
    try {
      const cropped = await cropImageToFile(imageUrl, croppedArea, file);
      onConfirm(cropped);
    } finally {
      setIsProcessing(false);
      URL.revokeObjectURL(imageUrl);
    }
  }

  function handleCancel() {
    URL.revokeObjectURL(imageUrl);
    onCancel();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4"
      onClick={handleCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Görseli Kırp
            </h3>
            <p className="text-xs text-slate-500">
              Ürün için uygun alanı seç. Önerilen oran 3:4.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative h-[420px] w-full bg-slate-900">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
          />
        </div>

        <div className="space-y-4 border-t border-slate-200 px-6 py-5">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              En / Boy Oranı
            </span>
            <div className="flex flex-wrap gap-2">
              {ASPECT_OPTIONS.map((opt) => {
                const active = aspect === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setAspect(opt.value)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {opt.label}
                    {opt.hint && (
                      <span className="ml-1.5 text-[10px] text-slate-400">
                        {opt.hint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="zoom"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Yakınlaştır
            </label>
            <input
              id="zoom"
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing || !croppedArea}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <Check size={15} />
            {isProcessing ? "İşleniyor..." : "Kırp ve Kullan"}
          </button>
        </div>
      </div>
    </div>
  );
}

async function cropImageToFile(
  imageUrl: string,
  area: Area,
  original: File
): Promise<File> {
  const image = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context alinamadi");

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.95)
  );
  if (!blob) throw new Error("Gorsel olusturulamadi");

  const ext = "webp";
  const baseName = original.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}-cropped.${ext}`, { type: "image/webp" });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
