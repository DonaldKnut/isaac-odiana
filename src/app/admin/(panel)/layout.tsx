import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin-chrome";
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
    <AdminChrome
      email={session.email}
      unread={unread}
      notifications={notifications}
    >
      {children}
    </AdminChrome>
  );
}
