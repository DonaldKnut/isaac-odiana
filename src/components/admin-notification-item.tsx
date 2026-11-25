"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { markNotificationRead } from "@/app/actions/notifications";
import { cn } from "@/lib/utils";

export type AdminNotificationItemData = {
  id: string;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export function AdminNotificationItem({
  item,
  defaultOpen = false,
}: {
  item: AdminNotificationItemData;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen && !item.read);

  return (
    <article
      className={cn(
        "border",
        item.read ? "border-line/60 opacity-80" : "border-amber/35 bg-amber/5",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.18em] text-amber">
            {item.kind}
            {!item.read ? " · New" : ""}
          </p>
          <p className="mt-1 truncate font-display text-xl text-parchment">
            {item.title}
          </p>
          <p className="mt-1 text-xs text-smoke/70">
            {new Date(item.createdAt).toLocaleString("en-GB")}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-smoke transition duration-300",
            open && "rotate-180 text-amber-bright",
          )}
          strokeWidth={1.6}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-line/70 px-4 py-4">
            <p className="text-sm leading-relaxed text-smoke">{item.body}</p>
            <div className="flex flex-wrap gap-3">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-[0.65rem] uppercase tracking-[0.16em] text-sand hover:text-amber-bright"
                >
                  Open related
                </Link>
              ) : null}
              {!item.read ? (
                <form action={markNotificationRead}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-smoke hover:text-parchment"
                  >
                    Mark read
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
