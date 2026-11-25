"use client";

import Image from "next/image";
import { AudioLines, Mic2 } from "lucide-react";
import { EmptyStateArt, IconBadge } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { resolveLocalized } from "@/lib/i18n/localize-content";
import { studioMedia } from "@/lib/media";

type Episode = {
  id: string;
  title: string;
  titleFr?: string | null;
  description: string;
  descriptionFr?: string | null;
  category: string | null;
  categoryFr?: string | null;
  coverUrl: string | null;
  audioUrl: string;
};

export function PodcastArchive({ episodes }: { episodes: Episode[] }) {
  const { t, locale } = useLocale();

  if (episodes.length === 0) {
    return (
      <div className="relative overflow-hidden border border-line">
        <Image
          src={studioMedia.headphones}
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative">
          <EmptyStateArt icon={Mic2} title={t.pages.podcast.empty} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {episodes.map((episode, index) => {
        const title = resolveLocalized(episode.title, episode.titleFr, locale);
        const description = resolveLocalized(
          episode.description,
          episode.descriptionFr,
          locale,
        );
        const category = episode.category
          ? resolveLocalized(episode.category, episode.categoryFr, locale)
          : null;

        return (
          <article
            key={episode.id}
            className="group grid overflow-hidden border border-line bg-ink-soft/30 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]"
          >
            <div className="relative min-h-[240px] overflow-hidden md:min-h-full">
              <Image
                src={episode.coverUrl || studioMedia.headphones}
                alt={title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 340px"
                priority={index === 0}
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-12">
              <div className="flex items-center justify-between gap-3">
                {category ? (
                  <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                    <AudioLines className="h-3.5 w-3.5" strokeWidth={1.6} />
                    {category}
                  </p>
                ) : (
                  <span />
                )}
                <IconBadge icon={Mic2} />
              </div>
              <h2 className="mt-3 font-display text-3xl text-parchment md:text-5xl">
                {title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-smoke md:text-base">
                {description}
              </p>
              <div className="mt-8 rounded-none border border-line bg-ink/60 p-4">
                <audio controls className="w-full" preload="none">
                  <source src={episode.audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
