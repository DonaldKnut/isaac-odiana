"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { formatSlotRange } from "@/lib/date";
import { getRequestLocale, tServer } from "@/lib/i18n/server";
import {
  sendBookingConfirmationEmail,
  sendMentorshipRequestEmail,
} from "@/lib/mail";
import { notifyAdmin } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  emailSchema,
  firstZodError,
  nameSchema,
} from "@/lib/validation";

export type TutoringActionState = {
  ok: boolean;
  message: string;
  bookingId?: string;
  checkoutUrl?: string;
};

export async function bookTutoringSlot(
  _prev: TutoringActionState,
  formData: FormData,
): Promise<TutoringActionState> {
  const locale = await getRequestLocale();
  const t = await tServer();

  const bookingSchema = z.object({
    sessionId: z.string().min(1, t.validation.chooseSession),
    slotId: z.string().min(1, t.validation.chooseSlot),
    guestName: nameSchema(locale),
    guestEmail: emailSchema(locale),
    notes: z.string().trim().max(800).optional(),
  });

  const parsed = bookingSchema.safeParse({
    sessionId: formData.get("sessionId"),
    slotId: formData.get("slotId"),
    guestName: formData.get("guestName"),
    guestEmail: formData.get("guestEmail"),
    notes: String(formData.get("notes") ?? "") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: firstZodError(parsed.error, locale) };
  }

  const { sessionId, slotId, guestName, guestEmail, notes } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findFirst({
        where: {
          id: slotId,
          sessionId,
          isBooked: false,
          startsAt: { gte: new Date() },
        },
        include: { session: true },
      });

      if (!slot) {
        throw new Error("SLOT_UNAVAILABLE");
      }

      const booking = await tx.booking.create({
        data: {
          sessionId,
          slotId,
          guestName,
          guestEmail,
          notes,
          status: "PENDING",
          meetingUrl: null,
        },
      });

      await tx.availabilitySlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return { booking, session: slot.session, slot };
    });

    let checkoutUrl: string | undefined;
    const sessionTitle =
      locale === "fr" && result.session.titleFr
        ? result.session.titleFr
        : result.session.title;

    if (stripe) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: guestEmail,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: result.session.currency.toLowerCase(),
              unit_amount: result.session.priceCents,
              product_data: {
                name: sessionTitle,
                description: `Private session · ${result.slot.startsAt.toISOString()}`,
              },
            },
          },
        ],
        success_url: `${appUrl}/tutoring?booked=${result.booking.id}`,
        cancel_url: `${appUrl}/tutoring?cancelled=1`,
        metadata: { bookingId: result.booking.id },
      });

      await prisma.booking.update({
        where: { id: result.booking.id },
        data: { stripeSessionId: session.id },
      });

      checkoutUrl = session.url ?? undefined;
    }

    await sendBookingConfirmationEmail({
      guestName,
      guestEmail,
      sessionTitle,
      slotLabel: formatSlotRange(
        result.slot.startsAt,
        result.slot.endsAt,
        locale,
      ),
      bookingId: result.booking.id,
    });

    await notifyAdmin({
      kind: "BOOKING",
      title: "New tutoring booking",
      body: `${guestName} booked ${result.session.title} · ${formatSlotRange(result.slot.startsAt, result.slot.endsAt, "en")}.`,
      href: "/admin/bookings",
      emailSubject: `Booking · ${result.session.title}`,
      meta: { bookingId: result.booking.id },
    });

    revalidatePath("/tutoring");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/notifications");

    return {
      ok: true,
      message: checkoutUrl
        ? t.messages.slotReserved
        : t.messages.slotBookedNoStripe,
      bookingId: result.booking.id,
      checkoutUrl,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_UNAVAILABLE") {
      return { ok: false, message: t.messages.slotTaken };
    }
    return { ok: false, message: t.messages.bookingFailed };
  }
}

export async function submitMentorshipRequest(
  _prev: TutoringActionState,
  formData: FormData,
): Promise<TutoringActionState> {
  const locale = await getRequestLocale();
  const t = await tServer();

  const requestSchema = z.object({
    name: nameSchema(locale),
    email: emailSchema(locale),
    topic: z.string().trim().max(120).optional(),
    preferredTimes: z
      .string()
      .trim()
      .min(2, t.validation.preferredTimes)
      .max(240),
    message: z
      .string()
      .trim()
      .min(10, t.validation.tellMore)
      .max(1200),
  });

  const parsed = requestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: String(formData.get("topic") ?? "") || undefined,
    preferredTimes: formData.get("preferredTimes"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: firstZodError(parsed.error, locale),
    };
  }

  await prisma.mentorshipRequest.create({
    data: parsed.data,
  });

  await sendMentorshipRequestEmail(parsed.data);

  await notifyAdmin({
    kind: "ENQUIRY",
    title: "Mentorship enquiry",
    body: `${parsed.data.name} (${parsed.data.email}) · ${parsed.data.topic ?? "General"}`,
    href: "/admin/bookings",
    emailSubject: `Enquiry · ${parsed.data.name}`,
  });

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/notifications");

  return {
    ok: true,
    message: t.messages.requestReceived,
  };
}
