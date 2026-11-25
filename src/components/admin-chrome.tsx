"use client";

import { useEffect, useState } from "react";
import { AdminBottomNav } from "@/components/admin-bottom-nav";
import { AdminNav } from "@/components/admin-nav";
import { AdminPageGuide } from "@/components/admin-page-guide";
import type { AdminNotificationItemData } from "@/components/admin-notification-item";
import { cn } from "@/lib/utils";

const DOCK_KEY = "isaac-admin-sidebar-docked";

export function AdminChrome({
  email,
  unread,
  notifications,
  children,
}: {
  email?: string;
  unread: number;
  notifications: AdminNotificationItemData[];
  children: React.ReactNode;
}) {
  const [docked, setDocked] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(DOCK_KEY);
    if (stored === "0") setDocked(false);
    setReady(true);
  }, []);

  function toggleDock() {
    setDocked((value) => {
      const next = !value;
      window.localStorage.setItem(DOCK_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-ink">
      <AdminNav
        email={email}
        unread={unread}
        notifications={notifications}
        docked={docked}
        onToggleDock={toggleDock}
      />
      <div
        className={cn(
          "px-3 pb-24 pt-20 transition-[margin] duration-300 min-[360px]:px-5 md:px-8 lg:pb-10 lg:pt-[5.5rem]",
          ready && docked ? "lg:ml-[16.5rem]" : "lg:ml-[4.75rem]",
        )}
      >
        <AdminPageGuide />
        {children}
      </div>
      <AdminBottomNav />
    </div>
  );
}
