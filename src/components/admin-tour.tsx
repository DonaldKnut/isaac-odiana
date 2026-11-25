"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STEPS = [
  {
    title: "Overview",
    body: "Live counts for orders, bookings, open slots, subscribers and catalogue health.",
  },
  {
    title: "Products",
    body: "Create books/merch with multi-image galleries. Publish to the storefront instantly.",
  },
  {
    title: "Podcast",
    body: "Compose episodes, attach audio/covers, then publish to /podcast.",
  },
  {
    title: "Sessions",
    body: "Add tutoring types and open calendar slots customers can book.",
  },
  {
    title: "Bookings & notifications",
    body: "Track paid sessions, mentorship requests, newsletter joins and purchase alerts.",
  },
  {
    title: "Orders",
    body: "Stripe checkouts land here. Webhooks mark PAID and decrement stock.",
  },
];

const STORAGE_KEY = "isaac-admin-tour-done";

export function AdminTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  const current = STEPS[step]!;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        className="mb-8 border border-line px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-sand transition hover:border-amber hover:text-amber-bright"
      >
        Restart studio tour
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/70 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-lg border border-line bg-ink-soft p-7"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-amber">
                Admin tour · {step + 1}/{STEPS.length}
              </p>
              <h2 className="mt-3 font-display text-3xl text-parchment">
                {current.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-smoke">
                {current.body}
              </p>
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={finish}
                  className="text-[0.65rem] uppercase tracking-[0.18em] text-smoke hover:text-parchment"
                >
                  Skip
                </button>
                <div className="flex gap-3">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep((value) => value - 1)}
                      className="border border-line px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-sand"
                    >
                      Back
                    </button>
                  ) : null}
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((value) => value + 1)}
                      className="bg-parchment px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-ink"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={finish}
                      className="bg-amber px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-ink"
                    >
                      Finish
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
