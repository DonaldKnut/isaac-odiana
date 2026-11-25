"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarHeart,
  Home,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { siteNavIcons } from "@/components/illustrations";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

function NavGlyph({
  icon: Icon,
  active,
  label,
  badge,
}: {
  icon: LucideIcon;
  active: boolean;
  label: string;
  badge?: number;
}) {
  return (
    <span className="relative flex flex-col items-center justify-end">
      <motion.span
        layout
        initial={false}
        animate={
          active
            ? {
                y: -10,
                width: 48,
                height: 48,
                borderColor: "rgba(184, 146, 74, 0.55)",
                backgroundColor: "rgba(11, 10, 9, 1)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
              }
            : {
                y: 0,
                width: 28,
                height: 28,
                borderColor: "rgba(242, 235, 225, 0)",
                backgroundColor: "rgba(11, 10, 9, 0)",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
              }
        }
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative inline-flex items-center justify-center border",
          active ? "text-amber-bright" : "text-current",
        )}
      >
        <Icon
          className={cn(
            "transition-all duration-300",
            active ? "h-5 w-5" : "h-4 w-4",
          )}
          strokeWidth={active ? 1.85 : 1.6}
        />
        {badge && badge > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-amber px-1 text-[0.55rem] font-medium text-ink">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </motion.span>
      <motion.span
        initial={false}
        animate={{
          color: active ? "rgb(212, 176, 106)" : "rgba(139, 128, 116, 1)",
          y: active ? -2 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-1 max-w-full truncate text-[0.55rem] uppercase tracking-[0.14em]"
      >
        {label}
      </motion.span>
    </span>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const { t } = useLocale();

  const onHome = pathname === "/";
  const onBooks =
    pathname === "/books" ||
    pathname.startsWith("/books/") ||
    pathname.startsWith("/products/");
  const onMusic = pathname === "/music" || pathname.startsWith("/music/");
  const onTutoring =
    pathname === "/tutoring" || pathname.startsWith("/tutoring/");

  const left = [
    {
      key: "home",
      href: "/",
      label: t.nav.home,
      icon: Home,
      active: onHome,
    },
    {
      key: "books",
      href: "/books",
      label: t.nav.books,
      icon: siteNavIcons.books,
      active: onBooks,
    },
  ] as const;

  const right = [
    {
      key: "music",
      href: "/music",
      label: t.nav.music,
      icon: siteNavIcons.music,
      active: onMusic,
    },
    {
      key: "tutoring",
      href: "/tutoring",
      label: t.nav.tutoring,
      icon: CalendarHeart,
      active: onTutoring,
    },
  ] as const;

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-[88] border-t border-line/80 bg-ink/92 px-2 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end gap-1">
        {left.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className="flex min-w-0 flex-col items-center px-1 py-1 text-smoke transition hover:text-parchment"
            >
              <NavGlyph icon={Icon} active={item.active} label={item.label} />
            </Link>
          );
        })}

        <button
          type="button"
          onClick={openDrawer}
          aria-label={t.nav.cart}
          aria-haspopup="dialog"
          className="flex min-w-0 flex-col items-center px-1 py-1 text-smoke transition hover:text-parchment"
        >
          <NavGlyph
            icon={ShoppingBag}
            active
            label={t.nav.cart}
            badge={count}
          />
        </button>

        {right.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className="flex min-w-0 flex-col items-center px-1 py-1 text-smoke transition hover:text-parchment"
            >
              <NavGlyph icon={Icon} active={item.active} label={item.label} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
