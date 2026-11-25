"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { ModalShell } from "@/components/modal-shell";

export function StudioPreviewModal({
  open,
  onClose,
  eyebrow,
  title,
  body,
  image,
  primaryLabel,
  primaryHref,
  onPrimary,
  secondaryLabel,
  secondaryHref,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  primaryLabel: string;
  primaryHref?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  const { t } = useLocale();

  return (
    <ModalShell open={open} onClose={onClose} labelledBy="studio-preview-title" size="xl">
      <div className="grid max-h-[min(92svh,820px)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[220px] md:min-h-[min(92svh,820px)]">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        </div>

        <div className="flex max-h-[min(92svh,820px)] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 md:px-7">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-amber">
                {eyebrow}
              </p>
              <h2
                id="studio-preview-title"
                className="mt-2 font-display text-3xl leading-tight text-parchment md:text-4xl"
              >
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-smoke transition hover:text-parchment"
              aria-label={t.close}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-7">
            <p className="text-sm leading-relaxed text-sand/90 md:text-base">
              {body}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4 md:px-7">
            {onPrimary ? (
              <button
                type="button"
                onClick={() => {
                  onPrimary();
                  onClose();
                }}
                className="inline-flex cursor-pointer items-center gap-2 bg-parchment px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-ink transition hover:bg-amber"
              >
                {primaryLabel}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            ) : primaryHref ? (
              <Link
                href={primaryHref}
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-parchment px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-ink transition hover:bg-amber"
              >
                {primaryLabel}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </Link>
            ) : null}

            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                onClick={onClose}
                className="inline-flex border border-line px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.16em] text-sand transition hover:border-amber/45 hover:text-amber-bright"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
