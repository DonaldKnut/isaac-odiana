"use client";

import { useLocale } from "@/components/locale-provider";
import { pickLocale, type LocalizedString } from "@/lib/cms/types";

export function useLocalized() {
  const { locale } = useLocale();
  return (value: LocalizedString) => pickLocale(value, locale);
}
