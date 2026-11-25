import { NotificationKind, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendAdminAlertEmail } from "@/lib/mail";

export async function notifyAdmin(input: {
  kind: NotificationKind;
  title: string;
  body: string;
  href?: string;
  meta?: Prisma.InputJsonValue;
  emailSubject?: string;
}) {
  const notification = await prisma.adminNotification.create({
    data: {
      kind: input.kind,
      title: input.title,
      body: input.body,
      href: input.href,
      meta: input.meta,
    },
  });

  await sendAdminAlertEmail({
    subject: input.emailSubject ?? input.title,
    title: input.title,
    body: input.body,
    href: input.href,
  });

  return notification;
}

export async function getUnreadNotificationCount() {
  return prisma.adminNotification.count({ where: { read: false } });
}

export async function getRecentNotifications(limit = 40) {
  return prisma.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
