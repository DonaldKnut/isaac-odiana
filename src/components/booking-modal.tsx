"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import {
  bookTutoringSlot,
  type TutoringActionState,
} from "@/app/actions/tutoring";
import { useLocale } from "@/components/locale-provider";
import { ModalShell } from "@/components/modal-shell";
import { useToast } from "@/components/toast-provider";
import { UiButton } from "@/components/ui-button";
import { formatSlotRange } from "@/lib/date";
import { resolveLocalized } from "@/lib/i18n/localize-content";
import { formatMoney } from "@/lib/utils";
import type { SessionWithSlots } from "@/lib/tutoring";

const initial: TutoringActionState = { ok: false, message: "" };

export function BookingModal({
  open,
  onClose,
  session,
}: {
  open: boolean;
  onClose: () => void;
  session: SessionWithSlots | null;
}) {
  const { t, locale } = useLocale();
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    if (open) setMountKey((value) => value + 1);
  }, [open, session?.id]);

  if (!session) return null;
  const title = resolveLocalized(session.title, session.titleFr, locale);

  return (
    <ModalShell open={open} onClose={onClose} labelledBy="booking-title">
      <div className="border-b border-line px-6 py-5 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-amber">
              <CalendarCheck className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t.booking.eyebrow}
            </p>
            <h2
              id="booking-title"
              className="mt-2 font-display text-3xl text-parchment"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm text-smoke">
              {formatMoney(session.priceCents, session.currency)} ·{" "}
              {session.durationMin} {t.tutoring.min} ·{" "}
              {t.meetingTypes[
                session.meetingType as keyof typeof t.meetingTypes
              ] ?? session.meetingType.replace("_", " ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-2xl leading-none text-smoke transition hover:text-parchment"
            aria-label={t.close}
          >
            ×
          </button>
        </div>
      </div>

      <BookingForm key={mountKey} session={session} onClose={onClose} />
    </ModalShell>
  );
}

function BookingForm({
  session,
  onClose,
}: {
  session: SessionWithSlots;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  const toast = useToast();
  const [slotId, setSlotId] = useState(session.slots[0]?.id ?? "");
  const [state, action, pending] = useActionState(bookTutoringSlot, initial);

  useEffect(() => {
    if (!state.message) return;
    if (!state.ok) {
      toast.error("Booking failed", state.message);
      return;
    }
    if (state.checkoutUrl) {
      toast.info("Redirecting", "Opening Stripe checkout…");
      window.location.href = state.checkoutUrl;
      return;
    }
    toast.success("You’re booked", state.message);
  }, [state, toast]);

  const selectedSlot = useMemo(
    () => session.slots.find((slot) => slot.id === slotId) ?? null,
    [session, slotId],
  );

  return (
    <AnimatePresence mode="wait">
      {state.ok && !state.checkoutUrl ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="px-6 py-10 sm:px-8"
        >
          <p className="font-display text-3xl text-parchment">
            {t.booking.youreBooked}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-smoke">
            {state.message} {t.booking.reference}{" "}
            <span className="text-sand">{state.bookingId}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 cursor-pointer bg-parchment px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-ink"
          >
            {t.close}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={action}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="space-y-6 px-6 py-8 sm:px-8"
        >
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="slotId" value={slotId} />

          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-smoke">
              {t.booking.openSlots}
            </p>
            {session.slots.length === 0 ? (
              <p className="mt-3 text-sm text-sand">{t.booking.noSlots}</p>
            ) : (
              <div className="mt-3 grid gap-2">
                {session.slots.map((slot) => {
                  const active = slot.id === slotId;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSlotId(slot.id)}
                      className={`cursor-pointer border px-4 py-3 text-left text-sm transition ${
                        active
                          ? "border-amber bg-amber/10 text-parchment"
                          : "border-line text-sand hover:border-amber/40"
                      }`}
                    >
                      {formatSlotRange(slot.startsAt, slot.endsAt, locale)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-smoke">
              {t.booking.fullName}
            </span>
            <input
              name="guestName"
              required
              className="mt-2 w-full border-b border-line bg-transparent py-3 text-parchment outline-none focus:border-amber"
            />
          </label>

          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-smoke">
              {t.booking.email}
            </span>
            <input
              type="email"
              name="guestEmail"
              required
              className="mt-2 w-full border-b border-line bg-transparent py-3 text-parchment outline-none focus:border-amber"
            />
          </label>

          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-smoke">
              {t.booking.notes}
            </span>
            <textarea
              name="notes"
              rows={3}
              className="mt-2 w-full border border-line bg-ink px-3 py-3 text-parchment outline-none focus:border-amber"
              placeholder={t.booking.notesPlaceholder}
            />
          </label>

          {selectedSlot ? (
            <p className="text-sm text-smoke">
              {t.booking.selected}{" "}
              <span className="text-sand">
                {formatSlotRange(
                  selectedSlot.startsAt,
                  selectedSlot.endsAt,
                  locale,
                )}
              </span>
            </p>
          ) : null}

          {state.message && !state.ok ? (
            <p className="text-sm text-amber-bright">{state.message}</p>
          ) : null}

          <UiButton
            type="submit"
            tone="amber"
            className="w-full"
            loading={pending}
            disabled={!slotId}
            icon={CalendarCheck}
          >
            {pending ? t.booking.reserving : t.booking.confirm}
          </UiButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
