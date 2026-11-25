"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { AnnouncementItem } from "@/lib/cms/types";
import { claimSitePromo, releaseSitePromo } from "@/lib/site-promo";

const SEEN_KEY = "isaac-announcement-seen";
const QUEUE_KEY = "isaac-announcement-queue";

function announcementHref(item: AnnouncementItem) {
  if (item.href?.trim()) return item.href.trim();
  return "/announcements";
}

function loadSeenIds(): Set<string> {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem(SEEN_KEY);
      return legacy ? new Set<string>([legacy]) : new Set<string>();
    }
    const parsed = JSON.parse(raw) as unknown;
    const ids = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
    return new Set<string>(ids);
  } catch {
    return new Set<string>();
  }
}

function persistSeenIds(ids: Set<string>) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify([...ids]));
}

export function AnnouncementCallout({
  items,
}: {
  items: AnnouncementItem[];
}) {
  const pathname = usePathname();
  const t = useLocalized();
  const { t: ui } = useLocale();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set());

  const onBoard = pathname.startsWith("/announcements");
  const onHome = pathname === "/";
  const suppressed = onBoard || onHome;

  const queue = useMemo(
    () => items.filter((item) => item.published !== false),
    [items],
  );

  const active = queue.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    setSeenIds(loadSeenIds());
  }, []);

  useEffect(() => {
    if (suppressed || queue.length === 0) {
      setOpen(false);
      setExpanded(false);
      setActiveId(null);
      releaseSitePromo("announcement");
      return;
    }

    const next = queue.find((item) => !seenIds.has(item.id)) ?? null;
    if (!next) {
      setOpen(false);
      setExpanded(false);
      setActiveId(null);
      releaseSitePromo("announcement");
      return;
    }

    let cancelled = false;
    let retryTimer: number | undefined;

    const tryShow = () => {
      if (cancelled) return;
      if (!claimSitePromo("announcement")) {
        retryTimer = window.setTimeout(tryShow, 3500);
        return;
      }
      setActiveId(next.id);
      setOpen(true);
      setExpanded(true);
    };

    const timer = window.setTimeout(tryShow, 1600);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [suppressed, queue, seenIds]);

  function dismiss() {
    if (!active) return;
    const nextSeen = new Set(seenIds);
    nextSeen.add(active.id);
    setSeenIds(nextSeen);
    persistSeenIds(nextSeen);
    localStorage.setItem(SEEN_KEY, active.id);
    setOpen(false);
    setExpanded(false);
    setActiveId(null);
    releaseSitePromo("announcement");
  }

  if (!active || !open || suppressed) return null;

  const primaryHref = announcementHref(active);
  const showViewAll = primaryHref !== "/announcements";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            width: expanded ? "min(92vw, 22rem)" : "3.25rem",
            height: expanded ? "auto" : "3.25rem",
          }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[5.75rem] right-3 z-[95] overflow-hidden border border-amber/35 bg-ink/95 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-md md:bottom-6 md:right-6"
        >
          {expanded ? (
            <div className="w-[min(92vw,22rem)]">
              <div className="relative h-28">
                <Image
                  src={active.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="352px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                <button
                  type="button"
                  onClick={dismiss}
                  className="absolute right-2 top-2 cursor-pointer border border-line/70 bg-ink/70 p-1 text-smoke hover:text-parchment"
                  aria-label={ui.close}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-4">
                <p className="inline-flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-amber">
                  <Megaphone className="h-3 w-3" strokeWidth={1.6} />
                  {ui.nav.announcements}
                </p>
                <p className="mt-2 font-display text-xl text-parchment">
                  {t(active.title)}
                </p>
                <p className="mt-1 text-sm text-smoke">{t(active.excerpt)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={primaryHref}
                    onClick={dismiss}
                    className="inline-flex border border-amber/45 bg-amber/15 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-amber-bright transition hover:bg-amber/25"
                  >
                    {ui.pages.announcements.open}
                  </Link>
                  {showViewAll ? (
                    <Link
                      href="/announcements"
                      onClick={dismiss}
                      className="inline-flex text-[0.62rem] uppercase tracking-[0.16em] text-smoke transition hover:text-parchment"
                    >
                      {ui.pages.announcements.viewAll}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex h-[3.25rem] w-[3.25rem] cursor-pointer items-center justify-center text-amber-bright"
              aria-label={ui.nav.announcements}
            >
              <Megaphone className="h-4 w-4" strokeWidth={1.7} />
            </button>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
