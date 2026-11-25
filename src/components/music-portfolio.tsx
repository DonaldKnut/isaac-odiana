"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Disc3, X } from "lucide-react";
import { ImageSlider } from "@/components/image-slider";
import { useLocale } from "@/components/locale-provider";
import { ModalShell } from "@/components/modal-shell";
import { useLocalized } from "@/components/localized";
import { UiButton } from "@/components/ui-button";
import type { MusicWorkContent } from "@/lib/cms/types";

function workGallery(work: MusicWorkContent) {
  if (work.images?.length) return work.images;
  return work.image ? [work.image] : [];
}

export function MusicPortfolio({ works }: { works: MusicWorkContent[] }) {
  const localize = useLocalized();
  const [active, setActive] = useState<MusicWorkContent | null>(null);

  return (
    <>
      <div className="grid auto-rows-[220px] gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[240px]">
        {works.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
            className={`group relative cursor-pointer overflow-hidden text-left ${item.span || ""}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-95 transition group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                  <Disc3 className="h-3 w-3" strokeWidth={1.6} />
                  {localize(item.kind)}
                </p>
                <ArrowUpRight className="h-4 w-4 text-parchment/70 opacity-0 transition group-hover:opacity-100" />
              </div>
              <h3 className="mt-2 font-display text-2xl text-parchment md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-2 max-w-sm text-sm text-sand/80 opacity-0 transition duration-500 group-hover:opacity-100">
                {localize(item.emphasis)}
              </p>
            </div>
          </button>
        ))}
      </div>

      <MusicWorkModal work={active} onClose={() => setActive(null)} />
    </>
  );
}

function MusicWorkModal({
  work,
  onClose,
}: {
  work: MusicWorkContent | null;
  onClose: () => void;
}) {
  const localize = useLocalized();
  const { t } = useLocale();
  if (!work) return null;

  const gallery = workGallery(work);

  return (
    <ModalShell
      open={Boolean(work)}
      onClose={onClose}
      labelledBy="music-work-title"
      size="xl"
    >
      <div className="grid max-h-[92svh] overflow-y-auto md:grid-cols-2">
        <div className="relative min-h-[280px] border-b border-line md:min-h-[560px] md:border-b-0 md:border-r">
          <ImageSlider
            images={gallery}
            alt={work.title}
            className="absolute inset-0 h-full min-h-[280px] md:min-h-[560px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col justify-between px-6 py-7 sm:px-8 sm:py-9">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-amber">
                  <Disc3 className="h-3.5 w-3.5" />
                  {localize(work.kind)} · {work.year}
                </p>
                <h2
                  id="music-work-title"
                  className="mt-4 font-display text-4xl leading-tight text-parchment md:text-5xl"
                >
                  {work.title}
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

            <p className="mt-5 border-l border-amber/50 pl-4 font-display text-2xl leading-snug text-sand md:text-3xl">
              {localize(work.emphasis)}
            </p>

            <p className="mt-6 text-sm leading-relaxed text-smoke md:text-base">
              {localize(work.description)}
            </p>

            <ul className="mt-8 space-y-3">
              {work.highlights.map((item, index) => (
                <li
                  key={`${index}-${localize(item)}`}
                  className="border-b border-line pb-3 text-sm text-parchment/90"
                >
                  {localize(item)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <UiButton tone="amber" icon={Disc3} onClick={onClose}>
              {t.closeWork}
            </UiButton>
            <UiButton tone="line" onClick={onClose}>
              {t.keepBrowsing}
            </UiButton>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
