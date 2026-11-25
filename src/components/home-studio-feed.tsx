"use client";

import Image from "next/image";
import Link from "next/link";
import { Film, Share2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { HomeStudioFeedContent } from "@/lib/cms/types";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.includes("/video/");
}

export function HomeStudioFeed({ content }: { content: HomeStudioFeedContent }) {
  const t = useLocalized();
  const { t: ui } = useLocale();
  const items = content.items.filter((item) => item.published && item.mediaUrl);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
            <Film className="h-3.5 w-3.5" strokeWidth={1.6} />
            {t(content.eyebrow)}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl text-parchment md:text-5xl">
            {t(content.title)}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-smoke">
            {t(content.body)}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const video = item.kind === "video" || isVideoUrl(item.mediaUrl);
            const body = (
              <div className="relative aspect-[9/14] bg-ink">
                {video ? (
                  <video
                    className="h-full w-full object-cover"
                    src={item.mediaUrl}
                    poster={item.posterUrl || undefined}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={item.mediaUrl}
                    alt={t(item.title)}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/50 to-transparent p-4 pt-16">
                  <p className="inline-flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-amber">
                    {item.kind === "instagram" ? (
                      <Share2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                    ) : (
                      <Film className="h-3.5 w-3.5" strokeWidth={1.6} />
                    )}
                    {item.kind}
                  </p>
                  <p className="mt-2 font-display text-xl text-parchment">
                    {t(item.title)}
                  </p>
                  {item.externalUrl ? (
                    <p className="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-amber-bright">
                      {ui.openOnInstagram}
                    </p>
                  ) : null}
                </div>
              </div>
            );

            return (
              <Reveal key={item.id} delay={index * 0.05}>
                {item.externalUrl ? (
                  <Link
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden border border-line bg-ink-soft/40"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="group relative overflow-hidden border border-line bg-ink-soft/40">
                    {body}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
