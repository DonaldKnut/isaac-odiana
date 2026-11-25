import { cookies } from "next/headers";
import type { Locale } from "@/lib/cms/types";
import { getUiDictionary } from "@/lib/i18n/dictionary";

export const LOCALE_COOKIE = "isaac-locale";

export async function getRequestLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(LOCALE_COOKIE)?.value;
  return value === "fr" ? "fr" : "en";
}

export async function tServer() {
  return getUiDictionary(await getRequestLocale());
}
