"use client";

import Image from "next/image";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableImageItemProps = {
  id: string;
  url: string;
  index: number;
  showCoverBadge?: boolean;
  multiple?: boolean;
  onRemove: () => void;
};

export default function SortableImageItem({
  id,
  url,
  index,
  showCoverBadge,
  multiple,
  onRemove,
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50"
    >
      <div className="relative aspect-[3/4]">
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
        {/* Sürükleme tutamacı */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute right-3 top-3 cursor-grab rounded-full bg-white/90 p-1.5 text-slate-600 opacity-0 shadow-sm transition group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Sıralamak için sürükle"
        >
          <GripVertical size={15} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-xs text-slate-500">Görsel {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-rose-600"
          aria-label="Görseli sil"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
