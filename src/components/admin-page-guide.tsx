"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, X } from "lucide-react";

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
      "Homepage, music works and WhatsApp settings live here in EN + FR.",
      "While logged in, open the public homepage and tap Edit image on any card to replace it live.",
      "Save each tab after editing — changes appear on the public site.",
      "Music works support multi-image galleries for the modal slider.",
    ],
  },
  "/admin/products": {
    title: "Catalogue",
    steps: [
      "Create books or merch with price, stock and gallery images.",
      "Publish to show on /books or /shop — guests buy with email only.",
      "Keep digital download URLs ready for fulfilment after payment.",
    ],
  },
  "/admin/podcast": {
    title: "Podcast episodes",
    steps: [
      "Compose an episode, attach cover + audio, then publish.",
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
      "Follow up by email — guests are identified by the address they entered.",
    ],
  },
  "/admin/orders": {
    title: "Orders & customers",
    steps: [
      "Each order stores customer email (and name when provided) — no account required.",
      "Expand a row to see line items, totals and fulfilment context.",
      "Status moves to PAID when the Stripe webhook confirms payment.",
      "Use the email to contact the buyer and fulfil shipping or digital delivery.",
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

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    if (typeof window === "undefined") return;
    if (localStorage.getItem(storageKey)) return;
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  function dismiss(permanent = true) {
    if (permanent) localStorage.setItem(storageKey, "1");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        className="mb-6 inline-flex items-center gap-2 border border-line px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-sand transition hover:border-amber hover:text-amber-bright"
      >
        <Compass className="h-3.5 w-3.5" strokeWidth={1.6} />
        Page guide
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/75 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-lg border border-line bg-ink-soft p-6 sm:p-7"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-guide-title"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-amber">
                    Guide · {step + 1}/{guide.steps.length}
                  </p>
                  <h2
                    id="admin-guide-title"
                    className="mt-2 font-display text-3xl text-parchment"
                  >
                    {guide.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(false)}
                  className="cursor-pointer text-smoke hover:text-parchment"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-smoke">
                {guide.steps[step]}
              </p>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => dismiss(true)}
                  className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-smoke hover:text-parchment"
                >
                  Don&apos;t show again
                </button>
                <div className="flex gap-2">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep((value) => value - 1)}
                      className="cursor-pointer border border-line px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-sand"
                    >
                      Back
                    </button>
                  ) : null}
                  {step < guide.steps.length - 1 ? (
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
                      onClick={() => dismiss(true)}
                      className="cursor-pointer bg-amber px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-ink"
                    >
                      Got it
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
