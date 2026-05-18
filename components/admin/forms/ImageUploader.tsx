"use client";

import { useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import {
  deleteUploadedImage,
  uploadImages,
  type UploadFolder,
} from "@/lib/upload-client";
import ImageCropModal from "@/components/admin/forms/ImageCropModal";
import SortableImageItem from "@/components/admin/forms/SortableImageItem";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

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
  const [cropQueue, setCropQueue] = useState<File[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.indexOf(String(active.id));
    const newIndex = value.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(value, oldIndex, newIndex));
  }

  async function uploadFiles(files: File[]) {
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

  function processFiles(fileList: FileList | File[]) {
    let files = Array.from(fileList);
    if (files.length === 0) return;

    setLocalError(null);

    if (!multiple && files.length > 1) {
      files = files.slice(0, 1);
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

    // Kirpma modalini ac — kullanici tamamlayinca yukleme baslar
    setCropQueue(files);
  }

  function handleCropConfirm(croppedFile: File) {
    const remaining = cropQueue.slice(1);
    setCropQueue(remaining);
    void uploadFiles([croppedFile]);
  }

  function handleCropCancel() {
    setCropQueue((current) => current.slice(1));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      processFiles(event.target.files);
      event.target.value = "";
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFiles(event.dataTransfer.files);
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

  const activeCropFile = cropQueue[0];

  return (
    <div className="space-y-3">
      {activeCropFile && (
        <ImageCropModal
          key={activeCropFile.name + activeCropFile.size}
          file={activeCropFile}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}

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
        <>
          {multiple && value.length > 1 && (
            <p className="text-xs text-slate-500">
              Görselleri sürükleyerek sıralayabilirsin. İlk görsel kapak olur.
            </p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={value} strategy={rectSortingStrategy}>
              <div
                className={`grid gap-4 ${
                  multiple ? "sm:grid-cols-2 xl:grid-cols-3" : ""
                }`}
              >
                {value.map((url, index) => (
                  <SortableImageItem
                    key={url}
                    id={url}
                    url={url}
                    index={index}
                    showCoverBadge={showCoverBadge}
                    multiple={multiple}
                    onRemove={() => void handleRemove(url)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
