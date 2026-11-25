"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Route, X } from "lucide-react";

type Guide = {
  title: string;
  steps: string[];
};

const GUIDES: Record<string, Guide> = {
  "/admin": {
    title: "Studio dashboard",
    steps: [
      "Read the live counts — orders, bookings, open slots and catalogue size.",
      "Use the capability checklist to confirm Stripe, Resend and Cloudinary keys.",
      "Open any tile to jump into that workflow.",
      "Customers never sign up: they checkout and book as guests with their email.",
    ],
  },
  "/admin/content": {
    title: "Edit site content",
    steps: [
      "Homepage includes studio feed clips (video / Instagram) that appear publicly after save.",
      "Music works: galleries, sample audio, track previews, and Spotify/Apple/YouTube links.",
      "While logged in, open the public homepage and tap Edit image on any card to replace it live.",
      "Products are edited under Products; podcasts under Podcast; announcements under Announcements.",
    ],
  },
  "/admin/announcements": {
    title: "Announcements board",
    steps: [
      "Publish mixtapes, episode teases, song drops and restocks.",
      "Pinned items rise to the top of the public board and homepage strip.",
      "The floating callout on the homepage expands for visitors when something new lands.",
    ],
  },
  "/admin/products": {
    title: "Catalogue",
    steps: [
      "Create or edit books and merch with price, stock and gallery images.",
      "Use Edit on any row to update an existing product.",
      "Publish to show on /books or /shop — guests buy with email only.",
    ],
  },
  "/admin/podcast": {
    title: "Podcast episodes",
    steps: [
      "Compose an episode, attach cover + audio, then publish.",
      "Use Edit on any row to update title, media or publish state.",
      "Published episodes appear on /podcast for listening.",
    ],
  },
  "/admin/sessions": {
    title: "Tutoring sessions",
    steps: [
      "Create session types (price, duration, EN/FR copy).",
      "Add open calendar slots customers can book on /tutoring.",
      "Booked slots lock until payment webhook confirms or you manage them.",
    ],
  },
  "/admin/bookings": {
    title: "Bookings & requests",
    steps: [
      "Slot bookings show guest name + email and session time.",
      "Mentorship requests are custom-time enquiries from the Book modal.",
      "Reply from this page — guests receive your message by email.",
    ],
  },
  "/admin/orders": {
    title: "Orders & customers",
    steps: [
      "Each order stores customer email (and name when provided) — no account required.",
      "Expand a row to see line items, totals and fulfilment context.",
      "Status moves to PAID when the Stripe webhook confirms payment.",
    ],
  },
  "/admin/notifications": {
    title: "Full notifications inbox",
    steps: [
      "This page is the archive — day-to-day alerts open from the bell modal.",
      "Expand any notification for detail, then mark read or open the related page.",
      "Newsletter subscribers are listed below for audience tracking.",
    ],
  },
};

const STUDIO_TOUR: Guide = {
  title: "Studio tour",
  steps: [
    "This dashboard runs the public Isaac Odiana site — content, catalogue, sessions and guest commerce.",
    "Use Content for homepage/music copy, Announcements for drops and mixtapes, Products for the shop.",
    "Sessions + Bookings cover tutoring. Reply to guests from Bookings so they get your email.",
    "Orders track Stripe checkouts by guest email. Alerts stay in the bell for quick triage.",
    "On desktop, dock or collapse the sidebar. Page guides only auto-open the first time — reopen anytime with Page guide.",
  ],
};

function guideKey(pathname: string) {
  if (pathname === "/admin") return "/admin";
  const match = Object.keys(GUIDES)
    .filter((key) => key !== "/admin")
    .find((key) => pathname.startsWith(key));
  return match ?? "/admin";
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

  useEffect(() => {
    setStep(0);
    setTourMode(false);
    setOpen(false);
    if (typeof window === "undefined") return;

    // Full studio tour once on first dashboard visit.
    if (pathname === "/admin" && !localStorage.getItem(tourKey)) {
      const timer = window.setTimeout(() => {
        setTourMode(true);
        setOpen(true);
      }, 600);
      return () => window.clearTimeout(timer);
    }

    // Per-page guide only the first time that page is opened.
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
      <div className="mb-6 flex flex-wrap gap-2">
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
            className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/75 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-lg border border-line bg-ink-soft p-6 sm:p-7"
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
                {activeGuide.steps[step]}
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
