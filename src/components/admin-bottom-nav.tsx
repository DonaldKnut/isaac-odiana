"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { adminNavIcons } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

export function AdminBottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  const items = [
    {
      href: "/admin",
      label: t.admin.nav.overview,
      icon: LayoutDashboard,
      match: (path: string) => path === "/admin",
    },
    {
      href: "/admin/bookings",
      label: t.admin.nav.bookings,
      icon: adminNavIcons.bookings,
      match: (path: string) => path.startsWith("/admin/bookings"),
    },
    {
      href: "/admin/orders",
      label: t.admin.nav.orders,
      icon: adminNavIcons.orders,
      match: (path: string) => path.startsWith("/admin/orders"),
    },
    {
      href: "/admin/content",
      label: t.admin.nav.content,
      icon: adminNavIcons.content,
      match: (path: string) => path.startsWith("/admin/content"),
    },
    {
      href: "/admin/sessions",
      label: t.admin.nav.sessions,
      icon: adminNavIcons.sessions,
      match: (path: string) => path.startsWith("/admin/sessions"),
    },
  ] as const;

  return (
    <nav
      aria-label="Admin shortcuts"
      className="fixed inset-x-0 bottom-0 z-[88] border-t border-line/80 bg-ink/94 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 px-1 py-1.5 transition",
                active ? "text-amber-bright" : "text-smoke hover:text-parchment",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center border transition",
                  active
                    ? "border-amber/45 bg-ink text-amber-bright shadow-[0_8px_22px_rgba(0,0,0,0.35)]"
                    : "border-transparent",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 1.85 : 1.6} />
              </span>
              <span className="max-w-full truncate text-[0.52rem] uppercase tracking-[0.12em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
