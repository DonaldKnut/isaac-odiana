"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Package,
  PenLine,
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/admin-auth";
import type { AdminNotificationItemData } from "@/components/admin-notification-item";
import { AdminNotificationsModal } from "@/components/admin-notifications-modal";
import { useLocale } from "@/components/locale-provider";

export function AdminPresenceBar({
  email,
  unread = 0,
  notifications = [],
}: {
  email: string;
  unread?: number;
  notifications?: AdminNotificationItemData[];
}) {
  const { t } = useLocale();
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] border-b border-amber/30 bg-ink/95 text-parchment backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 min-[360px]:px-4 md:px-10">
          <div className="min-w-0">
            <p className="truncate text-[0.6rem] uppercase tracking-[0.18em] text-amber">
              Admin · {email}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 min-[360px]:gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-sand transition hover:text-amber-bright"
            >
              <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="hidden sm:inline">{t.admin.nav.overview}</span>
            </Link>
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-sand transition hover:text-amber-bright"
            >
              <PenLine className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="hidden md:inline">{t.admin.nav.content}</span>
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-sand transition hover:text-amber-bright"
            >
              <Package className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="hidden md:inline">{t.admin.nav.products}</span>
            </Link>
            <Link
              href="/admin/orders"
              className="hidden items-center gap-1.5 px-2 py-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-sand transition hover:text-amber-bright sm:inline-flex"
            >
              Orders
            </Link>
            <button
              type="button"
              onClick={() => setNotesOpen(true)}
              className="relative inline-flex cursor-pointer items-center gap-1.5 px-2 py-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-sand transition hover:text-amber-bright"
              aria-haspopup="dialog"
            >
              <Bell className="h-3.5 w-3.5" strokeWidth={1.6} />
              {unread > 0 ? (
                <span className="absolute right-0 top-0 h-1.5 w-1.5 bg-amber" />
              ) : null}
            </button>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-1.5 border border-line px-2 py-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-smoke transition hover:border-amber hover:text-amber-bright"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.6} />
                <span className="hidden min-[420px]:inline">{t.admin.signOut}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <AdminNotificationsModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        notifications={notifications}
      />
    </>
  );
}
