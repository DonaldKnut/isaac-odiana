"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { HomeAnnouncementCard } from "@/components/announcement-cards";
import { Reveal } from "@/components/reveal";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { AnnouncementsBundle } from "@/lib/cms/types";

const HOME_SEEN_KEY = "isaac-home-announcement-index";

export function HomeAnnouncements({
  content,
}: {
  content: AnnouncementsBundle;
}) {
  const t = useLocalized();
  const { t: ui } = useLocale();
  const items = content.items;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const raw = localStorage.getItem(HOME_SEEN_KEY);
    const stored = raw ? Number(raw) : 0;
    const start =
      Number.isFinite(stored) && stored >= 0 ? stored % items.length : 0;
    setIndex(start);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[Math.min(index, items.length - 1)]!;

  function showNext() {
    if (items.length <= 1) return;
    setIndex((value) => {
      const next = (value + 1) % items.length;
      localStorage.setItem(HOME_SEEN_KEY, String(next));
      return next;
    });
  }

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
          <div className="flex flex-wrap items-center gap-3">
            {items.length > 1 ? (
              <button
                type="button"
                onClick={showNext}
                className="cursor-pointer text-[0.65rem] uppercase tracking-[0.18em] text-sand transition hover:text-amber-bright"
              >
                Next · {index + 1}/{items.length}
              </button>
            ) : null}
            <Link
              href="/announcements"
              className="text-[0.65rem] uppercase tracking-[0.18em] text-amber-bright transition hover:text-parchment"
            >
              {ui.pages.announcements.viewAll}
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <HomeAnnouncementCard item={current} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
