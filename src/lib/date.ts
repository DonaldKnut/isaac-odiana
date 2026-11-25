import type { Locale } from "@/lib/cms/types";

export function localeToBcp47(locale: Locale = "en") {
  return locale === "fr" ? "fr-FR" : "en-GB";
}

export function formatSlotRange(
  startsAt: Date | string,
  endsAt: Date | string,
  locale: Locale = "en",
) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const tag = localeToBcp47(locale);

  const day = new Intl.DateTimeFormat(tag, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(start);

  const time = new Intl.DateTimeFormat(tag, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${day} · ${time.format(start)}–${time.format(end)}`;
}

export function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function atHour(base: Date, hour: number, minute = 0) {
  const next = new Date(base);
  next.setHours(hour, minute, 0, 0);
  return next;
}
