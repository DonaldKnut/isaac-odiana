"use client";

import { MessageCircle } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { pickLocale, type SiteSettings } from "@/lib/cms/types";

export function WhatsappChat({ settings }: { settings: SiteSettings }) {
  const { locale, t } = useLocale();
  const message = encodeURIComponent(
    pickLocale(settings.whatsappMessage, locale),
  );
  const href = `https://wa.me/${settings.whatsappNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.chat}
      className="group fixed bottom-[5.75rem] left-3 z-[85] inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition hover:scale-105 min-[360px]:left-4 md:bottom-8 md:left-8 md:h-14 md:w-14"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="pointer-events-none absolute left-16 hidden whitespace-nowrap border border-line bg-ink-soft px-3 py-2 text-[0.65rem] uppercase tracking-[0.18em] text-parchment opacity-0 transition group-hover:opacity-100 md:block">
        {t.chat}
      </span>
    </a>
  );
}
