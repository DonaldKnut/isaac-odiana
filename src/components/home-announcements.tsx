"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { HomeAnnouncementCard } from "@/components/announcement-cards";
import { Reveal } from "@/components/reveal";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { AnnouncementsBundle } from "@/lib/cms/types";

export function HomeAnnouncements({
  content,
}: {
  content: AnnouncementsBundle;
}) {
  const t = useLocalized();
  const { t: ui } = useLocale();
  const items = content.items.slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-line bg-ink-soft/25">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
              <Megaphone className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t(content.eyebrow)}
            </p>
            <h2 className="mt-3 font-display text-3xl text-parchment md:text-4xl">
              {ui.pages.announcements.latest}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-smoke md:text-base">
              {t(content.body)}
            </p>
          </div>
          <Link
            href="/announcements"
            className="text-[0.65rem] uppercase tracking-[0.18em] text-amber-bright transition hover:text-parchment"
          >
            {ui.pages.announcements.viewAll}
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <HomeAnnouncementCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
