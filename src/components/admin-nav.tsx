"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Home,
  LogOut,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { BrandLogo } from "@/components/brand-logo";
import type { AdminNotificationItemData } from "@/components/admin-notification-item";
import { AdminNotificationsModal } from "@/components/admin-notifications-modal";
import { adminNavIcons } from "@/components/illustrations";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

export function AdminNav({
  email,
  unread = 0,
  notifications = [],
  docked = true,
  onToggleDock,
}: {
  email?: string;
  unread?: number;
  notifications?: AdminNotificationItemData[];
  docked?: boolean;
  onToggleDock?: () => void;
}) {
  const { t } = useLocale();
  const pathname = usePathname();
  const [notesOpen, setNotesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const items = [
    { href: "/admin", label: t.admin.nav.overview, icon: adminNavIcons.overview },
    { href: "/admin/content", label: t.admin.nav.content, icon: adminNavIcons.content },
    {
      href: "/admin/announcements",
      label: t.admin.nav.announcements,
      icon: Megaphone,
    },
    { href: "/admin/products", label: t.admin.nav.products, icon: adminNavIcons.products },
    { href: "/admin/podcast", label: t.admin.nav.podcast, icon: adminNavIcons.podcast },
    { href: "/admin/sessions", label: t.admin.nav.sessions, icon: adminNavIcons.sessions },
    { href: "/admin/bookings", label: t.admin.nav.bookings, icon: adminNavIcons.bookings },
    { href: "/admin/orders", label: t.admin.nav.orders, icon: adminNavIcons.orders },
  ];

  const activeItem =
    items.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    ) ?? items[0]!;

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sidebarOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-ink/95 backdrop-blur-xl">
        <div
          className={cn(
            "flex h-14 items-center justify-between gap-2 px-3 transition-[padding] duration-300 min-[360px]:h-16 min-[360px]:gap-3 min-[360px]:px-5 md:px-6",
            docked ? "lg:pl-[17.5rem]" : "lg:pl-[5.75rem]",
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5 min-[360px]:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-line text-parchment transition hover:border-amber/50 hover:text-amber-bright min-[360px]:h-10 min-[360px]:w-10 lg:hidden"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" strokeWidth={1.6} />
              ) : (
                <PanelLeftOpen className="h-4 w-4" strokeWidth={1.6} />
              )}
            </button>
            <button
              type="button"
              onClick={onToggleDock}
              className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center border border-line text-parchment transition hover:border-amber/50 hover:text-amber-bright lg:inline-flex"
              aria-label={docked ? "Collapse sidebar" : "Expand sidebar"}
            >
              {docked ? (
                <PanelLeftClose className="h-4 w-4" strokeWidth={1.6} />
              ) : (
                <PanelLeftOpen className="h-4 w-4" strokeWidth={1.6} />
              )}
            </button>

            <div className="hidden min-w-0 items-center gap-4 lg:flex">
              <BrandLogo size="sm" href="/admin" />
              <div className="min-w-0 border-l border-line pl-4">
                <p className="text-[0.6rem] uppercase tracking-[0.22em] text-amber">
                  Studio control
                </p>
                <p className="truncate font-display text-xl text-parchment">
                  {activeItem.label}
                </p>
              </div>
            </div>

            <div className="min-w-0 lg:hidden">
              <p className="truncate font-display text-lg text-parchment min-[360px]:text-xl">
                {activeItem.label}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-2">
            <LanguageSwitcher className="hidden lg:inline-flex" />
            <button
              type="button"
              data-tour="admin-alerts"
              onClick={() => setNotesOpen(true)}
              className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-line text-sand transition hover:border-amber/45 hover:text-amber-bright min-[360px]:h-10 min-[360px]:w-auto min-[360px]:gap-2 min-[360px]:px-3"
              aria-haspopup="dialog"
              aria-label="Alerts"
            >
              <Bell className="h-4 w-4" strokeWidth={1.6} />
              <span className="hidden text-[0.65rem] uppercase tracking-[0.16em] md:inline">
                Alerts
              </span>
              {unread > 0 ? (
                <span className="absolute -right-1 -top-1 bg-amber px-1 py-0.5 text-[0.55rem] text-ink min-[360px]:static">
                  {unread}
                </span>
              ) : null}
            </button>
            <Link
              href="/"
              data-tour="admin-site-link"
              className="hidden h-10 items-center gap-2 border border-line px-3 text-sand transition hover:border-amber/45 hover:text-amber-bright md:inline-flex"
            >
              <Home className="h-4 w-4" strokeWidth={1.6} />
              <span className="hidden text-[0.65rem] uppercase tracking-[0.16em] lg:inline">
                {t.auth.backHome}
              </span>
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-line text-smoke transition hover:border-amber/45 hover:text-amber-bright min-[360px]:h-10 min-[360px]:w-auto min-[360px]:gap-2 min-[360px]:px-3"
                aria-label={t.admin.signOut}
              >
                <LogOut className="h-4 w-4" strokeWidth={1.6} />
                <span className="hidden text-[0.65rem] uppercase tracking-[0.16em] lg:inline">
                  {t.admin.signOut}
                </span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {sidebarOpen ? (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-ink-soft transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:z-40 lg:translate-x-0",
          docked ? "lg:w-[16.5rem]" : "lg:w-[4.75rem]",
          "w-[16.5rem]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "border-b border-line",
            docked ? "px-6 py-6" : "px-3 py-5",
          )}
        >
          <div className={cn(!docked && "lg:flex lg:justify-center")}>
            <BrandLogo
              size="sm"
              href="/admin"
              className={cn(!docked && "lg:max-w-[2.75rem]")}
            />
          </div>
          {docked ? (
            <>
              <p className="mt-4 text-[0.65rem] uppercase tracking-[0.28em] text-amber">
                Admin
              </p>
              {email ? (
                <p className="mt-3 truncate text-xs text-smoke">{email}</p>
              ) : null}
            </>
          ) : null}
          <div className="mt-5 space-y-3 lg:hidden">
            <LanguageSwitcher />
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.18em] text-sand transition hover:text-amber-bright"
            >
              <Home className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t.auth.backHome}
            </Link>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-tour-nav={item.href}
                title={item.label}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 text-sm transition",
                  !docked && "lg:justify-center lg:px-2",
                  active
                    ? "border border-amber/35 bg-ink text-parchment"
                    : "border border-transparent text-sand/80 hover:border-line hover:bg-ink/60 hover:text-parchment",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center border transition",
                    active
                      ? "border-amber/45 bg-amber/10 text-amber-bright"
                      : "border-line bg-ink/40 text-brass/80 group-hover:border-amber/30 group-hover:text-amber-bright",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </span>
                <span className={cn(!docked && "lg:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {docked ? (
          <div className="border-t border-line px-6 py-5">
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-smoke">
              Guest commerce · no signup
            </p>
          </div>
        ) : null}
      </aside>

      <AdminNotificationsModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        notifications={notifications}
      />
    </>
  );
}
