"use client";

import Link from "next/link";
import { Bell, X } from "lucide-react";
import { markAllNotificationsRead } from "@/app/actions/notifications";
import {
  AdminNotificationItem,
  type AdminNotificationItemData,
} from "@/components/admin-notification-item";
import { ModalShell } from "@/components/modal-shell";

export function AdminNotificationsModal({
  open,
  onClose,
  notifications,
}: {
  open: boolean;
  onClose: () => void;
  notifications: AdminNotificationItemData[];
}) {
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <ModalShell open={open} onClose={onClose} labelledBy="admin-notes-title">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
        <div>
          <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
            <Bell className="h-3.5 w-3.5" strokeWidth={1.6} />
            Inbox
            {unread > 0 ? ` · ${unread} new` : ""}
          </p>
          <h2
            id="admin-notes-title"
            className="mt-2 font-display text-3xl text-parchment"
          >
            Notifications
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-smoke hover:text-parchment"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-[min(65svh,560px)] space-y-2 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
        {notifications.length === 0 ? (
          <p className="border border-dashed border-line px-4 py-10 text-center text-sm text-smoke">
            No notifications yet — purchases, bookings and enquiries appear here.
          </p>
        ) : (
          notifications.map((item) => (
            <AdminNotificationItem key={item.id} item={item} />
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-7">
        <form action={markAllNotificationsRead}>
          <button
            type="submit"
            className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-smoke hover:text-parchment"
          >
            Mark all read
          </button>
        </form>
        <Link
          href="/admin/notifications"
          onClick={onClose}
          className="bg-parchment px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.18em] text-ink transition hover:bg-amber-bright"
        >
          Open full inbox
        </Link>
      </div>
    </ModalShell>
  );
}
