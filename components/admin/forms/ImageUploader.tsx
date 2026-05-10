"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import {
  deleteUploadedImage,
  uploadImages,
  type UploadFolder,
} from "@/lib/upload-client";

const ACCEPTED_INPUT_TYPES = "image/jpeg,image/png,image/webp,image/avif";
const MAX_FILE_SIZE_MB = 10;

type ImageUploaderProps = {
  /** Sunucu klasoru — products / categories */
  folder: UploadFolder;
  /** Kontrol edilen URL listesi */
  value: string[];
  /** Liste degistiginde tetiklenir */
  onChange: (urls: string[]) => void;
  /** Birden fazla dosya secimi (default: true) */
  multiple?: boolean;
  /** "Kapak" rozeti gostersin mi (urunler icin) */
  showCoverBadge?: boolean;
  /** Hata mesaji (parent validasyonundan) */
  error?: string;
  /** Toast bildirimi icin opsiyonel callback */
  onNotify?: (
    title: string,
    description: string,
    variant: "success" | "error"
  ) => void;
};

export default function ImageUploader({
  folder,
  value,
  onChange,
  multiple = true,
  showCoverBadge = false,
  error,
  onNotify,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function processFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setLocalError(null);

    if (!multiple && files.length > 1) {
      const first = files.slice(0, 1);
      await processFiles(first);
      return;
    }

    const tooLarge = files.find(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );
    if (tooLarge) {
      const message = `Her görsel en fazla ${MAX_FILE_SIZE_MB} MB olabilir.`;
      setLocalError(message);
      onNotify?.("Yükleme başarısız", message, "error");
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadImages(files, folder);
      const nextValue = multiple
        ? [...value, ...uploaded.map((item) => item.url)]
        : uploaded.slice(0, 1).map((item) => item.url);
      onChange(nextValue);
      onNotify?.(
        uploaded.length > 1 ? `${uploaded.length} görsel yüklendi` : "Görsel yüklendi",
        "Görseller WebP olarak sunucuya kaydedildi.",
        "success"
      );
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Görsel yüklenemedi.";
      setLocalError(message);
      onNotify?.("Yükleme başarısız", message, "error");
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      void processFiles(event.target.files);
      event.target.value = "";
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      void processFiles(event.dataTransfer.files);
    }
  }

  async function handleRemove(url: string) {
    const next = value.filter((item) => item !== url);
    onChange(next);
    // Sunucu hangi URL'i silecegini biliyor (lokal /uploads veya FTP public URL).
    if (url) {
      void deleteUploadedImage(url);
    }
  }

  const displayError = error ?? localError;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_INPUT_TYPES}
        multiple={multiple}
        hidden
        onChange={handleInputChange}
      />

      <div
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          if (!isDraggingOver) setIsDraggingOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDraggingOver(false);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed px-6 py-10 text-center transition ${
          isDraggingOver
            ? "border-rose-400 bg-rose-50/60"
            : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
          {isUploading ? (
            <Upload size={22} className="animate-pulse" />
          ) : (
            <ImagePlus size={22} />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {isUploading
              ? "Görseller WebP'e dönüştürülüyor..."
              : multiple
                ? "Görselleri buraya sürükleyin"
                : "Görseli buraya sürükleyin"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            veya{" "}
            <span className="font-medium text-rose-600 underline-offset-4 hover:underline">
              bilgisayarınızdan seçin
            </span>
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
          JPG · PNG · WEBP · AVIF · maks. {MAX_FILE_SIZE_MB} MB
        </p>
      </div>

      {displayError && (
        <p className="text-sm text-rose-600">{displayError}</p>
      )}

      {value.length > 0 && (
        <div
          className={`grid gap-4 ${
            multiple ? "sm:grid-cols-2 xl:grid-cols-3" : ""
          }`}
        >
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={url}
                  alt={`Görsel ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover"
                  unoptimized={url.startsWith("data:")}
                />
                {showCoverBadge && index === 0 && multiple && (
                  <span className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Kapak
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="truncate text-xs text-slate-500">
                  Görsel {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => void handleRemove(url)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-rose-600"
                  aria-label="Görseli sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
