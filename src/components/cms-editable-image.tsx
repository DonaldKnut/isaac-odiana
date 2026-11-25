"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import {
  updateHomepageImageAction,
  type HomepageImageTarget,
} from "@/app/actions/cms";
import { useAdminEdit } from "@/components/admin-edit-provider";
import { useToast } from "@/components/toast-provider";
import { cn } from "@/lib/utils";

type CmsEditableImageProps = {
  src: string;
  alt: string;
  target: HomepageImageTarget;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  wrapperClassName?: string;
};

export function CmsEditableImage({
  src,
  alt,
  target,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  wrapperClassName,
}: CmsEditableImageProps) {
  const isAdmin = useAdminEdit();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(src);
  const [pending, startTransition] = useTransition();

  async function onPick(file: File | undefined) {
    if (!file || !isAdmin) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Upload", "Choose an image file.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
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

      startTransition(async () => {
        const result = await updateHomepageImageAction({
          target,
          url: data.url!,
        });
        if (!result.ok) {
          setPreview(src);
          toast.error("Error", result.message);
          return;
        }
        setPreview(data.url!);
        toast.success("Image updated", result.message);
      });
    } catch (error) {
      setPreview(src);
      toast.error(
        "Upload failed",
        error instanceof Error ? error.message : "Could not upload image.",
      );
    } finally {
      URL.revokeObjectURL(localUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn(fill ? "absolute inset-0" : "relative", wrapperClassName)}>
      <Image
        src={preview}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        sizes={sizes}
        priority={priority}
      />
      {isAdmin ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={pending}
            className="absolute right-3 top-3 z-20 inline-flex cursor-pointer items-center gap-1.5 border border-amber/50 bg-ink/90 px-2.5 py-1.5 text-[0.58rem] uppercase tracking-[0.16em] text-amber-bright shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-amber hover:bg-ink disabled:opacity-60"
            aria-label="Change image"
          >
            {pending ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" strokeWidth={1.7} />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" strokeWidth={1.7} />
            )}
            {pending ? "Saving" : "Edit image"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void onPick(event.target.files?.[0])}
          />
        </>
      ) : null}
    </div>
  );
}
