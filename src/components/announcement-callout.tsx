"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useLocalized } from "@/components/localized";
import type { AnnouncementItem } from "@/lib/cms/types";

const SEEN_KEY = "isaac-announcement-seen";
const INTERVAL_MS = 1000 * 60 * 4;

export function AnnouncementCallout({
  item,
}: {
  item: AnnouncementItem | null;
}) {
  const pathname = usePathname();
  const t = useLocalized();
  const { t: ui } = useLocale();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const onBoard = pathname.startsWith("/announcements");

  useEffect(() => {
    if (!item || onBoard) return;
    const seen = localStorage.getItem(SEEN_KEY);
    if (seen !== item.id) {
      const timer = window.setTimeout(() => {
        setOpen(true);
        setExpanded(true);
      }, 1800);
      return () => window.clearTimeout(timer);
    }

    const pulse = window.setInterval(() => {
      setOpen(true);
      setExpanded(true);
      window.setTimeout(() => setExpanded(false), 6500);
    }, INTERVAL_MS);

    return () => window.clearInterval(pulse);
  }, [item, onBoard]);

  useEffect(() => {
    if (onBoard) {
      setOpen(false);
      setExpanded(false);
    }
  }, [onBoard]);

  if (!item || !open || onBoard) return null;

  function dismiss() {
    localStorage.setItem(SEEN_KEY, item!.id);
    setOpen(false);
    setExpanded(false);
  }

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
                  src={item.image}
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
                  {t(item.title)}
                </p>
                <p className="mt-1 text-sm text-smoke">{t(item.excerpt)}</p>
                <Link
                  href="/announcements"
                  onClick={dismiss}
                  className="mt-3 inline-flex text-[0.62rem] uppercase tracking-[0.16em] text-amber-bright hover:text-parchment"
                >
                  {ui.pages.announcements.viewAll}
                </Link>
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
