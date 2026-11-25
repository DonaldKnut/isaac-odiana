import { CalendarCheck2, Inbox } from "lucide-react";
import { AdminGuestReplyForm } from "@/components/admin-guest-reply-form";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { SectionIconLabel } from "@/components/illustrations";
import { formatSlotRange } from "@/lib/date";
import {
  getAllBookings,
  getAllMentorshipRequests,
} from "@/lib/tutoring";

export default async function AdminBookingsPage() {
  const [bookings, requests] = await Promise.all([
    getAllBookings(),
    getAllMentorshipRequests(),
  ]);

  return (
    <div className="space-y-14">
      <div>
        <AdminPageHeading
          icon={CalendarCheck2}
          title="Bookings"
          description="Real slot reservations from the tutoring page. Guests get an automatic confirmation; reply here when you need to follow up."
        />

        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="border border-line bg-ink-soft/40 px-5 py-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="font-display text-xl text-parchment">
                    {booking.guestName}
                  </p>
                  <p className="mt-1 text-sm text-smoke">{booking.guestEmail}</p>
                </div>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-amber">
                  {booking.status}
                </p>
              </div>
              <p className="mt-3 text-sm text-sand">{booking.session.title}</p>
              <p className="mt-1 text-sm text-smoke">
                {formatSlotRange(booking.slot.startsAt, booking.slot.endsAt)}
              </p>
              {booking.meetingUrl ? (
                <p className="mt-2 truncate text-xs text-amber-bright">
                  Meeting · {booking.meetingUrl}
                </p>
              ) : (
                <p className="mt-2 text-xs text-smoke">
                  No meeting link yet — add one in the reply below.
                </p>
              )}
              <AdminGuestReplyForm
                kind="booking"
                id={booking.id}
                guestName={booking.guestName}
                defaultSubject={`Update · ${booking.session.title}`}
                meetingUrl={booking.meetingUrl}
                slotLabel={formatSlotRange(
                  booking.slot.startsAt,
                  booking.slot.endsAt,
                )}
              />
            </article>
          ))}
          {bookings.length === 0 ? (
            <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-smoke">
              No bookings yet.
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <SectionIconLabel icon={Inbox}>Inbox</SectionIconLabel>
        <h2 className="mt-3 font-display text-3xl text-parchment">
          Mentorship requests
        </h2>
        <p className="mt-2 text-sm text-smoke">
          Custom-time requests from the tutoring modal. Reply below and the
          guest receives your message by email.
        </p>

        <div className="mt-8 space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="border border-line bg-ink-soft/40 px-5 py-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-xl text-parchment">
                  {request.name}
                </p>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-amber">
                  {request.status}
                </p>
              </div>
              <p className="mt-1 text-sm text-smoke">{request.email}</p>
              {request.topic ? (
                <p className="mt-3 text-sm text-sand">Topic: {request.topic}</p>
              ) : null}
              {request.preferredTimes ? (
                <p className="mt-1 text-sm text-sand">
                  Preferred: {request.preferredTimes}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-smoke">
                {request.message}
              </p>
              <AdminGuestReplyForm
                kind="request"
                id={request.id}
                guestName={request.name}
                defaultSubject={`Re: ${request.topic ?? "your mentorship request"}`}
              />
            </article>
          ))}
          {requests.length === 0 ? (
            <p className="border border-dashed border-line px-4 py-8 text-center text-sm text-smoke">
              No requests yet.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
