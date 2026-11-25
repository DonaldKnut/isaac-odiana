"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function markNotificationRead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.adminNotification.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
}

export async function markAllNotificationsRead() {
  await prisma.adminNotification.updateMany({
    where: { read: false },
    data: { read: true },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
}
