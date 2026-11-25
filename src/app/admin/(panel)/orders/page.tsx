import { WalletCards } from "lucide-react";
import { AdminOrdersTable } from "@/components/admin-orders-table";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.map((order) => ({
    id: order.id,
    email: order.email,
    shippingName: order.shippingName,
    status: order.status,
    totalCents: order.totalCents,
    currency: order.currency,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unitCents: item.unitCents,
    })),
  }));

  return (
    <div>
      <AdminPageHeading
        icon={WalletCards}
        title="Orders"
        description="Track every guest purchase by customer email (and name when given). No public signup — Stripe + webhook marks PAID."
      />

      <div className="mt-10">
        <AdminOrdersTable orders={rows} />
      </div>
    </div>
  );
}
