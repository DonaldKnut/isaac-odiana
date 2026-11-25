import { prisma } from "@/lib/prisma";

export async function getPublishedSessionsWithSlots() {
  return prisma.tutoringSession.findMany({
    where: { published: true },
    include: {
      slots: {
        where: {
          isBooked: false,
          startsAt: { gte: new Date() },
        },
        orderBy: { startsAt: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });
}

export type SessionWithSlots = {
  id: string;
  slug: string;
  title: string;
  titleFr: string | null;
  description: string;
  descriptionFr: string | null;
  priceCents: number;
  currency: string;
  durationMin: number;
  meetingType: string;
  slots: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
  }>;
};

export function toSessionCards(
  sessions: Awaited<ReturnType<typeof getPublishedSessionsWithSlots>>,
): SessionWithSlots[] {
  return sessions.map((session) => ({
    id: session.id,
    slug: session.slug,
    title: session.title,
    titleFr: session.titleFr,
    description: session.description,
    descriptionFr: session.descriptionFr,
    priceCents: session.priceCents,
    currency: session.currency,
    durationMin: session.durationMin,
    meetingType: session.meetingType,
    slots: session.slots.map((slot) => ({
      id: slot.id,
      startsAt: slot.startsAt.toISOString(),
      endsAt: slot.endsAt.toISOString(),
    })),
  }));
}

export async function getAllBookings() {
  return prisma.booking.findMany({
    include: {
      session: true,
      slot: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllMentorshipRequests() {
  return prisma.mentorshipRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
}
