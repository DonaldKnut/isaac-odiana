import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendOrderPaidEmail } from "@/lib/mail";
import { notifyAdmin } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";
import { formatMoney } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = requireStripe();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Webhook secret missing." },
      { status: 400 },
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const already = await prisma.stripeEvent.findUnique({
    where: { id: event.id },
  });
  if (already) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const bookingId = session.metadata?.bookingId;

      if (orderId) {
        const existing = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (existing && existing.status !== "PAID") {
          const order = await prisma.$transaction(async (tx) => {
            for (const item of existing.items) {
              const product = await tx.product.findUnique({
                where: { id: item.productId },
              });
              if (product?.stock != null) {
                await tx.product.update({
                  where: { id: product.id },
                  data: {
                    stock: Math.max(0, product.stock - item.quantity),
                  },
                });
              }
            }

            return tx.order.update({
              where: { id: orderId },
              data: {
                status: "PAID",
                stripeSessionId: session.id,
              },
            });
          });

          await sendOrderPaidEmail({
            email: order.email,
            orderId: order.id,
            totalLabel: formatMoney(order.totalCents, order.currency),
          });

          await notifyAdmin({
            kind: "ORDER",
            title: "Payment received",
            body: `Order ${order.id} paid by ${order.email} · ${formatMoney(order.totalCents, order.currency)}.`,
            href: "/admin/orders",
            emailSubject: `Paid order · ${order.id}`,
            meta: { orderId: order.id },
          });
        }
      }

      if (bookingId) {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { session: true },
        });

        if (booking && booking.status !== "CONFIRMED") {
          const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
              status: "CONFIRMED",
              stripeSessionId: session.id,
              meetingUrl:
                booking.meetingUrl ??
                "Meeting link pending — add Zoom/Meet URL in admin",
            },
          });

          await notifyAdmin({
            kind: "BOOKING",
            title: "Booking paid",
            body: `${updated.guestName} paid for ${booking.session.title}.`,
            href: "/admin/bookings",
            emailSubject: `Paid booking · ${updated.id}`,
            meta: { bookingId: updated.id },
          });
        }
      }
    }

    await prisma.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
      },
    });
  } catch (error) {
    console.error("stripe webhook failed", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
