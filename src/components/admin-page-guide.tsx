"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Route, X } from "lucide-react";

type GuideStep = {
  body: string;
  target?: string;
};

type Guide = {
  title: string;
  steps: GuideStep[];
};

const GUIDES: Record<string, Guide> = {
  "/admin": {
    title: "Studio dashboard",
    steps: [
      {
        body: "Read the live counts — orders, bookings, open slots and catalogue size.",
        target: '[data-tour="admin-stats"]',
      },
      {
        body: "Use the capability checklist to confirm Stripe, Resend and Cloudinary keys.",
        target: '[data-tour="admin-checklist"]',
      },
      {
        body: "Open any tile to jump into that workflow.",
        target: '[data-tour="admin-stats"]',
      },
      {
        body: "Customers never sign up: they checkout and book as guests with their email.",
        target: '[data-tour="admin-stats"]',
      },
    ],
  },
  "/admin/content": {
    title: "Edit site content",
    steps: [
      {
        body: "Homepage includes studio feed clips (video / Instagram) that appear publicly after save.",
        target: '[data-tour-nav="/admin/content"]',
      },
      {
        body: "Music works: galleries, sample audio, track previews, and Spotify/Apple/YouTube links.",
        target: '[data-tour-nav="/admin/content"]',
      },
      {
        body: "While logged in, open the public homepage and tap Edit image on any card to replace it live.",
        target: '[data-tour="admin-site-link"]',
      },
      {
        body: "Products are edited under Products; podcasts under Podcast; announcements under Announcements.",
        target: '[data-tour-nav="/admin/products"]',
      },
    ],
  },
  "/admin/announcements": {
    title: "Announcements board",
    steps: [
      {
        body: "Publish mixtapes, episode teases, song drops and restocks.",
        target: '[data-tour-nav="/admin/announcements"]',
      },
      {
        body: "Pinned items rise to the top of the public board and homepage strip.",
        target: '[data-tour-nav="/admin/announcements"]',
      },
      {
        body: "The floating callout appears on non-home pages for unseen drops — never stacked with the newsletter.",
        target: '[data-tour-nav="/admin/announcements"]',
      },
    ],
  },
  "/admin/products": {
    title: "Catalogue",
    steps: [
      {
        body: "Create or edit books and merch with price, stock and gallery images.",
        target: '[data-tour-nav="/admin/products"]',
      },
      {
        body: "Use Edit on any row to update an existing product.",
        target: '[data-tour-nav="/admin/products"]',
      },
      {
        body: "Publish to show on /books or /shop — guests buy with email only.",
        target: '[data-tour-nav="/admin/products"]',
      },
    ],
  },
  "/admin/podcast": {
    title: "Podcast episodes",
    steps: [
      {
        body: "Compose an episode, attach cover + audio, then publish.",
        target: '[data-tour-nav="/admin/podcast"]',
      },
      {
        body: "Use Edit on any row to update title, media or publish state.",
        target: '[data-tour-nav="/admin/podcast"]',
      },
      {
        body: "Published episodes appear on /podcast for listening.",
        target: '[data-tour-nav="/admin/podcast"]',
      },
    ],
  },
  "/admin/sessions": {
    title: "Tutoring sessions",
    steps: [
      {
        body: "Create session types (price, duration, EN/FR copy).",
        target: '[data-tour-nav="/admin/sessions"]',
      },
      {
        body: "Add open calendar slots customers can book on /tutoring.",
        target: '[data-tour-nav="/admin/sessions"]',
      },
      {
        body: "Booked slots lock until payment webhook confirms or you manage them.",
        target: '[data-tour-nav="/admin/sessions"]',
      },
    ],
  },
  "/admin/bookings": {
    title: "Bookings & requests",
    steps: [
      {
        body: "Slot bookings show guest name + email and session time.",
        target: '[data-tour-nav="/admin/bookings"]',
      },
      {
        body: "Mentorship requests are custom-time enquiries from the Book modal.",
        target: '[data-tour-nav="/admin/bookings"]',
      },
      {
        body: "Reply from this page — guests receive your message by email.",
        target: '[data-tour-nav="/admin/bookings"]',
      },
    ],
  },
  "/admin/orders": {
    title: "Orders & customers",
    steps: [
      {
        body: "Each order stores customer email (and name when provided) — no account required.",
        target: '[data-tour-nav="/admin/orders"]',
      },
      {
        body: "Expand a row to see line items, totals and fulfilment context.",
        target: '[data-tour-nav="/admin/orders"]',
      },
      {
        body: "Status moves to PAID when the Stripe webhook confirms payment.",
        target: '[data-tour-nav="/admin/orders"]',
      },
    ],
  },
  "/admin/notifications": {
    title: "Full notifications inbox",
    steps: [
      {
        body: "This page is the archive — day-to-day alerts open from the bell modal.",
        target: '[data-tour="admin-alerts"]',
      },
      {
        body: "Expand any notification for detail, then mark read or open the related page.",
        target: '[data-tour="admin-alerts"]',
      },
      {
        body: "Newsletter subscribers are listed below for audience tracking.",
        target: '[data-tour="admin-alerts"]',
      },
    ],
  },
};

const STUDIO_TOUR: Guide = {
  title: "Studio tour",
  steps: [
    {
      body: "This dashboard runs the public Isaac Odiana site — content, catalogue, sessions and guest commerce.",
      target: '[data-tour="admin-stats"]',
    },
    {
      body: "Use Content for homepage/music copy, Announcements for drops and mixtapes, Products for the shop.",
      target: '[data-tour-nav="/admin/content"]',
    },
    {
      body: "Sessions + Bookings cover tutoring. Reply to guests from Bookings so they get your email.",
      target: '[data-tour-nav="/admin/sessions"]',
    },
    {
      body: "Orders track Stripe checkouts by guest email. Alerts stay in the bell for quick triage.",
      target: '[data-tour="admin-alerts"]',
    },
    {
      body: "On desktop, dock or collapse the sidebar. Page guides only auto-open the first time — reopen anytime with Page guide.",
      target: '[data-tour="admin-guide-actions"]',
    },
  ],
};

function guideKey(pathname: string) {
  if (pathname === "/admin") return "/admin";
  const match = Object.keys(GUIDES)
    .filter((key) => key !== "/admin")
    .find((key) => pathname.startsWith(key));
  return match ?? "/admin";
}

function TourSpotlight({ selector }: { selector?: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!selector) {
      setRect(null);
      return;
    }

    let frame = 0;
    const measure = () => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      setRect(el.getBoundingClientRect());
    };

    frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [selector]);

  if (!rect) {
    return <div className="pointer-events-none absolute inset-0 bg-ink/70" />;
  }

  const pad = 10;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute rounded-sm border border-amber/70 bg-amber/5 shadow-[0_0_0_9999px_rgba(13,12,11,0.78)] transition-all duration-300"
      style={{
        top: Math.max(8, rect.top - pad),
        left: Math.max(8, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }}
    >
      <span className="absolute -inset-1 animate-pulse rounded-sm border border-amber-bright/40" />
    </div>
  );
}

export function AdminPageGuide() {
  const pathname = usePathname();
  const key = guideKey(pathname);
  const guide = GUIDES[key]!;
  const storageKey = `isaac-admin-guide:${key}`;
  const tourKey = "isaac-admin-studio-tour";

  const [open, setOpen] = useState(false);
  const [tourMode, setTourMode] = useState(false);
  const [step, setStep] = useState(0);
  const activeGuide = tourMode ? STUDIO_TOUR : guide;
  const current = activeGuide.steps[step]!;

  useEffect(() => {
    setStep(0);
    setTourMode(false);
    setOpen(false);
    if (typeof window === "undefined") return;

    if (pathname === "/admin" && !localStorage.getItem(tourKey)) {
      const timer = window.setTimeout(() => {
        setTourMode(true);
        setOpen(true);
      }, 600);
      return () => window.clearTimeout(timer);
    }

    if (localStorage.getItem(storageKey)) return;
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [pathname, storageKey]);

  function dismiss() {
    if (typeof window !== "undefined") {
      if (tourMode) localStorage.setItem(tourKey, "1");
      else localStorage.setItem(storageKey, "1");
    }
    setOpen(false);
    setTourMode(false);
  }

  function openGuide(asTour = false) {
    setTourMode(asTour);
    setStep(0);
    setOpen(true);
  }

  return (
    <>
      <div
        data-tour="admin-guide-actions"
        className="mb-6 flex flex-wrap gap-2"
      >
        <button
          type="button"
          onClick={() => openGuide(false)}
          className="inline-flex items-center gap-2 border border-line px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-sand transition hover:border-amber hover:text-amber-bright"
        >
          <Compass className="h-3.5 w-3.5" strokeWidth={1.6} />
          Page guide
        </button>
        <button
          type="button"
          onClick={() => openGuide(true)}
          className="inline-flex items-center gap-2 border border-line px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-sand transition hover:border-amber hover:text-amber-bright"
        >
          <Route className="h-3.5 w-3.5" strokeWidth={1.6} />
          Studio tour
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TourSpotlight selector={current.target} />

            <button
              type="button"
              className="absolute inset-0 cursor-pointer"
              aria-label="Close guide"
              onClick={dismiss}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="absolute bottom-4 left-1/2 z-[121] w-[min(92vw,28rem)] -translate-x-1/2 border border-line bg-ink-soft p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:bottom-8 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-guide-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                    {tourMode ? "Tour" : "Guide"} · {step + 1}/
                    {activeGuide.steps.length}
                  </p>
                  <h2
                    id="admin-guide-title"
                    className="mt-2 font-display text-3xl text-parchment"
                  >
                    {activeGuide.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  className="cursor-pointer text-smoke hover:text-parchment"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-smoke">
                {current.body}
              </p>

              <div className="mt-8 flex items-center justify-end gap-2">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((value) => value - 1)}
                    className="cursor-pointer border border-line px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-sand"
                  >
                    Back
                  </button>
                ) : null}
                {step < activeGuide.steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((value) => value + 1)}
                    className="cursor-pointer bg-parchment px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-ink"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={dismiss}
                    className="cursor-pointer bg-amber px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-ink"
                  >
                    Got it
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
