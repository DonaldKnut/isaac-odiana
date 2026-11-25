"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatSlotRange } from "@/lib/date";
import { sendStudioReplyEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export type AdminReplyState = {
  ok: boolean;
  message: string;
};

async function sendReply(input: {
  to: string;
  name: string;
  subject: string;
  message: string;
  meetingUrl?: string;
  calendarUrl?: string;
  slotLabel?: string;
}) {
  await requireAdmin();

  const schema = z.object({
    to: z.string().email(),
    name: z.string().trim().min(1).max(120),
    subject: z.string().trim().min(2).max(160),
    message: z.string().trim().min(8).max(4000),
    meetingUrl: z.union([z.string().url(), z.literal("")]).optional(),
    calendarUrl: z.union([z.string().url(), z.literal("")]).optional(),
    slotLabel: z.string().optional(),
  });

  const parsed = schema.safeParse({
    ...input,
    meetingUrl: input.meetingUrl ?? "",
    calendarUrl: input.calendarUrl ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: "Check the reply fields and try again." };
  }

  await sendStudioReplyEmail({
    to: parsed.data.to,
    name: parsed.data.name,
    subject: parsed.data.subject,
    message: parsed.data.message,
    meetingUrl: parsed.data.meetingUrl || undefined,
    calendarUrl: parsed.data.calendarUrl || undefined,
    slotLabel: parsed.data.slotLabel,
  });
  return { ok: true, message: "Reply sent to the guest." };
}

export async function replyToMentorshipRequest(
  _prev: AdminReplyState,
  formData: FormData,
): Promise<AdminReplyState> {
  const requestId = String(formData.get("requestId") ?? "");
  const message = String(formData.get("message") ?? "");
  const subject =
    String(formData.get("subject") ?? "").trim() ||
    "Reply from Isaac Odiana Studio";

  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    return { ok: false, message: "Request not found." };
  }

  const result = await sendReply({
    to: request.email,
    name: request.name,
    subject,
    message,
  });

  if (!result.ok) return result;

  await prisma.mentorshipRequest.update({
    where: { id: request.id },
    data: { status: "CONTACTED" },
  });

  revalidatePath("/admin/bookings");
  return result;
}

export async function replyToBookingGuest(
  _prev: AdminReplyState,
  formData: FormData,
): Promise<AdminReplyState> {
  const bookingId = String(formData.get("bookingId") ?? "");
  const message = String(formData.get("message") ?? "");
  const meetingUrl = String(formData.get("meetingUrl") ?? "").trim();
  const includeCalendar = formData.get("includeCalendar") === "on";
  const subject =
    String(formData.get("subject") ?? "").trim() ||
    "Update on your tutoring session";

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { session: true, slot: true },
  });

  if (!booking) {
    return { ok: false, message: "Booking not found." };
  }

  const nextMeetingUrl = meetingUrl || booking.meetingUrl || undefined;
  const slotLabel = formatSlotRange(
    booking.slot.startsAt,
    booking.slot.endsAt,
  );
  const calendarUrl = includeCalendar
    ? googleCalendarUrl({
        title: `${booking.session.title} · Isaac Odiana`,
        startsAt: booking.slot.startsAt,
        endsAt: booking.slot.endsAt,
        details: [
          message,
          nextMeetingUrl ? `Meeting: ${nextMeetingUrl}` : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        location: nextMeetingUrl,
      })
    : undefined;

  const result = await sendReply({
    to: booking.guestEmail,
    name: booking.guestName,
    subject,
    message,
    meetingUrl: nextMeetingUrl,
    calendarUrl,
    slotLabel,
  });

  if (!result.ok) return result;

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      meetingUrl: nextMeetingUrl ?? booking.meetingUrl,
      status:
        booking.status === "PENDING" || booking.status === "CONFIRMED"
          ? "CONFIRMED"
          : booking.status,
      notes: message.slice(0, 500),
    },
  });

  revalidatePath("/admin/bookings");
  return {
    ok: true,
    message: nextMeetingUrl
      ? "Reply sent with meeting link + calendar."
      : "Reply sent to the guest.",
  };
}
