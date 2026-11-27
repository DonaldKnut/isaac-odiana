"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarHeart, Send, X } from "lucide-react";
import { MentorshipRequestForm } from "@/components/mentorship-request-form";
import { useLocale } from "@/components/locale-provider";
import { ModalShell } from "@/components/modal-shell";
import { isaacMedia } from "@/lib/media";

const promoSlides = [
  isaacMedia.images.valencePortrait,
  isaacMedia.images.reborn1,
  isaacMedia.images.reborn2,
  isaacMedia.images.reborn4,
];

export function BookCtaModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % promoSlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <ModalShell open={open} onClose={onClose} labelledBy="book-cta-title" size="xl">
      <div className="grid max-h-[min(92svh,900px)] md:grid-cols-2">
        <div className="relative flex min-h-[240px] flex-col border-b border-line md:min-h-[min(92svh,900px)] md:border-b-0 md:border-r">
          <div className="relative min-h-[200px] flex-1 overflow-hidden md:absolute md:inset-0">
            <AnimatePresence mode="sync">
              <motion.div
                key={promoSlides[slide]}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={promoSlides[slide]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
          </div>

          <div className="relative z-10 mt-auto space-y-4 bg-gradient-to-t from-ink via-ink/95 to-transparent px-5 pb-6 pt-10 sm:px-7 md:absolute md:inset-x-0 md:bottom-0 md:bg-transparent md:px-9 md:pb-9 md:pt-24">
            <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-amber">
              <CalendarHeart className="h-3.5 w-3.5 shrink-0" />
              {t.bookModal.eyebrow}
            </p>
            <h2
              id="book-cta-title"
              className="font-display text-3xl leading-tight text-parchment md:text-4xl"
            >
              {t.bookModal.title}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-sand/90">
              {t.bookModal.body}
            </p>
            <Link
              href="/tutoring"
              onClick={onClose}
              className="inline-flex items-center gap-2 bg-parchment px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-ink transition hover:bg-amber-bright"
            >
              {t.bookModal.seeSessions}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="flex gap-2 pt-1">
              {promoSlides.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => setSlide(index)}
                  className={`h-1.5 w-7 cursor-pointer transition ${
                    index === slide
                      ? "bg-amber"
                      : "bg-parchment/30 hover:bg-parchment/55"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex max-h-[min(92svh,900px)] flex-col overflow-hidden">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-8">
            <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
              <Send className="h-3.5 w-3.5" />
              {t.bookModal.orRequest}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-smoke transition hover:text-parchment"
              aria-label={t.close}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7">
            <MentorshipRequestForm compact onSuccessClose={onClose} />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
