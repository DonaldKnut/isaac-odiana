"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getRequestLocale, tServer } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";
import {
  firstZodError,
  positiveIntSchema,
  slugSchema,
} from "@/lib/validation";

export type SessionActionState = {
  ok: boolean;
  message: string;
};

export async function createAvailabilitySlot(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  const locale = await getRequestLocale();
  const t = await tServer();

  const slotSchema = z.object({
    sessionId: z.string().min(1, t.validation.chooseSession),
    startsAt: z.string().min(1, t.validation.pickStart),
    durationMin: positiveIntSchema.default(60),
  });

  const parsed = slotSchema.safeParse({
    sessionId: formData.get("sessionId"),
    startsAt: formData.get("startsAt"),
    durationMin: formData.get("durationMin") || 60,
  });

  if (!parsed.success) {
    return { ok: false, message: firstZodError(parsed.error, locale) };
  }

  const startsAt = new Date(parsed.data.startsAt);
  if (Number.isNaN(startsAt.getTime()) || startsAt < new Date()) {
    return { ok: false, message: t.messages.slotFuture };
  }

  const endsAt = new Date(startsAt);
  endsAt.setMinutes(endsAt.getMinutes() + parsed.data.durationMin);

  await prisma.availabilitySlot.create({
    data: {
      sessionId: parsed.data.sessionId,
      startsAt,
      endsAt,
      isBooked: false,
    },
  });

  revalidatePath("/admin/sessions");
  revalidatePath("/tutoring");
  return { ok: true, message: t.messages.slotAdded };
}

export async function deleteAvailabilitySlot(id: string) {
  const slot = await prisma.availabilitySlot.findUnique({ where: { id } });
  if (!slot || slot.isBooked) return;

  await prisma.availabilitySlot.delete({ where: { id } });
  revalidatePath("/admin/sessions");
  revalidatePath("/tutoring");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createTutoringSession(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  const locale = await getRequestLocale();
  const t = await tServer();
  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "") || slugify(title);

  const sessionSchema = z.object({
    title: z.string().trim().min(2, t.validation.titleRequired),
    titleFr: z.string().trim().optional(),
    slug: slugSchema(locale),
    description: z.string().trim().min(10, t.validation.descriptionDetail),
    descriptionFr: z.string().trim().optional(),
    priceCents: positiveIntSchema,
    durationMin: positiveIntSchema.default(60),
    meetingType: z.string().default("ZOOM"),
    published: z.coerce.boolean().default(true),
  });

  const parsed = sessionSchema.safeParse({
    title,
    titleFr: String(formData.get("titleFr") ?? "") || undefined,
    slug,
    description: formData.get("description"),
    descriptionFr: String(formData.get("descriptionFr") ?? "") || undefined,
    priceCents: formData.get("priceCents"),
    durationMin: formData.get("durationMin") || 60,
    meetingType: formData.get("meetingType") || "ZOOM",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { ok: false, message: firstZodError(parsed.error, locale) };
  }

  try {
    await prisma.tutoringSession.create({
      data: {
        title: parsed.data.title,
        titleFr: parsed.data.titleFr || null,
        slug: parsed.data.slug,
        description: parsed.data.description,
        descriptionFr: parsed.data.descriptionFr || null,
        priceCents: parsed.data.priceCents,
        durationMin: parsed.data.durationMin,
        meetingType: parsed.data.meetingType,
        published: parsed.data.published,
      },
    });
  } catch {
    return { ok: false, message: t.messages.sessionCreateFailed };
  }

  revalidatePath("/admin/sessions");
  revalidatePath("/tutoring");
  return { ok: true, message: t.messages.sessionCreated };
}
