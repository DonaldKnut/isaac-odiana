"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";
import { IconBadge } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { RequestModal } from "@/components/request-modal";
import { formatSlotRange } from "@/lib/date";
import { resolveLocalized } from "@/lib/i18n/localize-content";
import { sessionCovers, studioMedia } from "@/lib/media";
import { formatMoney } from "@/lib/utils";
import type { SessionWithSlots } from "@/lib/tutoring";

export function TutoringStudio({
  sessions,
  bookedId,
  cancelled,
}: {
  sessions: SessionWithSlots[];
  bookedId?: string;
  cancelled?: boolean;
}) {
  const { t, locale } = useLocale();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );

  return (
    <>
      {(bookedId || cancelled) && (
        <div className="mx-auto max-w-7xl px-6 pt-8 md:px-10">
          {bookedId ? (
            <p className="border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber-bright">
              {t.tutoring.bookedPrefix}{" "}
              <span className="text-parchment">{bookedId}</span>.{" "}
              {t.tutoring.bookedSuffix}
            </p>
          ) : (
            <p className="border border-line px-4 py-3 text-sm text-smoke">
              {t.tutoring.checkoutCancelled}
            </p>
          )}
        </div>
      )}

      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          <Image
            src={studioMedia.mentorship}
            alt=""
            fill
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/90 to-ink" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-10 md:py-20">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t.tutoring.liveAvailability}
            </p>
            <h2 className="mt-3 font-display text-3xl text-parchment md:text-5xl">
              {t.tutoring.chooseSession}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setRequestOpen(true)}
            className="cursor-pointer border border-amber/40 px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-amber-bright transition hover:bg-amber/10"
          >
            {t.tutoring.requestCustom}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {sessions.map((session, index) => {
            const cover = sessionCovers[session.slug] ?? studioMedia.studio;
            const title = resolveLocalized(
              session.title,
              session.titleFr,
              locale,
            );
            const description = resolveLocalized(
              session.description,
              session.descriptionFr,
              locale,
            );
            return (
              <motion.article
                key={session.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex flex-col overflow-hidden border border-line bg-ink-soft/40"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <Image
                    src={cover}
                    alt={title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                    {session.durationMin} {t.tutoring.min} ·{" "}
                    {t.meetingTypes[
                      session.meetingType as keyof typeof t.meetingTypes
                    ] ?? session.meetingType.replace("_", " ")}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl text-parchment md:text-3xl">
                      {title}
                    </h3>
                    <IconBadge icon={Sparkles} />
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-smoke">
                    {description}
                  </p>
                  <p className="mt-5 font-display text-2xl text-sand">
                    {formatMoney(session.priceCents, session.currency)}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-line pt-4">
                    {session.slots.slice(0, 3).map((slot) => (
                      <p
                        key={slot.id}
                        className="inline-flex items-center gap-2 text-xs text-sand/70"
                      >
                        <Clock3 className="h-3 w-3 text-brass/80" strokeWidth={1.6} />
                        {formatSlotRange(slot.startsAt, slot.endsAt, locale)}
                      </p>
                    ))}
                    {session.slots.length === 0 ? (
                      <p className="text-xs text-smoke">
                        {t.tutoring.noOpenSlots}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSessionId(session.id)}
                    disabled={session.slots.length === 0}
                    className="mt-8 cursor-pointer bg-parchment px-5 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-amber-bright disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {session.slots.length === 0
                      ? t.tutoring.fullyBooked
                      : t.tutoring.bookThis}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {sessions.length === 0 ? (
          <div className="relative mt-10 overflow-hidden border border-line px-8 py-20 text-center">
            <Image
              src={studioMedia.studio}
              alt=""
              fill
              className="object-cover opacity-25"
              sizes="100vw"
            />
            <div className="relative">
              <IconBadge icon={CalendarDays} className="mx-auto h-14 w-14" />
              <p className="mt-5 font-display text-2xl text-parchment">
                {t.tutoring.comingSoon}
              </p>
              <button
                type="button"
                onClick={() => setRequestOpen(true)}
                className="mt-6 cursor-pointer text-[0.65rem] uppercase tracking-[0.2em] text-amber"
              >
                {t.tutoring.sendRequest}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <BookingModal
        open={Boolean(activeSession)}
        session={activeSession}
        onClose={() => setActiveSessionId(null)}
      />
      <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </>
  );
}
