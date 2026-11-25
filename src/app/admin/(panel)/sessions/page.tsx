import { CalendarDays } from "lucide-react";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { AdminSessionsPanel } from "@/components/admin-sessions-panel";
import { prisma } from "@/lib/prisma";

export default async function AdminSessionsPage() {
  const sessions = await prisma.tutoringSession.findMany({
    include: {
      slots: {
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });

  const payload = sessions.map((session) => ({
    id: session.id,
    title: session.title,
    titleFr: session.titleFr,
    durationMin: session.durationMin,
    priceCents: session.priceCents,
    currency: session.currency,
    slots: session.slots.map((slot) => ({
      id: slot.id,
      startsAt: slot.startsAt.toISOString(),
      endsAt: slot.endsAt.toISOString(),
      isBooked: slot.isBooked,
    })),
  }));

  return (
    <div>
      <AdminPageHeading
        icon={CalendarDays}
        title="Sessions"
        description="Manage tutoring session types and open booking slots."
      />
      <div className="mt-10">
        <AdminSessionsPanel sessions={payload} />
      </div>
    </div>
  );
}
