"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { sendOrderFulfilledEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export type OrderActionState = {
  ok: boolean;
  message: string;
};

export async function markOrderFulfilled(
  _prev: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  await requireAdmin();

  const parsed = z
    .object({
      orderId: z.string().min(1),
      note: z.string().trim().max(2000).optional(),
    })
    .safeParse({
      orderId: String(formData.get("orderId") ?? ""),
      note: String(formData.get("note") ?? "").trim() || undefined,
    });

  if (!parsed.success) {
    return { ok: false, message: "Missing order." };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
  });

  if (!order) {
    return { ok: false, message: "Order not found." };
  }

  if (order.status === "FULFILLED") {
    return { ok: true, message: "Already fulfilled." };
  }

  if (order.status !== "PAID") {
    return {
      ok: false,
      message: "Only paid orders can be marked fulfilled.",
    };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "FULFILLED" },
  });

  await sendOrderFulfilledEmail({
    email: order.email,
    orderId: order.id,
    customerName: order.shippingName,
    note: parsed.data.note,
  });

  revalidatePath("/admin/orders");
  return { ok: true, message: "Marked fulfilled — customer emailed." };
}
