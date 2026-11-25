"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AudioLines,
  BookOpen,
  Disc3,
  Megaphone,
  Mic2,
} from "lucide-react";
import { StudioPreviewModal } from "@/components/studio-preview-modal";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { AnnouncementItem } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

const kindLabel: Record<AnnouncementItem["kind"], { en: string; fr: string }> = {
  episode: { en: "Episode", fr: "Épisode" },
  song: { en: "Song", fr: "Chanson" },
  drop: { en: "Drop", fr: "Sortie" },
  mixtape: { en: "Mixtape", fr: "Mixtape" },
  general: { en: "Update", fr: "Actu" },
};

const ctaByKind: Record<
  AnnouncementItem["kind"],
  { en: string; fr: string }
> = {
  mixtape: { en: "Enter music room", fr: "Entrer dans le salon" },
  episode: { en: "Open podcast", fr: "Ouvrir le podcast" },
  drop: { en: "Browse bookstore", fr: "Voir la librairie" },
  song: { en: "Listen now", fr: "Écouter" },
  general: { en: "Open", fr: "Ouvrir" },
};

export function hrefForAnnouncement(item: AnnouncementItem) {
  if (item.href) return item.href;
  switch (item.kind) {
    case "mixtape":
    case "song":
      return "/music";
    case "episode":
      return "/podcast";
    case "drop":
      return "/books";
    default:
      return "/announcements";
  }
}

function AnnouncementCardShell({
  item,
  className,
  children,
}: {
  item: AnnouncementItem;
  className?: string;
  children: React.ReactNode;
}) {
  const t = useLocalized();
  const { locale, t: ui } = useLocale();
  const [open, setOpen] = useState(false);
  const href = hrefForAnnouncement(item);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group w-full cursor-pointer text-left transition",
          className,
        )}
      >
        {children}
      </button>
      <StudioPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={kindLabel[item.kind][locale]}
        title={t(item.title)}
        body={t(item.body)}
        image={item.image}
        primaryLabel={ctaByKind[item.kind][locale]}
        primaryHref={href}
        secondaryLabel={ui.pages.announcements.viewAll}
        secondaryHref="/announcements"
      />
    </>
  );
}

/** Homepage teaser — each kind has its own composition. Opens modal first. */
export function HomeAnnouncementCard({
  item,
  className,
}: {
  item: AnnouncementItem;
  className?: string;
}) {
  const t = useLocalized();
  const { locale } = useLocale();

  if (item.kind === "mixtape") {
    return (
      <AnnouncementCardShell
        item={item}
        className={cn(
          "relative flex min-h-[420px] flex-col justify-end overflow-hidden border border-line bg-ink",
          className,
        )}
      >
        <Image
          src={item.image}
          alt={t(item.title)}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
        <div className="absolute right-5 top-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber/40 bg-ink/50 backdrop-blur-sm">
          <Disc3
            className="h-7 w-7 text-amber-bright transition duration-700 group-hover:rotate-90"
            strokeWidth={1.4}
          />
        </div>
        <div className="relative z-10 p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.24em] text-amber">
            {kindLabel.mixtape[locale]}
          </p>
          <h3 className="mt-3 max-w-[14ch] font-display text-3xl leading-tight text-parchment">
            {t(item.title)}
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-sand/90">
            {t(item.excerpt)}
          </p>
          <span className="mt-5 inline-flex text-[0.62rem] uppercase tracking-[0.18em] text-amber-bright">
            {ctaByKind.mixtape[locale]}
          </span>
        </div>
      </AnnouncementCardShell>
    );
  }

  if (item.kind === "episode") {
    return (
      <AnnouncementCardShell
        item={item}
        className={cn(
          "flex min-h-[420px] flex-col border border-line bg-ink-soft/40",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-amber">
            <Mic2 className="h-3.5 w-3.5" strokeWidth={1.6} />
            {kindLabel.episode[locale]}
          </p>
          <AudioLines className="h-4 w-4 text-brass/70" strokeWidth={1.5} />
        </div>
        <div className="relative mx-5 mt-5 aspect-[21/9] overflow-hidden border border-line/80">
          <Image
            src={item.image}
            alt={t(item.title)}
            fill
            className="object-cover grayscale transition duration-700 group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col px-5 py-5">
          <h3 className="font-display text-2xl leading-snug text-parchment transition group-hover:text-amber-bright">
            {t(item.title)}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-smoke">
            {t(item.excerpt)}
          </p>
          <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
            <span className="h-px flex-1 bg-gradient-to-r from-amber/50 to-transparent" />
            <span className="text-[0.62rem] uppercase tracking-[0.18em] text-amber-bright">
              {ctaByKind.episode[locale]}
            </span>
          </div>
        </div>
      </AnnouncementCardShell>
    );
  }

  if (item.kind === "drop") {
    return (
      <AnnouncementCardShell
        item={item}
        className={cn(
          "grid min-h-[420px] grid-rows-[1.15fr_0.85fr] border border-line bg-ink",
          className,
        )}
      >
        <div className="relative overflow-hidden">
          <Image
            src={item.image}
            alt={t(item.title)}
            fill
            className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-4 top-4 border border-parchment/25 bg-ink/75 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.18em] text-parchment backdrop-blur-sm">
            {kindLabel.drop[locale]}
          </div>
        </div>
        <div className="flex flex-col justify-between border-t border-line bg-[#12100e] px-5 py-5">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.18em] text-brass">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.6} />
              Bookstore
            </p>
            <h3 className="mt-2 font-display text-2xl leading-snug text-parchment">
              {t(item.title)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              {t(item.excerpt)}
            </p>
          </div>
          <span className="mt-4 inline-flex w-fit border border-amber/40 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-amber-bright transition group-hover:bg-amber/10">
            {ctaByKind.drop[locale]}
          </span>
        </div>
      </AnnouncementCardShell>
    );
  }

  return (
    <AnnouncementCardShell
      item={item}
      className={cn(
        "relative block min-h-[420px] overflow-hidden border border-line bg-ink",
        className,
      )}
    >
      <Image
        src={item.image}
        alt={t(item.title)}
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-amber">
          <Megaphone className="h-3.5 w-3.5" strokeWidth={1.6} />
          {kindLabel[item.kind][locale]}
        </p>
        <h3 className="mt-2 font-display text-2xl text-parchment">
          {t(item.title)}
        </h3>
        <p className="mt-2 text-sm text-smoke">{t(item.excerpt)}</p>
      </div>
    </AnnouncementCardShell>
  );
}

/** Full announcements page — distinct layouts per kind. */
export function AnnouncementArchiveCard({
  item,
}: {
  item: AnnouncementItem;
}) {
  const t = useLocalized();
  const { locale, t: ui } = useLocale();
  const [open, setOpen] = useState(false);
  const href = hrefForAnnouncement(item);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full cursor-pointer text-left"
      >
        {item.kind === "mixtape" ? (
          <article className="overflow-hidden border border-line bg-ink transition hover:border-amber/35">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[320px] lg:min-h-[480px]">
                <Image
                  src={item.image}
                  alt={t(item.title)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/40" />
                <div className="absolute bottom-6 left-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber/45 bg-ink/60 backdrop-blur-md">
                  <Disc3 className="h-9 w-9 text-amber-bright" strokeWidth={1.3} />
                </div>
              </div>
              <div className="flex flex-col justify-center px-6 py-10 md:px-10">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                  {kindLabel.mixtape[locale]}
                  {item.pinned ? " · Pinned" : ""}
                </p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-parchment md:text-5xl">
                  {t(item.title)}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-sand">
                  {t(item.excerpt)}
                </p>
                <span className="mt-8 inline-flex w-fit items-center gap-2 border border-amber/45 bg-amber/10 px-5 py-3 text-[0.65rem] uppercase tracking-[0.18em] text-amber-bright">
                  <Disc3 className="h-3.5 w-3.5" strokeWidth={1.6} />
                  {ctaByKind.mixtape[locale]}
                </span>
              </div>
            </div>
          </article>
        ) : item.kind === "episode" ? (
          <article className="border border-line bg-ink-soft/30 transition hover:border-amber/35">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4 md:px-10">
              <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-amber">
                <Mic2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                {kindLabel.episode[locale]}
              </p>
              <AudioLines className="h-5 w-5 text-brass/60" strokeWidth={1.4} />
            </div>
            <div className="grid gap-0 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="relative min-h-[240px] border-b border-line lg:border-b-0 lg:border-r">
                <Image
                  src={item.image}
                  alt={t(item.title)}
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              </div>
              <div className="px-6 py-8 md:px-10 md:py-12">
                <h2 className="font-display text-3xl text-parchment md:text-4xl">
                  {t(item.title)}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-smoke">
                  {t(item.excerpt)}
                </p>
                <span className="mt-8 inline-flex border-b border-amber/50 pb-1 text-[0.65rem] uppercase tracking-[0.18em] text-amber-bright">
                  {ctaByKind.episode[locale]} →
                </span>
              </div>
            </div>
          </article>
        ) : item.kind === "drop" ? (
          <article className="grid overflow-hidden border border-line transition hover:border-amber/35 md:grid-cols-[0.7fr_1.3fr]">
            <div className="relative min-h-[280px] bg-[#12100e] md:min-h-full">
              <Image
                src={item.image}
                alt={t(item.title)}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 35vw"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-10 md:px-12">
              <div className="inline-flex w-fit items-center gap-2 border border-line px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-brass">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={1.6} />
                {kindLabel.drop[locale]} · Restock
              </div>
              <h2 className="mt-5 font-display text-3xl text-parchment md:text-5xl">
                {t(item.title)}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-sand">
                {t(item.excerpt)}
              </p>
              <span className="mt-8 inline-flex w-fit bg-parchment px-5 py-3 text-[0.65rem] uppercase tracking-[0.18em] text-ink">
                {ctaByKind.drop[locale]}
              </span>
            </div>
          </article>
        ) : (
          <article className="grid overflow-hidden border border-line transition hover:border-amber/35 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[220px]">
              <Image
                src={item.image}
                alt={t(item.title)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <div className="bg-ink-soft/30 px-6 py-8 md:px-10 md:py-10">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-amber">
                {kindLabel[item.kind][locale]}
              </p>
              <h2 className="mt-3 font-display text-3xl text-parchment md:text-4xl">
                {t(item.title)}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-sand md:text-base">
                {t(item.excerpt)}
              </p>
              <span className="mt-6 inline-flex border border-amber/40 px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-amber-bright">
                {ui.enter}
              </span>
            </div>
          </article>
        )}
      </button>

      <StudioPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={kindLabel[item.kind][locale]}
        title={t(item.title)}
        body={t(item.body)}
        image={item.image}
        primaryLabel={ctaByKind[item.kind][locale]}
        primaryHref={href}
        secondaryLabel={
          href !== "/announcements" ? ui.pages.announcements.viewAll : undefined
        }
        secondaryHref={href !== "/announcements" ? "/announcements" : undefined}
      />
    </>
  );
}
