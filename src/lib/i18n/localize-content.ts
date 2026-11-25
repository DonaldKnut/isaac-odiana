import { pickLocale, type Locale, type LocalizedString } from "@/lib/cms/types";

export function toLocalized(
  en: string,
  fr?: string | null,
): LocalizedString {
  return { en, fr: fr?.trim() ? fr : en };
}

export function resolveLocalized(
  en: string,
  fr: string | null | undefined,
  locale: Locale,
) {
  return pickLocale(toLocalized(en, fr), locale);
}
