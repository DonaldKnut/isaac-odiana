import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Bell,
  BookOpen,
  CalendarDays,
  Disc3,
  LayoutDashboard,
  Mic2,
  Package,
  PenLine,
  ShoppingBag,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function NoteIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M22 44c0 4.4-3.1 8-7 8s-7-3.6-7-8 3.1-8 7-8c1.2 0 2.3.3 3.3.7V12l28-6v30c0 4.4-3.1 8-7 8s-7-3.6-7-8 3.1-8 7-8c1.2 0 2.3.3 3.3.7"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-brass"
      />
    </svg>
  );
}

export function BookIllustration({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <path
        d="M12 14h18c4 0 7 3 7 7v29H19c-4 0-7-3-7-7V14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-brass"
      />
      <path
        d="M52 14H34c-4 0-7 3-7 7v29h18c4 0 7-3 7-7V14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-amber"
      />
      <path
        d="M27 21h10M27 28h10"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-smoke"
      />
    </svg>
  );
}

export function WaveIllustration({ className = "h-10 w-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" fill="none" className={className} aria-hidden>
      <path
        d="M2 20c8-12 16-12 24 0s16 12 24 0 16-12 24 0 16 12 24 0 16-12 24 0"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-brass/70"
      />
    </svg>
  );
}

export function EmptyCatalogueArt() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
      <BookIllustration className="h-20 w-20" />
      <WaveIllustration className="mt-4 h-8 w-32" />
    </div>
  );
}

export function EmptyStateArt({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-12 text-center">
      <IconBadge icon={Icon} className="h-14 w-14" />
      <WaveIllustration className="mt-5 h-7 w-28" />
      <p className="mt-5 font-display text-2xl text-parchment">{title}</p>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-smoke">{description}</p>
      ) : null}
    </div>
  );
}

export function IconBadge({
  icon: Icon,
  className,
  tone = "amber",
}: {
  icon: LucideIcon;
  className?: string;
  tone?: "amber" | "line";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center border",
        tone === "amber"
          ? "border-amber/35 bg-amber/10 text-amber-bright"
          : "border-line bg-ink-soft text-sand",
        className,
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
    </span>
  );
}

export function SectionIconLabel({
  icon: Icon,
  children,
  className,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden />
      {children}
    </p>
  );
}

export const adminNavIcons = {
  overview: LayoutDashboard,
  content: PenLine,
  products: Package,
  podcast: Mic2,
  sessions: CalendarDays,
  bookings: CalendarDays,
  orders: WalletCards,
  notifications: Bell,
} as const;

export const siteNavIcons = {
  music: Disc3,
  books: BookOpen,
  podcast: Mic2,
  shop: ShoppingBag,
  tutoring: Sparkles,
  cart: ShoppingBag,
} as const;

export const adminStatIcons = {
  Orders: WalletCards,
  Bookings: CalendarDays,
  "Open slots": CalendarDays,
  Requests: Sparkles,
  Episodes: AudioLines,
  Products: Package,
} as const;
