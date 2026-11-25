"use client";

import { Send, X } from "lucide-react";
import { MentorshipRequestForm } from "@/components/mentorship-request-form";
import { useLocale } from "@/components/locale-provider";
import { ModalShell } from "@/components/modal-shell";

export function RequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLocale();

  return (
    <ModalShell open={open} onClose={onClose} labelledBy="request-title">
      <div className="border-b border-line px-6 py-5 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-amber">
              <Send className="h-3.5 w-3.5" strokeWidth={1.6} />
              {t.request.eyebrow}
            </p>
            <h2
              id="request-title"
              className="mt-2 font-display text-3xl text-parchment"
            >
              {t.request.title}
            </h2>
            <p className="mt-2 text-sm text-smoke">{t.request.body}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-smoke transition hover:text-parchment"
            aria-label={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-[min(70svh,640px)] overflow-y-auto overscroll-contain px-6 py-8 sm:px-8">
        <MentorshipRequestForm onSuccessClose={onClose} />
      </div>
    </ModalShell>
  );
}
