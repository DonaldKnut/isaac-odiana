import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { IconBadge, adminStatIcons } from "@/components/illustrations";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { isMailConfigured } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [orders, bookings, episodes, products, requests, slots] =
    await Promise.all([
      prisma.order.count(),
      prisma.booking.count(),
      prisma.podcastEpisode.count(),
      prisma.product.count(),
      prisma.mentorshipRequest.count(),
      prisma.availabilitySlot.count({
        where: { isBooked: false, startsAt: { gte: new Date() } },
      }),
    ]);

  const stats = [
    { label: "Orders", value: String(orders), href: "/admin/orders" },
    { label: "Bookings", value: String(bookings), href: "/admin/bookings" },
    { label: "Open slots", value: String(slots), href: "/admin/sessions" },
    { label: "Requests", value: String(requests), href: "/admin/bookings" },
    { label: "Episodes", value: String(episodes), href: "/admin/podcast" },
    { label: "Products", value: String(products), href: "/admin/products" },
  ] as const;

  const checklist = [
    { done: true, label: "Products create / edit / publish / delete" },
    { done: true, label: "Announcements board + homepage callout" },
    { done: true, label: "Multi-image gallery + uploader UI" },
    { done: true, label: "Podcast episode composer" },
    { done: true, label: "Tutoring sessions + slot manager" },
    { done: true, label: "Bookings + mentorship reply inbox" },
    { done: true, label: "Orders table" },
    { done: true, label: "Stripe webhook endpoint (/api/stripe/webhook)" },
    { done: isMailConfigured(), label: "Resend email keys" },
    { done: isCloudinaryConfigured(), label: "Cloudinary upload keys" },
    { done: Boolean(process.env.STRIPE_SECRET_KEY), label: "Stripe secret key" },
  ];

  return (
    <div>
      <p className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber">
        <LayoutDashboard className="h-3.5 w-3.5" />
        Dashboard
      </p>
      <h1 className="mt-3 font-display text-4xl text-parchment md:text-5xl">
        Studio control
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-smoke">
        Admin-only access. Shoppers and students do not sign up — they checkout
        and book as guests with email (and name). You track every order and
        booking from this panel.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = adminStatIcons[stat.label] as LucideIcon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group border border-line bg-ink-soft/50 px-5 py-6 transition hover:border-brass/50"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-smoke">
                  {stat.label}
                </p>
                <IconBadge
                  icon={Icon}
                  className="transition group-hover:border-amber/50"
                />
              </div>
              <p className="mt-3 font-display text-4xl text-parchment">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 border border-line px-6 py-8">
        <h2 className="font-display text-2xl text-parchment">Capability map</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {checklist.map((item) => (
            <li key={item.label} className="flex gap-3 text-smoke">
              {item.done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-bright" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-smoke/50" />
              )}
              <span className={item.done ? "text-parchment" : undefined}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
