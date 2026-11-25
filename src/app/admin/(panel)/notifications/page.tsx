import { Bell, Users } from "lucide-react";
import { markAllNotificationsRead } from "@/app/actions/notifications";
import { AdminNotificationItem } from "@/components/admin-notification-item";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { EmptyStateArt, SectionIconLabel } from "@/components/illustrations";
import { getRecentNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export default async function AdminNotificationsPage() {
  const [notifications, subscribers] = await Promise.all([
    getRecentNotifications(60),
    prisma.newsletterSubscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminPageHeading
          icon={Bell}
          title="Notifications"
          description="Full archive of purchases, newsletters, bookings and enquiries. Day-to-day triage also lives in the Alerts modal."
        />
        <form action={markAllNotificationsRead}>
          <button
            type="submit"
            className="border border-line px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-sand hover:border-amber hover:text-amber-bright"
          >
            Mark all read
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <AdminNotificationItem
            key={item.id}
            item={{
              id: item.id,
              kind: item.kind,
              title: item.title,
              body: item.body,
              href: item.href,
              read: item.read,
              createdAt: item.createdAt.toISOString(),
            }}
          />
        ))}
        {notifications.length === 0 ? (
          <div className="border border-dashed border-line">
            <EmptyStateArt
              icon={Bell}
              title="No notifications yet"
              description="They’ll appear when customers buy, subscribe or enquire."
            />
          </div>
        ) : null}
      </div>

      <div>
        <SectionIconLabel icon={Users}>Audience</SectionIconLabel>
        <h2 className="mt-3 font-display text-3xl text-parchment">
          Newsletter subscribers
        </h2>
        <ul className="mt-5 space-y-2">
          {subscribers.map((sub) => (
            <li
              key={sub.id}
              className="flex justify-between border border-line px-4 py-3 text-sm"
            >
              <span className="text-parchment">
                {sub.name ? `${sub.name} · ` : ""}
                {sub.email}
              </span>
              <span className="text-smoke">
                {sub.createdAt.toLocaleDateString("en-GB")}
              </span>
            </li>
          ))}
          {subscribers.length === 0 ? (
            <li className="text-sm text-smoke">No subscribers yet.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
