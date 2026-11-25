"use client";

import { useActionState } from "react";
import { CalendarDays, CalendarPlus } from "lucide-react";
import {
  createAvailabilitySlot,
  createTutoringSession,
  deleteAvailabilitySlot,
  type SessionActionState,
} from "@/app/actions/sessions";
import { IconBadge } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { formatSlotRange } from "@/lib/date";
import { resolveLocalized } from "@/lib/i18n/localize-content";

const initial: SessionActionState = { ok: false, message: "" };

type SessionRow = {
  id: string;
  title: string;
  titleFr?: string | null;
  durationMin: number;
  priceCents: number;
  currency: string;
  slots: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    isBooked: boolean;
  }>;
};

export function AdminSessionsPanel({ sessions }: { sessions: SessionRow[] }) {
  const { t, locale } = useLocale();
  const a = t.admin.common;
  const [slotState, slotAction, slotPending] = useActionState(
    createAvailabilitySlot,
    initial,
  );
  const [sessionState, sessionAction, sessionPending] = useActionState(
    createTutoringSession,
    initial,
  );

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        {sessions.map((session) => (
          <article key={session.id} className="border border-line p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <IconBadge icon={CalendarDays} />
                <h2 className="font-display text-2xl text-parchment">
                  {resolveLocalized(session.title, session.titleFr, locale)}
                </h2>
              </div>
              <p className="text-sm text-smoke">
                {session.durationMin} min ·{" "}
                {(session.priceCents / 100).toFixed(2)} {session.currency}
              </p>
            </div>

            <ul className="mt-5 space-y-2">
              {session.slots.map((slot) => (
                <li
                  key={slot.id}
                  className="flex items-center justify-between gap-3 border border-line/70 px-3 py-2 text-sm"
                >
                  <span className="text-sand">
                    {formatSlotRange(slot.startsAt, slot.endsAt, locale)}
                    {slot.isBooked ? ` · ${a.booked}` : ""}
                  </span>
                  {!slot.isBooked ? (
                    <button
                      type="button"
                      onClick={() => deleteAvailabilitySlot(slot.id)}
                      className="cursor-pointer text-[0.65rem] uppercase tracking-[0.14em] text-smoke hover:text-parchment"
                    >
                      {a.remove}
                    </button>
                  ) : null}
                </li>
              ))}
              {session.slots.length === 0 ? (
                <li className="text-sm text-smoke">{a.noSlots}</li>
              ) : null}
            </ul>
          </article>
        ))}
      </div>

      <form action={slotAction} className="space-y-4 border border-line p-6">
        <div className="flex items-center gap-3">
          <IconBadge icon={CalendarPlus} />
          <h3 className="font-display text-2xl text-parchment">{a.addSlot}</h3>
        </div>
        <label className="block text-sm text-smoke">
          {a.session}
          <select
            name="sessionId"
            required
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
            defaultValue={sessions[0]?.id}
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {resolveLocalized(session.title, session.titleFr, locale)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-smoke">
          {a.startsAt}
          <input
            type="datetime-local"
            name="startsAt"
            required
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke">
          {a.durationMin}
          <input
            type="number"
            name="durationMin"
            defaultValue={60}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <button
          type="submit"
          disabled={slotPending || sessions.length === 0}
          className="cursor-pointer bg-amber px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-ink disabled:opacity-50"
        >
          {slotPending ? a.adding : a.addSlot}
        </button>
        {slotState.message ? (
          <p
            className={`text-sm ${slotState.ok ? "text-amber-bright" : "text-sand"}`}
          >
            {slotState.message}
          </p>
        ) : null}
      </form>

      <form action={sessionAction} className="space-y-4 border border-line p-6">
        <div className="flex items-center gap-3">
          <IconBadge icon={CalendarDays} />
          <h3 className="font-display text-2xl text-parchment">{a.newSession}</h3>
        </div>
        <label className="block text-sm text-smoke">
          {a.titleEn}
          <input
            name="title"
            required
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke">
          {a.titleFr}
          <input
            name="titleFr"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke">
          {a.slug}
          <input
            name="slug"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke">
          {a.descriptionEn}
          <textarea
            name="description"
            required
            rows={3}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke">
          {a.descriptionFr}
          <textarea
            name="descriptionFr"
            rows={3}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm text-smoke">
            {a.price}
            <input
              name="priceCents"
              type="number"
              required
              defaultValue={7500}
              className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
            />
          </label>
          <label className="block text-sm text-smoke">
            {a.durationMin}
            <input
              name="durationMin"
              type="number"
              defaultValue={60}
              className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
            />
          </label>
          <label className="block text-sm text-smoke">
            {a.meeting}
            <select
              name="meetingType"
              className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
              defaultValue="ZOOM"
            >
              <option value="ZOOM">Zoom</option>
              <option value="GOOGLE_MEET">Google Meet</option>
            </select>
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm text-smoke">
          <input
            type="checkbox"
            name="published"
            defaultChecked
            className="accent-amber"
          />
          {a.published}
        </label>
        <button
          type="submit"
          disabled={sessionPending}
          className="cursor-pointer bg-parchment px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-ink disabled:opacity-50"
        >
          {sessionPending ? a.saving : a.createSession}
        </button>
        {sessionState.message ? (
          <p
            className={`text-sm ${
              sessionState.ok ? "text-amber-bright" : "text-sand"
            }`}
          >
            {sessionState.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
