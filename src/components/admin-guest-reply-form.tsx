"use client";

import { useActionState, useEffect } from "react";
import {
  replyToBookingGuest,
  replyToMentorshipRequest,
  type AdminReplyState,
} from "@/app/actions/admin-replies";
import { useToast } from "@/components/toast-provider";

const initial: AdminReplyState = { ok: false, message: "" };

export function AdminGuestReplyForm({
  kind,
  id,
  guestName,
  defaultSubject,
  meetingUrl,
  slotLabel,
}: {
  kind: "request" | "booking";
  id: string;
  guestName: string;
  defaultSubject: string;
  meetingUrl?: string | null;
  slotLabel?: string;
}) {
  const toast = useToast();
  const action =
    kind === "request" ? replyToMentorshipRequest : replyToBookingGuest;
  const [state, formAction, pending] = useActionState(action, initial);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success("Sent", state.message);
    else toast.error("Couldn’t send", state.message);
  }, [state, toast]);

  return (
    <form action={formAction} className="mt-4 space-y-3 border-t border-line/70 pt-4">
      <input type="hidden" name={kind === "request" ? "requestId" : "bookingId"} value={id} />
      <label className="block space-y-1.5">
        <span className="text-[0.6rem] uppercase tracking-[0.16em] text-smoke">
          Reply to {guestName}
        </span>
        <input
          name="subject"
          defaultValue={defaultSubject}
          className="w-full border border-line bg-ink px-3 py-2 text-sm text-parchment outline-none focus:border-amber/50"
        />
      </label>

      {kind === "booking" ? (
        <>
          {slotLabel ? (
            <p className="text-xs text-smoke">Session · {slotLabel}</p>
          ) : null}
          <label className="block space-y-1.5">
            <span className="text-[0.6rem] uppercase tracking-[0.16em] text-smoke">
              Meeting link (Zoom / Meet)
            </span>
            <input
              name="meetingUrl"
              type="url"
              defaultValue={meetingUrl ?? ""}
              placeholder="https://meet.google.com/…"
              className="w-full border border-line bg-ink px-3 py-2 text-sm text-parchment outline-none focus:border-amber/50"
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-sand">
            <input
              type="checkbox"
              name="includeCalendar"
              defaultChecked
              className="accent-amber"
            />
            Include Google Calendar link
          </label>
        </>
      ) : null}

      <textarea
        name="message"
        required
        rows={3}
        placeholder="Write your reply — they’ll get this by email."
        className="w-full border border-line bg-ink px-3 py-2 text-sm text-parchment outline-none focus:border-amber/50"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-9 cursor-pointer items-center border border-amber/40 bg-amber/10 px-3 text-[0.65rem] uppercase tracking-[0.16em] text-amber-bright transition hover:bg-amber/20 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send reply"}
      </button>
    </form>
  );
}
