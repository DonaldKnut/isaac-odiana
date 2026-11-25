"use client";

import { useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "@/app/actions/newsletter";
import { useLocale } from "@/components/locale-provider";
import { useToast } from "@/components/toast-provider";
import { UiButton } from "@/components/ui-button";

const STORAGE_KEY = "isaac-newsletter-dismissed";
const DELAY_MS = 18000;
const initial: NewsletterState = { ok: false, message: "" };

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);
  const toast = useToast();
  const { t } = useLocale();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success("Subscribed", state.message);
      localStorage.setItem(STORAGE_KEY, "1");
      setOpen(false);
    } else {
      toast.error("Couldn’t subscribe", state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.message, state.ok]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-ink/70 backdrop-blur-sm"
            aria-label="Dismiss newsletter"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md border border-line bg-ink-soft p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-amber">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t.newsletter.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl text-parchment">
              {t.newsletter.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-smoke">
              {t.newsletter.body}
            </p>

            <form action={action} className="mt-7 space-y-4">
              <input
                name="name"
                placeholder={t.newsletter.name}
                className="w-full border-b border-line bg-transparent py-3 text-parchment outline-none focus:border-amber"
              />
              <input
                type="email"
                name="email"
                required
                placeholder={t.newsletter.email}
                className="w-full border-b border-line bg-transparent py-3 text-parchment outline-none focus:border-amber"
              />
              <UiButton
                type="submit"
                tone="primary"
                className="w-full"
                loading={pending}
                icon={Mail}
              >
                {pending ? t.newsletter.submitting : t.newsletter.submit}
              </UiButton>
            </form>

            <UiButton tone="ghost" className="mt-4 px-0" onClick={dismiss}>
              {t.newsletter.dismiss}
            </UiButton>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
