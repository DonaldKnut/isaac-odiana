import { redirect } from "next/navigation";
import { AdminBottomNav } from "@/components/admin-bottom-nav";
import { AdminNav } from "@/components/admin-nav";
import { AdminPageGuide } from "@/components/admin-page-guide";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getRecentNotifications,
  getUnreadNotificationCount,
} from "@/lib/notifications";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [unread, recent] = await Promise.all([
    getUnreadNotificationCount(),
    getRecentNotifications(12),
  ]);

  const notifications = recent.map((item) => ({
    id: item.id,
    kind: item.kind,
    title: item.title,
    body: item.body,
    href: item.href,
    read: item.read,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-ink">
      <AdminNav
        email={session.email}
        unread={unread}
        notifications={notifications}
      />
      <div className="px-3 pb-24 pt-20 min-[360px]:px-5 md:px-8 lg:ml-[16.5rem] lg:px-10 lg:pb-10 lg:pt-[5.5rem]">
        <AdminPageGuide />
        {children}
      </div>
      <AdminBottomNav />
    </div>
  );
}
