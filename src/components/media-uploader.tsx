"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MediaUploaderProps = {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  accept?: string;
};

function isImageUrl(url: string) {
  return (
    /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(url) ||
    url.includes("image") ||
    url.includes("unsplash") ||
    url.includes("cloudinary") ||
    url.includes("/upload/")
  );
}

export function MediaUploader({
  label = "Media",
  values,
  onChange,
  multiple = true,
  accept = "image/*",
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const imagesOnly = accept.startsWith("image/");

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;

    setBusy(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of list) {
        if (imagesOnly && !file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image.`);
        }
        if (
          accept.includes("audio/") &&
          !accept.includes("image/") &&
          !accept.includes("video/") &&
          !file.type.startsWith("audio/")
        ) {
          throw new Error(`${file.name} is not an audio file.`);
        }
        if (
          accept.includes("video/") &&
          !accept.includes("image/") &&
          !file.type.startsWith("video/") &&
          !file.type.startsWith("image/")
        ) {
          throw new Error(`${file.name} is not a video or image.`);
        }
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          throw new Error(data.error ?? "Upload failed");
        }
        uploaded.push(data.url);
      }
      onChange(multiple ? [...values, ...uploaded] : uploaded.slice(0, 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    const next = index + delta;
    if (next < 0 || next >= values.length) return;
    const copy = [...values];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item!);
    onChange(copy);
  }

  function onDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (busy) return;
    void uploadFiles(event.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <p className="text-sm text-smoke">{label}</p>
        {values.length > 0 ? (
          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-brass">
            {values.length} {imagesOnly ? "image" : "file"}
            {values.length === 1 ? "" : "s"}
            {multiple && imagesOnly ? " · first is cover" : ""}
          </p>
        ) : null}
      </div>

      <label
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={onDrop}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center border px-4 py-10 text-center transition",
          dragging
            ? "border-amber bg-amber/10"
            : "border-dashed border-line bg-ink/40 hover:border-amber/50 hover:bg-ink-soft/40",
          busy && "pointer-events-none opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          disabled={busy}
          onChange={(event) => {
            if (event.target.files) void uploadFiles(event.target.files);
          }}
        />
        <span className="inline-flex h-12 w-12 items-center justify-center border border-amber/40 bg-amber/10 text-amber-bright transition group-hover:border-amber-bright">
          {busy ? (
            <Upload className="h-5 w-5 animate-pulse" strokeWidth={1.6} />
          ) : (
            <ImagePlus className="h-5 w-5" strokeWidth={1.6} />
          )}
        </span>
        <span className="mt-4 text-[0.7rem] uppercase tracking-[0.22em] text-amber">
          {busy
            ? "Uploading…"
            : dragging
              ? "Drop to upload"
              : imagesOnly
                ? "Choose images"
                : "Choose files"}
        </span>
        <span className="mt-2 max-w-xs text-xs leading-relaxed text-smoke">
          {imagesOnly
            ? "Click to browse or drag images here. Uploads go to Cloudinary."
            : "Click to browse or drag files here."}
        </span>
      </label>

      {error ? <p className="text-sm text-amber-bright">{error}</p> : null}

      {values.length > 0 ? (
        <ul
          className={cn(
            imagesOnly
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
              : "space-y-2",
          )}
        >
          {values.map((url, index) => {
            const showImage = imagesOnly || isImageUrl(url);
            if (!imagesOnly) {
              return (
                <li
                  key={`${url}-${index}`}
                  className="flex items-center gap-3 border border-line px-3 py-2"
                >
                  {showImage ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-ink-soft">
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-ink-soft text-[0.6rem] uppercase tracking-[0.14em] text-smoke">
                      File
                    </div>
                  )}
                  <p className="min-w-0 flex-1 truncate text-xs text-sand">
                    {url}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="cursor-pointer text-[0.65rem] uppercase tracking-[0.14em] text-smoke hover:text-parchment"
                  >
                    Remove
                  </button>
                </li>
              );
            }

            return (
              <li
                key={`${url}-${index}`}
                className="group relative aspect-square overflow-hidden border border-line bg-ink-soft"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 180px"
                />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 bg-amber px-1.5 py-0.5 text-[0.55rem] uppercase tracking-[0.14em] text-ink">
                    Cover
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-ink via-ink/80 to-transparent px-2 pb-2 pt-8 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Move left"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center border border-parchment/20 bg-ink/70 text-parchment disabled:opacity-30"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move right"
                      disabled={index === values.length - 1}
                      onClick={() => move(index, 1)}
                      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center border border-parchment/20 bg-ink/70 text-parchment disabled:opacity-30"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeAt(index)}
                    className="inline-flex h-7 w-7 cursor-pointer items-center justify-center border border-parchment/20 bg-ink/70 text-amber-bright"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}

          {imagesOnly && multiple ? (
            <li>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line text-smoke transition hover:border-amber/50 hover:text-amber-bright disabled:opacity-50"
              >
                <ImagePlus className="h-5 w-5" strokeWidth={1.6} />
                <span className="text-[0.6rem] uppercase tracking-[0.16em]">
                  Add more
                </span>
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
