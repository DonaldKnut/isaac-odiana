"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
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
}) {
  await requireAdmin();

  const schema = z.object({
    to: z.string().email(),
    name: z.string().trim().min(1).max(120),
    subject: z.string().trim().min(2).max(160),
    message: z.string().trim().min(8).max(4000),
  });

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Check the reply fields and try again." };
  }

  await sendStudioReplyEmail(parsed.data);
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
  const subject =
    String(formData.get("subject") ?? "").trim() ||
    "Update on your tutoring session";

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { session: true },
  });

  if (!booking) {
    return { ok: false, message: "Booking not found." };
  }

  const result = await sendReply({
    to: booking.guestEmail,
    name: booking.guestName,
    subject,
    message,
  });

  if (!result.ok) return result;

  revalidatePath("/admin/bookings");
  return result;
}
