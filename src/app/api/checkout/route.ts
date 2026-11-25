import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyAdmin } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().max(20),
      }),
    )
    .min(1),
  email: z.string().email(),
  name: z.string().trim().min(2).max(80).optional(),
  idempotencyKey: z.string().min(8).max(200).optional(),
});

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env to buy books and merch.",
      },
      { status: 503 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and cart items." },
      { status: 400 },
    );
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: parsed.data.items.map((item) => item.productId) },
      published: true,
    },
  });

  if (products.length !== parsed.data.items.length) {
    return NextResponse.json(
      { error: "One or more products are unavailable." },
      { status: 400 },
    );
  }

  for (const item of parsed.data.items) {
    const product = products.find((entry) => entry.id === item.productId)!;
    if (product.stock != null && product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product.title} does not have enough stock.` },
        { status: 409 },
      );
    }
  }

  const totalCents = parsed.data.items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId)!;
    return sum + product.priceCents * item.quantity;
  }, 0);

  const currency = products[0]?.currency ?? "EUR";
  const email = parsed.data.email.toLowerCase();

  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        email,
        items: parsed.data.items,
        totalCents,
      }),
    )
    .digest("hex")
    .slice(0, 24);

  const idempotencyKey =
    parsed.data.idempotencyKey ?? `checkout_${fingerprint}_${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      email,
      shippingName: parsed.data.name?.trim() || null,
      status: "PENDING",
      totalCents,
      currency,
      items: {
        create: parsed.data.items.map((item) => {
          const product = products.find((entry) => entry.id === item.productId)!;
          return {
            productId: product.id,
            quantity: item.quantity,
            unitCents: product.priceCents,
            title: product.title,
          };
        }),
      },
    },
  });

  const stripe = requireStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const lineItems = parsed.data.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId)!;
    return {
      quantity: item.quantity,
      price_data: {
        currency: product.currency.toLowerCase(),
        unit_amount: product.priceCents,
        product_data: {
          name: product.title,
          description: product.description.slice(0, 200),
          images: product.coverUrl ? [product.coverUrl] : undefined,
        },
      },
    };
  });

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: email,
        line_items: lineItems,
        success_url: `${appUrl}/cart?success=1&order=${order.id}`,
        cancel_url: `${appUrl}/cart?cancelled=1&order=${order.id}`,
        client_reference_id: order.id,
        metadata: {
          orderId: order.id,
          kind: "order",
        },
        payment_intent_data: {
          metadata: {
            orderId: order.id,
            kind: "order",
          },
        },
      },
      { idempotencyKey: `${idempotencyKey}:${order.id}` },
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    await notifyAdmin({
      kind: "ORDER",
      title: "Checkout started",
      body: `${email} started checkout for ${formatItems(parsed.data.items, products)} (${(totalCents / 100).toFixed(2)} ${currency}).`,
      href: "/admin/orders",
      emailSubject: `Checkout started · ${order.id}`,
      meta: { orderId: order.id },
    });

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });
    console.error(error);
    return NextResponse.json(
      { error: "Could not create Stripe checkout session." },
      { status: 500 },
    );
  }
}

function formatItems(
  items: Array<{ productId: string; quantity: number }>,
  products: Array<{ id: string; title: string }>,
) {
  return items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return `${product?.title ?? "Item"} ×${item.quantity}`;
    })
    .join(", ");
}
